<template>
  <div class="newSong">
    <h2 class="newSong-title">新碟上架</h2>
    <ImgList :list="weekData" />
  </div>
</template>

<script>
import { getTopAlbum } from "@/api/api_play";
import ImgList from "@/tool/ImgList.vue";

export default {
  data() {
    return {
      queryInfo: {
        limit: 30,
        offset: 0,
        area: "ALL",
        type: "new",
        year: "",
        month: "",
      },
      weekData: [],
    };
  },
  created() {
    this.getNewAlbum();
  },
  methods: {
    async getNewAlbum() {
      if (this.weekData.length === 0) {
        let res = await getTopAlbum(this.queryInfo);
        this.weekData = Object.freeze(res.data.weekData).slice(0, 30);
        console.log(this.weekData);
      }
    },
  },
  components: {
    ImgList,
  },
};
</script>

<style lang="less" scoped>
</style>