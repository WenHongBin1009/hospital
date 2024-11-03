<template>
  <div class="common-layout">
    <el-container>
      <Aside> 侧边栏菜单 </Aside>

      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <Router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "../components/aside.vue";
import Header from "../components/header.vue";
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
