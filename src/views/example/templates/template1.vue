<template>
  <div>
    <p-switch-form :col="3" :model="query">
      <p-switch-form-item label="姓名">
        <p-input v-model="query.name" />
      </p-switch-form-item>
      <p-switch-form-item label="性别">
        <p-select v-model="query.sex">
          <p-select-option value="">全部</p-select-option>
          <p-select-option value="保密">保密</p-select-option>
          <p-select-option value="男">男</p-select-option>
          <p-select-option value="女">女</p-select-option>
        </p-select>
      </p-switch-form-item>
      <p-switch-form-item label="出生日期">
        <p-date-picker v-model="query.birth"/>
      </p-switch-form-item>
      <p-switch-form-item label="年龄">
        <p-select v-model="query.age">
          <p-select-option value="">全部</p-select-option>
          <p-select-option v-for="(d,i) in 60" :key="i" :value="i">{{i+1}}</p-select-option>
        </p-select>
      </p-switch-form-item>
      <template slot="button">
        <p-button type="primary" @click="search">搜索</p-button>
        <p-button @click="reset">清空</p-button>
      </template>
    </p-switch-form>
    <div class="btn-groups">
      <p-button-group class="btn-groups--left">
        <p-button type="primary" @click="add">新增</p-button>
      </p-button-group>
      <p-button-group class="btn-groups--right">
        <p-button >导入</p-button>
        <p-button >导出</p-button>
        <p-popover
          class="col-config"
          placement="bottom"
          trigger="click"
          :visible="isColCfgVisible"
          @visibleChange="colCfgVisibleChange"
        >
          <p-button>
            <span>列显示</span>
            <p-icon :type="!isColCfgVisible ? 'down' : 'up'" style="margin-left: 0;"/>
          </p-button>
          <div class="col-config-list" slot="content">
            <template v-for="col in columns">
              <div
                v-if="!col.fixed"
                :key="col.key"
                :class="{
                  'col-config-item': true,
                  'col-config-item--active': colCfgCache[col.key]
                }"
                @click="updateColCfgCache(col.key)"
              >
                <span>{{col.title}}</span>
                <p-icon type="check" />
              </div>
            </template>
            <p-button class="col-config-confirm" size="small" @click="updateColCfg">确定</p-button>
          </div>
        </p-popover>
      </p-button-group>
    </div>
    <p-table rowKey="id" :loading="loading" :columns="visibleCols" :data-source="tableData" bordered :pagination="pagination" @change="tablePageChange">
      <template slot="operation" slot-scope="text,record">
        <span>
          <p-button-link @click="edit(record)">编辑</p-button-link>
          <p-button-link type="danger" @click="del(record)">删除</p-button-link>
        </span>
      </template>
    </p-table>
    <p-modal :title="modalTitle" v-bind="modalBtns" v-model="isModalVisible" destroyOnClose>
      <p-form-model ref="modalForm" v-bind="modalFormLayout" :model="modalForm" :rules="modalRules">
        <p-form-model-item label="姓名" prop="name">
          <p-input v-model="modalForm.name" placeholder="请输入姓名"/>
        </p-form-model-item>
        <p-form-model-item label="性别" prop="sex">
          <p-select v-model="modalForm.sex">
            <p-select-option value="保密">保密</p-select-option>
            <p-select-option value="男">男</p-select-option>
            <p-select-option value="女">女</p-select-option>
          </p-select>
        </p-form-model-item>
        <p-form-model-item label="出生日期" prop="birth">
          <p-date-picker v-model="modalForm.birth" />
        </p-form-model-item>
        <p-form-model-item label="年龄">
          <p-input :value="age" readOnly />
        </p-form-model-item>
        <p-form-model-item label="邮箱" prop="email">
          <p-input v-model="modalForm.email" placeholder="请输入邮箱地址"/>
        </p-form-model-item>
      </p-form-model>
    </p-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getTemp1, putTemp1, postTemp1, delTemp1 } from '@/utils/api'
import { http, utils } from 'poros'

const { createForm } = utils
const Form = createForm({
  name: '',
  sex: '保密',
  age: '',
  birth: '',
  email: ''
})

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    isShow: true
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    isShow: true
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    isShow: true
  },
  {
    title: '出生日期',
    dataIndex: 'birth',
    key: 'birth',
    isShow: true
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    isShow: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 120,
    selected: true,
    fixed: 'right',
    scopedSlots: { customRender: 'operation' },
    isShow: true
  }
]


export default {
  data() {
    return {
      collapsed: false,
      loading: false,
      query: new Form({sex: ''}),
      isModalVisible: false,
      modalForm: new Form(),
      modalRules: {
        name: [{ required: true, message: '请输入姓名' }],
        sex: [{ required: true, message: '请选择性别' }],
        birth: [{ required: true, message: '请选择出生日期' }]
      },
      modalFormLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      },
      modalBtns: {
        okButtonProps: {
          on: {
            click: this.modalOk
          }
        },
        cancelButtonProps: {
          on: {
            click: this.modalCancel
          }
        }
      },
      columns,
      colCfgCache: {},
      isColCfgVisible: false,
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        showTotal: total => `共有 ${total} 条数据`
      }
    }
  },
  computed: {
    visibleCols() {
      return this.columns.filter(v => v.fixed || v.isShow)
    },
    modalTitle() {
      return this.modalForm.id ? '编辑' : '新增'
    },
    age() {
      if(this.modalForm.birth) {
        return moment().year() - this.modalForm.birth.year()
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    search() {
      if(!this.loading) this.getTableData()
    },
    reset() {
      this.query.reset()
    },
    colCfgVisibleChange(visible) {
      this.isColCfgVisible = visible
      if(this.isColCfgVisible) {
        this.colCfgCache = this.columns.reduce(function(cache, { key, fixed, isShow }) {
          if(!fixed) cache[key] = isShow
          return cache
        }, {})
      }
    },
    updateColCfgCache(key) {
      this.colCfgCache[key] = !this.colCfgCache[key]
    },
    updateColCfg() {
      this.isColCfgVisible = false
      this.columns.forEach(col => {
        col.isShow = this.colCfgCache[col.key]
      })
    },
    getTableData() {
      this.loading = true
      getTemp1({
        pageNo: this.pagination.current,
        limit: this.pagination.pageSize
      }).then(res => {
        if(res.code === 0) {
          this.tableData = res.data.records
          this.pagination.current = res.data.current
          this.pagination.pages = res.data.pages
          this.pagination.total = res.data.total
        } else {
          this.$message.error({
            content: res.msg
          })
        }
        this.loading = false
      })
    },
    tablePageChange({ current, pageSize }) {
      this.pagination.current = current
      this.pagination.pageSize = pageSize
      this.getTableData()
    },
    add() {
      this.modalForm.init()
      this.isModalVisible = true
    },
    edit(row) {
      this.modalForm = new Form({
        ...row,
        birth: moment(row.birth)
      })
      this.isModalVisible = true
    },
    modalOk() {
      this.$refs.modalForm.validate((valid, obj) => {
        if(!valid) return false
        new Promise(resolve => {
          const params = {
            name: this.modalForm.name,
            sex: this.modalForm.sex,
            age: this.age,
            birth: this.modalForm.birth.format('yyyy-MM-DD')
          }
          if(this.modalForm.id) {
            resolve(postTemp1({ ...params, id: this.modalForm.id }))
          } else {
            resolve(putTemp1(params))
          }
        }).then(res => {
          if(res.code === 0) {
            this.$message.success({ content: this.modalTitle + '成功！' })
            this.isModalVisible = false
            this.getTableData()
          } else {
            this$message.error({ content: res.msg })
          }
        })
      })
    },
    modalCancel() {
      this.isModalVisible = false
    },
    del(row) {
      this.$confirm({
        content: '是否确认删除？',
        onOk: () => {
          delTemp1(row.id).then(res => {
            if(res.code === 0) {
              this.$message.success({ content: '删除成功！' })
              this.getTableData()
            } else {
              this.$message.error({ content: res.msg })
            }
          })
        },
        onCancel: () => {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.btn-groups {
  overflow: hidden;
  margin-bottom: 20px;
  &--left {
    float: left;
  }
  &--right {
    float: right;
  }
}
.col-config-list {
  margin: -7px -16px;
}
.col-config-item {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background: #eaeaeb;
    color: @primary-color;
    cursor: pointer;
  }
  :nth-child(2) {
    opacity: 0;
    margin-left: 10px;
  }
  &--active :nth-child(2) {
    opacity: 1;
  }
}
.col-config-confirm {
  margin: 0 auto;
  display: block;
}
</style>