import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import PanelHead from './components/panelHead.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//刷新后动态路由添加
const localData = localStorage.getItem('Vuepro')
if (localData) {
  store.commit('dynamicMenu', JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach((item) => {
    router.addRoute('main', item)
  })
}

// 前置路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  if (!token && to.path !== '/login') {
    return '/login'
  } 
  else if (token && to.path === '/login') {
    return true
  } else {
    return true
  }
})

app.component('PanelHead', PanelHead)
app.use(router)
app.use(store)
app.mount('#app')
