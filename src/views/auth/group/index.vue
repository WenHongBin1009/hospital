<template>
  <panel-head :route="route" />
  <div class="bts">
  <el-button icon="Plus" type="primary" @click="open(null)">添加权限管理</el-button>
  </div>
  <!-- 数据列表 -->
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="name" label="昵称" width="180" />
    <el-table-column prop="permissionName" label="菜单权限" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <div>
          <el-button type="primary" @click="open(scope.row)"> 编辑 </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="pageData.pageNum"
      :page-size="pageData.size"
      size="small"
      background="background"
      layout="prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- 模态框弹窗 -->
  <el-dialog
    v-model="isShow"
    :before-close="beforeClose"
    title="添加权限"
    width="500"
  >
    <el-form
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { userGetMenu, userSetMenu, menuList } from '../../../api'

const route = useRoute()

onMounted(() => {
  userGetMenu().then(({ data }) => {
    permissionData.value = data.data
  })
  getListData()
})
//列表数据
const tableData = reactive({
  list: [],
  total: 0,
})
//打开弹窗
const open = (rowData = {}) => {
  isShow.value = true
  nextTick(() => {
    if (rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}

const pageData = reactive({
  pageNum: 1,
  pageSize: 10,
})

const handleSizeChange = (val) => {
  pageData.pageSize = val
  getListData()
}

const handleCurrentChange = (val) => {
  pageData.pageNum = val
  getListData()
}

// 请求列表数据
const getListData = () => {
  menuList(pageData).then(({ data }) => {
    const { list, total } = data.data
    tableData.list = list
    tableData.total = total
  })
}
//表单实例
const formRef = ref()

//表单数据
const form = reactive({
  id: '',
  name: '',
  permissions: '',
})
// 权限数据
const permissionData = ref([])
//弹窗是否隐藏
const isShow = ref(false)
//关闭弹窗回调
const beforeClose = () => {
  isShow.value = false
  //重置表单
  formRef.value.resetFields()
  //tree重置
  treeRef.value.setCheckedKeys(defaultKeys)
}
const defaultKeys = [4, 5]
const treeRef = ref()

const rules = reactive({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入权限名称',
    }
  ],
})
// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({ name: form.name, permissions, id: form.id }).then(
        ({ data }) => {
          beforeClose()
          getListData()
        }
      )
    } else {
    }
  })
}
</script>

<style lang="less" scoped>
.bts{
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>
