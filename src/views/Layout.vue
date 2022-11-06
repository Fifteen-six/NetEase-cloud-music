<template>
  <div class="layout">
    <!-- 头部 -->
    <div class="header"><HeaderVue /></div>
    <!-- 内容区域 -->
    <div class="main">
      <!-- 左侧导航栏 -->
      <div class="aside">
        <LeftContent />
      </div>
      <!-- 右侧内容 -->
      
      <div class="main-right">
        <div class="view-mian">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="footer">
      <player />
    </div>
  </div>
</template>

<script>
import player from "../home/player.vue";
import HeaderVue from "@/components/header.vue";
import LeftContent from "@/LeftContent/LeftContent.vue";
export default {
  components: {
    HeaderVue,
    LeftContent,
    player,
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
 
  .header {
    background-color: #ec4141;
    height: 60px;
    width: 100%;
    top: 0;
  }
  .main {
    position: absolute;

    top: 60px;
    left: 0;
    right: 0;
    bottom: 80px;
    height: auto;
    width: auto;
  }
  .main-right {
    position: absolute;
    left: 200px;
    top: 0;
    bottom: 0;
    right: 0;
    height: 100%;
    width: auto;
    
    overflow: auto;
    .view-mian {
      width: 90%;
      height: 90%;
      margin: 20px auto;
      max-width: 1200px;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 80px;
    width: 100%;
  }
}
</style>>
  
