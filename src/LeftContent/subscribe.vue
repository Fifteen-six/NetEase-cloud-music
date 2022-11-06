<template>
  <div class="subscribe">
    <div class="subscribe-heade">
      <div
        class="head"
        :class="{ active: current == index }"
        v-for="(item, index) in ['专辑', '歌手']"
        :key="index"
        @click="handleMenuClick(index)"
      >
        <span>{{ item }}</span>
      </div>
    </div>
    <div class="zhuanji" v-show="current === 0">
      <div class="zhuanji-head">
        <div class="head">
          <span>收藏的专辑({{}})</span>
        </div>
        <div class="input">
          <el-input
            placeholder="搜索收藏专辑"
            clearable
            suffix-icon="el-icon-search"
            v-model="key"
          ></el-input>
        </div>
      </div>
      <div class="zhuanji-title"></div>
    </div>
    <div class="geshou" v-show="current === 1">
      <div class="zhuanji-head">
        <div class="head">
          <span>收藏的歌手{{}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubAlbum } from "@/api/api_album";
export default {
  data() {
    return {
      key: "",
      current: 0,
      zhuanjiList: [], //专辑列表
      cookie: [],
    };
  },
  created() {
    this.getSubAlbum();
  },
  methods: {
    async getSubAlbum() {
      this.cookie = window.localStorage.getItem("cookie");
      let res = await getSubAlbum(this.cookie);

      console.log(res);
    },
    handleMenuClick(index) {
      this.current = index;
    },
  },
};
</script>

<style lang="less" scoped>
.subscribe {
  .subscribe-heade {
    display: flex;

    .head {
      text-align: center;
      height: 60px;
      width: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .active {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 5px solid #d74545;
  }
  .zhuanji-head {
    display: flex;
    justify-content: space-between;
  }
}
</style>