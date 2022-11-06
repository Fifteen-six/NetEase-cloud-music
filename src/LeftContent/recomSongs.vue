<template >
  <div class="recomSongs">
    <div class="recomSongs-head">
      <div class="head-img">
        <div class="img">
          {{ today }}
        </div>
      </div>
      <div class="head-title">
        <h2 class="title-head">每日歌曲推荐</h2>
        <div class="title-text">根据你的音乐口味生成，每天6:00更新</div>
      </div>
    </div>
    <div class="btn-bof" @click="playAll">
      <button class="btn"><i class="iconfont icon-bofang"></i> 播放全部</button>
    </div>
    <div class="line"></div>
    <MusicList :list="list" v-if="showList" ref="clearable"/>
    <el-skeleton v-else :rows="8" animated />
  </div>
</template>

<script>
import MusicList from "../tool/MusicList.vue";
import { getPersonalized, getPlaylistTrack } from "@/api/api_music.js";
export default {
  data() {
    return {
      list: [],
      today: "1",
      showList: false,
      id: "", //歌单id
    };
  },
  components: {
    MusicList,
  },
  created() {
    this.getList();
    this.getToday();
  },
  methods: {
    //播放音乐
     playAll() {
      this.$refs.clearable.playMusicAll();
    },
    async getList() {
      let res = await getPersonalized();
      console.log(res);
      if (res.data.code !== 200) return;
      this.showList = true;
      this.id = res.data.result[0].id;
      console.log(this.id);
      this.playlist();
    },
    async playlist() {
      let res = await getPlaylistTrack(this.id);
      console.log(res);
      this.list = res.data.songs;
    },
    getToday() {
      let day = new Date().getDate();
      day = day < 10 ? "0" + day : "" + day;
      this.today = day;
    },
  },
};
</script>

<style lang="less" scoped>
.recomSongs {
  margin-top: 10px;
  .recomSongs-head {
    display: flex;
    .head-img {
      height: 100px;
      width: 100px;
      background: url("../assets/calendar.png") 0 0/100% no-repeat;
      .img {
        width: 100px;
        height: 40px;
        font-size: 40px;
        color: #ec4141;
        margin-top: 30px;
        text-align: center;
      }
    }
    .head-title {
      margin: 20px 0 0 30px;
      .title-text {
        font-size: 12px;
        color: #676767;
      }
    }
  }
  .btn-bof {
    margin: 10px 0;
    .btn {
      border: none;
      height: 30px;
      padding: 4px 14px;
      border-radius: 15px;
      cursor: pointer;
      background-color: #ec4141;
      color: #fff;
    }
  }
  .line {
    border-top: 1px solid #e0e0e0;
  }
}
</style>