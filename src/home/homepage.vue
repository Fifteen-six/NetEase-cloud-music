<template>
  <div class="homepage">
    <!-- <div class="VerticalBar"></div> -->
    <div class="homepage_title">
      <ul
        class="add"
        v-for="(item, index) in ['个性推荐', '排行榜', '最新音乐']"
        :key="index"
        :class="{ active: current == index }"
        @click="handleMenuClick(index)"
      >
        <li>{{ item }}</li>
      </ul>
    </div>
    <div class="homepage_banner" v-show="current === 0">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, index) in bannersList" :key="index">
          <img :src="item.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="homepage-img" v-show="current === 0">
      <h2>推荐歌单<i class="iconfont icon-arrow-right"></i></h2>
      <ImgList :list="songList" />
    </div>
    <!-- <div class="song-sheet" v-show="current === 1">
      <playList />
    </div> -->
    <div v-show="current === 1">
      <TopList />
    </div>
    <div v-show="current === 2">
      <newSong />
    </div>
  </div>
</template>

<script>
import playList from "@/home/playList.vue";
import { getBanner } from "@/api/api_home";
import { getRecSongList } from "@/api/api_playlist";
import ImgList from "@/tool/ImgList.vue";
import TopList from "./TopList.vue";
import newSong from "./newSong.vue";
export default {
  data() {
    return {
      current: 0,
      bannersList: [],
      songList: [],
    };
  },
  components: {
    ImgList,
    playList,
    TopList,
    newSong,
  },
  created() {
    this.getbannersList();
    this.getRecSongList();
  },
  methods: {
    handleMenuClick(index) {
      this.current = index;
    },
    //轮播图
    async getbannersList() {
      let res = await getBanner();
      this.bannersList = Object.freeze(res.data.banners);
    },
    //获取推荐歌单
    async getRecSongList() {
      let res = await getRecSongList();
      this.songList = res.data.result;
    },
  },
};
</script>

<style lang="less" scoped>
.homepage {
  height: 100%;
  width: 100%;
  .homepage_title {
    height: 40px;
    cursor: pointer;
    ul {
      float: left;
      padding: 0 10px;
    }
  }
  .homepage_banner {
    img {
      height: 100%;
      width: 100%;
    }
    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }
    .el-carousel__item:nth-child(2n) {
    }
    .el-carousel__item:nth-child(2n + 1) {
    }
  }
}
.active {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 5px solid #d74545;
}
</style>