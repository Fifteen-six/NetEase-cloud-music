<template>
  <div>
    <div class="search">找到 {{ searchList.length }} 首歌曲</div>
    <div class="line"></div>
    <MusicList :list="searchList" />
  </div>
</template>

<script>
import { search } from "../api/api_album";
import MusicList from "../tool/MusicList.vue";
export default {
  data() {
    return {
      //列表
      searchList: [],
      /* 搜索分页信息 */
      searchInfo: {
        keywords: "",
        limit: 30,
        // offset: 0,
        type: 1,
      },
    };
  },
  components: {
    MusicList,
  },
  props: {
    keywords: {
      type: String,
      required: true,
    },
  },
  methods: {
    async search() {
      console.log(this.searchInfo);
      let res = await search(this.searchInfo);
      if (res.data.code !== 200) return;
      if (Object.keys(res.data.result).length !== 0)
        this.searchList = res.data.result.songs;
    },
  },
  created() {
    this.searchInfo.keywords = this.keywords;
    this.search();
  },
};
</script>

<style lang="less" scoped>
.search {
  font-size: 20px;
  font-weight: 700;
  //   height: 50px;
  padding: 10px;
}
.line{
    margin-top: 10px;
    border: 1px solid rgb(68, 65, 65)
}
</style>