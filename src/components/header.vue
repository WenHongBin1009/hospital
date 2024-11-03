<!-- 顶部模块 -->
<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"
        ><Fold
      /></el-icon>
      <ul class="flex-box">
        <li
          class="tab flex-box"
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{ selected: route.path === item.path }"
        >
          <el-icon size="12">
            <component :is="item.icon" />
          </el-icon>
          <router-link class="text flex-box" :to="{ path: item.path }">{{
            item.name
          }}</router-link>
          <el-icon class="close" @click="closeTab(item, index)" size="12">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar
            :src="userInfo.avatar"
          />
          <p class="user-name">{{userInfo.name}}</p>
        </div>
        <template #dropdown>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"

const store = useStore()
const router = useRouter()
const route = useRoute()

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

const selectMenu = computed(() => store.state.menu.selectMenu)
const closeTab = (item, index) => {
  // 触发删除功能
  store.commit("closeMenu", item)
  // 非当前页直接关闭
  if (route.path !== item.path) {
    return
  }
  // 删除当前项判断
  const selectMenuData = selectMenu.value

  if (index == selectMenuData.length) {
    if (!selectMenuData.length) {
      router.push("/")
    }else{
      router.push({
        path: selectMenuData[index-1].path 
      })
    }
  }else{
    router.push({
        path: selectMenuData[index].path 
      })
  }
}

//点击下拉
const handleClick = (command) => {
  //退出登录
  if(command === 'cancel'){
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('Vuepro')
    router.push('/login')
    // window.location.href = window.location.origin
  }
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left {
    height: 100%;
    a {
      height: 100%;
      color: #333;
      font-size: 15px;
    }
    .icon {
      width: 45px;
      height: 100%;
    }
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab {
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover {
      background-color: #f5f5f5;
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }
  .header-right {
    .user-name {
      margin-left: 5px;
    }
  }
}
</style>
