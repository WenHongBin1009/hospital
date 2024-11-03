<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="" />
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{
          formStatu ? '返回登录' : '注册账号'
        }}</el-link>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        style="max-width: 600px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            placeholder="手机号"
            :prefix-icon="'UserFilled'"
          />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="loginForm.passWord"
            type="password"
            placeholder="密码"
            :prefix-icon="'Lock'"
          />
        </el-form-item>
        <el-form-item v-if="formStatu" prop="validCode">
          <el-input
            v-model="loginForm.validCode"
            placeholder="验证码"
            :prefix-icon="'Lock'"
          >
            <template #append>
              <span @click="sendCode">{{ message.mesText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%' }"
            @click="submitForm(loginFormRef)"
          >
            {{ formStatu ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { reactive, ref, computed, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getCode, userAuthentication, login, menuPermissions } from '../../api'

const router = useRouter()
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
// 表单数据
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: '',
})
//当前登录页状态，1为注册，0为登录
const formStatu = ref(0)
// 切换登录、注册
const handleChange = () => {
  formStatu.value = formStatu.value ? 0 : 1
  loginForm.userName = loginForm.passWord = ''
}
// 手机号正则
const phoneReg =
  /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
// 密码正则
const passwordReg = /^[a-zA-Z0-9_-]{4,16}$/
// 账号校验
const validataUser = (rule, value, callback) => {
  if (value === '' || !phoneReg.test(value)) {
    callback(new Error('请输入正确账号'))
  } else {
    callback()
  }
}
// 密码校验
const validataPwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    passwordReg.test(value) ? callback() : callback(new Error('密码格式有误'))
  }
}
// 表单校验
const rules = reactive({
  userName: [
    {
      validator: validataUser,
      trigger: 'blur',
    },
  ],
  passWord: [
    {
      validator: validataPwd,
      trigger: 'blur',
    },
  ],
})
const message = reactive({
  mesText: '获取验证码',
  time: 60,
})
let flag = false
//获取验证码
const sendCode = () => {
  if (flag) return
  //   验证手机号
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: '请检查手机号是否正确',
      type: 'warning',
    })
  }
  const time = setInterval(() => {
    if (message.time <= 0) {
      message.time = 60
      message.mesText = '获取验证码'
      flag = false
      clearInterval(time)
    } else {
      message.time -= 1
      message.mesText = `剩余${message.time}s`
    }
  }, 1000)
  flag = true
  getCode({ tel: loginForm.userName }).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('发送成功')
    }
  })
}
const store = useStore()
const loginFormRef = ref()
const routerList = computed(() => store.state.menu.routerList)

// 表单提交
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (formStatu.value) {
        userAuthentication(loginForm).then(({ data }) => {
          //注册页面
          if (data.code === 10000) {
            ElMessage.success('注册成功')
            formStatu.value = 0
            loginForm.passWord = ''
          }
        })
      } else {
        //登录页面
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            ElMessage.success('登录成功')
            localStorage.setItem('pz_token', data.data.token)
            localStorage.setItem(
              'pz_userInfo',
              JSON.stringify(data.data.userInfo)
            )
            menuPermissions().then(({ data }) => {
              store.commit('dynamicMenu', data.data)
              toRaw(routerList.value).forEach(item => {
                router.addRoute('main',item)
              });
              router.push("/")
            })
          }else{
            ElMessage.warning(data.message)
          }
        })
      }
    } else {
    }
  })
}
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>
