<template>
  <div class="historyplay">
    <div class="historyplay-head">
      <div class="head">
        <span>最近播放</span>
        <span>共{{ length }}首</span>
      </div>
      <div class="clear" @click="clearHistory">清除列表</div>
    </div>
    <div class="btn-bof">
      <button class="btn" @click="playAll">
        <i class="iconfont icon-bofang"></i> 播放全部
      </button>
    </div>
    <div class="line"></div>
    <MusicList class="music" ref="Music" :list="historyList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getRecord } from "../api/api_music";
import MusicList from "../tool/MusicList.vue";
export default {
  data() {
    return {
      list: [],
    };
  },
  components: {
    MusicList,
  },
  computed: {
    ...mapState(["historyList"]),
    length() {
      console.log(this.historyList);
      return this.historyList.length;
    },
  },
  created() {
    this.getRecord();
  },
  methods: {
    playAll() {
      this.$refs.Music.playMusicAll();
    },
    async getRecord() {
      let res = await getRecord();
      console.log(res);
    },
    clearHistory() {
      if (!window.localStorage.getItem("historylist")) return;
      this.$store.commit("setHistoryList", {
        type: "clear",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.historyplay {
  .historyplay-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .head {
      span {
        margin-left: 10px;
        font-size: 14px;
        &:nth-child(1) {
          font-weight: bold;
          font-size: 24px;
        }
      }
    }
    .clear {
      border: 0;

      color: #676767;
      cursor: pointer;
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
    margin-top: 5px;
    border-top: 1px solid #e0e0e0;
  }
  .music {
  }
}
</style>