<template>
  <panel-head :route="route" />
  <!-- 数据列表 -->
  <el-table :data="listData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
          scope.row.active ? '正常' : '失效'
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
          <el-button type="primary" @click="open(scope.row)"> 编辑 </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <div class="pagination-info">
      <el-pagination
      v-model:current-page="pageData.pageNum"
      v-model:page-size="pageData.pageSize"
      :background="true"
      layout="prev, pager, next"
      :total="listData.total"
      @update:page-size="handleSizeChange"
      @update:current-page="handleCurrentChange"
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
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" disabled />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="form.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
import { onMounted, reactive, ref } from 'vue'
import { authAdmin, menuSelectList, updateUser } from '../../../api'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

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

//列表数据
const listData = reactive({
  list: [],
  total: 0,
})

//请求列表数据
const getListData = () => {
  authAdmin(pageData).then(({ data }) => {
    const { list, total } = data.data
    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    listData.list = list
    listData.total = total
  })
}

onMounted(() => {
  getListData()
  menuSelectList().then(({ data }) => {
    options.value = data.data
  })
})

const open = (rowData) => {
  isShow.value = true
  Object.assign(form, {
    mobile:rowData.mobile,
    name: rowData.name,
    permissions_id: rowData.permissions_id,
  })
}

//弹窗是否显示
const isShow = ref(false)
//关闭弹窗回调
const beforeClose = () => {
  isShow.value = false
  //重置表单
  formRef.value.resetFields()
}

const rules = reactive({
  name: [{ required: true, trigger: 'blur',message:'请填写昵称' }],
  permissions_id: [{ required: true, trigger: 'blur',message:'请选择菜单权限' }]
})

const formRef = ref()
const form = reactive({
  name: '',
  permissions_id: '',
})

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = form
      updateUser({ name, permissions_id }).then(({ data }) => {
        if (data.code === 10000) {
          isShow.value = false
          getListData()
        }
      })
    } else {
    }
  })
}

const options = ref([])

const permissionName = (id) => {
  const data = options.value.find((el) => el.id === id)
  return data ? data.name : '超级管理员'
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>
