<template>
  <div class="aside">
    <el-menu router :default-active="activeMenu" class="el-menu-vertical-demo">
      <el-menu-item :index="menuList[0].path">
        <span slot="title">{{ menuList[0].title }}</span>
      </el-menu-item>
      <el-menu-item :index="menuList[2].path">
        <span slot="title">{{ menuList[2].title }}</span>
      </el-menu-item>

      <el-menu-item-group title="我的音乐">
        <el-menu-item :index="menuList[1].path">
          <span slot="title">{{ menuList[1].title }}</span>
        </el-menu-item>
        <el-menu-item :index="menuList[3].path">
          <span slot="title">{{ menuList[3].title }}</span>
        </el-menu-item>
        <!-- <el-menu-item :index="menuList[4].path">
          <span slot="title">{{ menuList[4].title }}</span>
        </el-menu-item> -->
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: "/homepage",
      menuList: [
     
        { path: "/homepage", title: "发现音乐", Login: false, type: 0 },
        { path: "/recomsongs", title: "每日推荐", Login: true, type: 1 },
        { path: "/personalfm", title: "私人FM", Login: true, type: 0 },
        { path: "/historyplay", title: "最近播放", Login: false, type: 1 },
        { path: "/subscribe", title: "我的收藏", Login: true, type: 1 },
      ],
    };
  },

};
</script>

<style lang="less" scoped>
.el-menu-item.is-active {
  color: #303133;
  &:focus {
    color: #313131;
    background-color: #f6f6f7;
    font-weight: bold;
    font-size: 15px;
  }
}
</style>