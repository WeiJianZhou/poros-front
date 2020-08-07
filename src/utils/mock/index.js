import Mock from 'mockjs'
import qs from 'querystring'

Mock.setup({
  timeout: '100-200'
})

const Random = Mock.Random

const createTemp1 = () => {
  const age = Random.natural(18, 40)
  const birth = (new Date().getFullYear() - age) + '-' + Random.datetime('MM-dd')
  return {
    id: Random.guid(),
    name: Random.cname(),
    age,
    birth,
    email: Random.email(),
    sex: ['保密', '男', '女'][Random.natural(0,2)]
  }
}
const dataForTemp1 = Array.from({ length: 43 }, createTemp1)
console.log(dataForTemp1)

Mock.mock(/^\/api\/temp1\/?\??(\w+=\w+\&?)*/, 'get', function(req) {
  const params = qs.parse(req.url.split('?')[1])
  let current = +(params.pageNo || 1)
  const size = +(params.limit || 20)
  const pages = Math.ceil(dataForTemp1.length / size)
  current = Math.min(current, pages)
  const START = (current - 1) * size
  const records = dataForTemp1.slice(START, START + size)
  return { code: 0, data: { records, current, size, pages, total: dataForTemp1.length }, msg: 'success' }
})

Mock.mock(/^\/api\/temp1/, 'put', function(req) {
  let params = null
  try {
    params = JSON.parse(req.body)
  } catch(err) {
    params = {}
  }
  dataForTemp1.push({
    ...params,
    id: Random.guid()
  })
  return { code: 0, msg: 'success' }
})

Mock.mock(/^\/api\/temp1/, 'post', function(req) {
  let params = null
  try {
    params = JSON.parse(req.body)
  } catch(err) {
    params = {}
  }
  const index = dataForTemp1.findIndex(data => data.id === params.id)
  if(index > -1) Object.assign(dataForTemp1[index], params)
  return { code: 0, msg: 'success' }
})

Mock.mock(/^\/api\/temp1\/\w+/, 'delete', function(req) {
  const index = dataForTemp1.findIndex(data => data.id === req.url.split('/').pop())
  if(index > -1) dataForTemp1.splice(index, 1)
  return { code: 0, msg: 'success' }
})