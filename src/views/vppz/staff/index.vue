<template>
  <panel-head :route="route" />

  <div class="btns">
    <el-button icon="Plus" type="primary" size="small" @click="open(null)"
      >新增</el-button
    >
    <el-popconfirm
      confirm-button-text="是"
      cancel-button-text="否"
      icon="InfoFilled"
      icon-color="#626AEF"
      title="是否确认删除"
      @confirm="confirmEvent"
      @cancel="cancelEvent"
    >
      <template #reference>
        <el-button icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <!-- 数据列表 -->
  <el-table
    :data="listData.list"
    height="480"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column label="头像">
      <template #default="scope">
        <el-image
          style="width: 50px; height: 50px"
          :src="scope.row.avatar"
        ></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别">
      <template #default="scope">
        {{ scope.row.sex === '1' ? '男' : '女' }}
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

  <!-- 新增人员弹窗 -->
  <el-dialog
    v-model="isShow"
    :before-close="beforeClose"
    title="添加人员"
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
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button type="primary" v-if="!form.avatar" @click="imgShow = true"
          >点击上传</el-button
        >
        <el-image
          v-else
          :src="form.avatar"
          style="width: 100px; height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="18" :max="28" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 头像弹窗 -->
  <el-dialog
    v-model="imgShow"
    :before-close="beforeClose"
    title="选择图片"
    width="680"
  >
    <div class="image-list">
      <div
        v-for="(item, index) in fileList"
        :key="item.name"
        class="img-box"
        @click="selectImg = index"
      >
        <div v-if="selectImg === index" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image style="width: 148px; height: 148px" :src="item.url" />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="imgShow = false">取消</el-button>
        <el-button type="primary" @click="confirmImg">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from '../../../api'
import { useRoute } from 'vue-router'

const route = useRoute()

//列表数据
const listData = reactive({
  list: [],
  total: 0,
})

// 请求列表数据
const getListData = () => {
  companionList(pageData).then(({ data }) => {
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
  photoList().then(({ data }) => {
    fileList.value = data.data
  })
})

const isShow = ref(false)
const imgShow = ref(false)
const fileList = ref([])
const selectImg = ref(0)
const confirmImg = () => {
  form.avatar = fileList.value[selectImg.value].url
  imgShow.value = false
}

//关闭弹窗回调
const beforeClose = () => {
  isShow.value = false
  //重置表单
  formRef.value.resetFields()
}

//表单实例
const formRef = ref()
//表单数据
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 18,
  avatar: '',
  name: '',
  sex: '',
})
// 校验规则
const rules = reactive({
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入昵称',
    },
  ],
  avatar: [
    {
      required: true,
      message: '请选择头像',
    },
  ],
  sex: [
    {
      required: true,
      trigger: 'change',
      message: '请选择性别',
    },
  ],
  mobile: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入手机号',
    },
  ],
})

// 表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success('成功')
          beforeClose()
          getListData()
        } else {
          ElMessage.error(data.message)
        }
      })
    } else {
    }
  })
}

//打开弹窗
const open = (rowData = {}) => {
  isShow.value = true
  nextTick(() => {
    //编辑
    if (rowData) {
      Object.assign(form, rowData)
      // treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}

// 分页数据
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

//勾选中的数据
const selectData = ref([])

const handleSelectionChange = (val) => {
  selectData.value = val.map(item => ({id:item.id}))
}

//气泡弹窗（删除功能）
const confirmEvent = () => {
  if (!selectData.value.length) {
    return ElMessage.warning('请选择删除项')
  }
  deleteCompanion({id: selectData.value}).then(({ data }) => {
    if (data.code===10000) {
      getListData()
      ElMessage.success('成功删除')
    }
    else{
      ElMessage.warning('删除失败')
    }
  })
}
const cancelEvent = () => {}
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
