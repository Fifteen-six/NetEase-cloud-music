<template>
  <div class="play-list">
    <div class="jingpin">
      <img src="" alt="" />
    </div>
  </div>
</template>

<script>
import {
  getHighquality,
  getHotCat,
  getPlayListByCat,
} from "@/api/api_playlist";
export default {
  data() {
    return {
      hotCats: [],
      allCats: [],
      queryInfo: {
        limit: 50,
        order: "hot",
        cat: "华语",
        offset: 0,
      },
      pageInfo: {
        total: 0,
        currentPage: 1,
      },

      playList: [],
      highInfo: {},
      isLoading: true,
      hasHighInfo: true,
      tagBtn: "华语",
      showLayer: false,
    };
  },
  created() {
    this.getHotCats();
    this.getPlayList();
  },

  methods: {
    /* 获取热门歌单分类 */
    async getHotCats() {
      const res = await getHotCat();
      console.log("getHotCats", res);
      res.data.tags.forEach((item) => {
        item.isActive = false;
        if (item.name == this.tagBtn) item.isActive = true;
      });
      this.hotCats = res.data.tags;
    },
    /* 获取所有分类 */
    async getAllCats() {
      const res = await getAllCat();
      console.log("getAllCats", res);

      this.allCats = [];
      res.data.sub.forEach((item) => {
        item.isActive = false;
        if (item.name == this.tagBtn) {
          item.isActive = true;
        }
      });
      for (let i = 0; i < 5; i++) {
        this.allCats.push(
          Object.freeze(res.data.sub.filter((item) => item.category === i))
        );
      }
    },
    /* 根据分类获取歌单 */
    async getPlayList() {
      this.isLoading = true;
      this.getHighInfo(this.queryInfo.cat);
      const res = await getPlayListByCat(this.queryInfo);
      console.log("getPlayListByCat", res);
      this.playList = Object.freeze(res.data.playlists);
      this.pageInfo.total = res.data.total;
      this.isLoading = false;
    },
    /* 分页器页数变化的回调 */
    handleCurrentChange(val) {
      console.log(val);
      console.log(this.pageInfo.currentPage);
      this.pageInfo.currentPage = val;
      this.queryInfo.offset = (val - 1) * 50;
      document.querySelector(".main-right").scrollTop = 0;
      this.getPlayList();
    },
    /* 获取精品歌单第一首封面展示 */
    async getHighInfo(cat) {
      const res = await getHighquality(1, cat);
      console.log("getHighquality", res);
      if (res.data.code !== 200) return;
      if (res.data.playlists.length === 0) {
        this.highInfo = {};
        this.hasHighInfo = false;
        return;
      }
      this.highInfo = Object.freeze(res.data.playlists[0]);
      this.hasHighInfo = true;
    },
    changeCat(name) {
      /* 重置页数 */
      this.queryInfo.offset = 0;
      this.pageInfo.currentPage = 1;
      this.queryInfo.cat = name;
      this.tagBtn = name;
      this.hotCats.forEach((item) => {
        if (item.isActive === true) item.isActive = false;
        if (item.name === name) item.isActive = true;
      });
      this.getPlayList();
    },
    /* 全部歌单标签弹出层 开启按钮回调 */
    openLayer() {
      if (this.showLayer) return;
      this.getAllCats();
      this.showLayer = true;
      /* 向window绑定关闭弹出层方法回调 */
      setTimeout(() => {
        window.addEventListener("click", this.closeLayer);
      }, 10);
    },
    /* 关闭弹出层的方法 */
    closeLayer(e) {
      /* 判断触发回调的事件对象的target是否在layer里 */
      if (!this.$refs.layerRef) return;
      if (!this.$refs.layerRef.contains(e.target)) {
        console.log("触发关闭");
        this.showLayer = false;
        window.removeEventListener("click", this.closeLayer);
      }
    },
    /* 从弹出层访问了标签 */
    changefromAll(cat) {
      this.changeCat(cat);
      console.log("主动选择标签关闭");
      this.showLayer = false;
      window.removeEventListener("click", this.closeLayer);
    },
    toPlayListDetail(id) {
      if (typeof id === "number")
        this.$router.push({ path: "/playlistdetail/" + id });
    },
  },
};
</script>

<style>
</style>