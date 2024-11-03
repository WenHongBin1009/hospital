<!-- 侧边栏模块 -->
<template>
  <el-menu
    :style="{ width: !isCollapse ? '200px':'64px'}"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    :collapse="isCollapse"
    :default-active="active"
    @open="handleOpen"
    @close="handleClose"
  >
    <p class="title">{{!isCollapse ? '医院陪诊' : '陪诊'}}</p>

    <sidebarMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>

<script setup>
import sidebarMenu from "./sidebarMenu.vue";
import { reactive,computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore()
const router = useRouter();
const menuData = computed(() => store.state.menu.routerList)
const isCollapse = computed(() => store.state.menu.isCollapse)
const active = computed(()=>store.state.menu.menuActive)
const handleOpen = () => {};
const handleClose = () => {};
</script>
<style lang="less" scoped>
.aside-container {
  height: 100%;
  .title {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
