
import {createRouter, createWebHashHistory} from 'vue-router'



const routes = [
  { 
    path: '/',
    component: () => import('../views/Main.vue'),
    name: 'main',
    redirect: to => {
      const token = localStorage.getItem("pz_token");
      if (!token) {
        return "/login";
      }
      const localData = localStorage.getItem('Vuepro')
      if (localData) {
        const child = JSON.parse(localData).menu.routerList[0].children
        if (child) {
          return child[0].meta.path
        }else{
          return JSON.parse(localData).menu.routerList[0].meta.path
        }
      }
      else{
        return '/'
      }
    },
    children: []
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue')
  },
]

const router = createRouter({
    // 路由匹配模式
    history: createWebHashHistory(),
    // 路由规则
    routes
})

export default router