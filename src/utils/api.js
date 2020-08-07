import { utils } from 'poros'
const { get, put, post, del } = utils.request

export function getTemp1(params) {
  return get('/api/temp1', params)
}

export function putTemp1(params) {
  return put('/api/temp1', params)
}

export function postTemp1(params) {
  return post('/api/temp1', params)
}

export function delTemp1(id) {
  return del('/api/temp1/' + id)
}