<template>
  <div>
    <div class="footer">
      <div class="footer-left">
        <img @click="openPlayView" :src="imgInfo.imgUrl" />
        <div class="left-content">
          <div>{{ imgInfo.name }}</div>
          <div>{{ imgInfo.author }}</div>
        </div>
      </div>
      <div class="footer-center">
        <div class="player-bar">
          <button class="player-bar-btn" @click="changePlayModel">
            <i class="iconfont icon-liebiaoshunxu"></i>
          </button>
          <button
            class="player-bar-btn"
            :class="{ 'player-bar-btn_disabled': playType === 'personalFm' }"
          >
            <i class="iconfont icon-shangyishou" @click="lastMusic"></i>
          </button>
          <button class="player-bar-btn" @click="pause">
            <i v-show="isPlay" class="iconfont icon-zanting"></i>
            <i v-show="!isPlay" class="iconfont icon-bofang"></i>
          </button>
          <button class="player-bar-btn" @click="nextMusic">
            <i class="iconfont icon-xiayishou"></i>
          </button>
          <button class="player-bar-btn" @click="changePlayModel">
            <i v-show="!isLiked" class="iconfont icon-aixin"></i>
            <i
              v-show="isLiked"
              style="color: #ec4141"
              class="iconfont icon-aixin1"
            ></i>
          </button>
        </div>
        <div class="time-progress">
          <span class="font-12">{{
            timeFormat(currenMusicInfo.currenTime)
          }}</span>
          <el-slider
            v-model="curren"
            class="timeSlider"
            :show-tooltip="false"
            @change="changeCurrenTime"
            :disabled="musicUrl == ''"
          ></el-slider>
          <span class="font-12">{{
            timeFormat(currenMusicInfo.totalTime / 1000)
          }}</span>
        </div>
      </div>
      <div class="footer-right">
        <div class="volume">
          <div @click="isMute = !isMute">
            <i
              v-if="volume == 0"
              class="iconfont icon-shengyinguanbi volume-icon pointer"
            ></i>
            <i v-else class="iconfont icon-shengyin volume-icon pointer"></i>
          </div>
          <div class="volume-slider">
            <el-slider v-model="volume" vertical height="200px"> </el-slider>
          </div>
        </div>
        <!-- ???????????? -->
      </div>
    </div>
    <!-- ???????????? -->
    <el-drawer
      :visible.sync="PlayViewDrawer"
      direction="btt"
      size="100%"
      :before-close="handleClose"
      style="height: 89.3%"
      :show-close="false"
      :modal="false"
    >
      <template #title>
        <div>
          <i
            class="el-icon-arrow-down pointer"
            @click="PlayViewDrawer = false"
          ></i>
        </div>
      </template>
      <Playback :imgInfo="imgInfo" :currenMusicId="currenMusicId" />
    </el-drawer>
    <audio
      ref="audioRef"
      :src="musicUrl"
      autoplay
      @ended="nextMusic"
      @timeupdate="updateCurrenTime"
    ></audio>
  </div>
</template>

<script>
import { getMusicUrl } from "../api/api_music";
import { mapState } from "vuex";
import Playback from "../tool/Playback.vue";
let imgUrl = require("../assets/music.jpg");
export default {
  data() {
    return {
      isLiked: false,
      // isPlay: false,
      musicUrl: "", //????????????
      volume: 50, //??????
      saveVolume: 50, //????????????????????????
      isMute: false, //???????????????
      imgInfo: {
        //img???????????????????????????????????????
        imgUrl: imgUrl,
        name: "????????????",
        author: "???????????????",
      },
      curren: 0, //?????????????????????
      PlayViewDrawer: false,
    };
  },
  components: {
    Playback,
  },
  computed: {
    ...mapState([
      "playType",
      "currenMusicInfo",
      "currenIndex",
      "isPlay",
      "currenMusicId",
      "musicList",
    ]),
  },
  watch: {
    currenMusicId() {
      console.log("??????????????????");
      this.getMusicUrl();
    },
    //   if (this.PlayViewDrawer) {
    //       document.querySelector(".player")
    //     }
    // },
    isPlay(val) {
      /* ??????misicUrl??????????????????????????????????????????????????????????????????????????? */
      if (this.musicUrl === "") return;
      if (val) {
        this.$refs.audioRef.play();
      } else {
        this.$refs.audioRef.pause();
      }
    },
    isMute(val) {
      if (val) {
        this.saveVolume = this.volume;
        this.volume = 0;
      } else {
        this.volume = this.saveVolume;
      }
    },
    volume() {
      //??????????????????
      this.changeVolume();
    },
  },
  created() {
    this.getHistory();
  },
  methods: {
    //??????????????????
    timeFormat(time) {
      if (typeof time === "undefined") return 0;
      let minutes = parseInt(time / 60); // ??????????????????
      let seconds = parseInt(time % 60); // ??????????????????
      seconds = seconds < 10 ? "0" + seconds : seconds; // ???
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return minutes + ":" + seconds;
    },
    //?????????
    lastMusic() {
      console.log("?????????");
      if (this.playType == "music") {
        if (this.currenIndex != 0) {
          this.$store.commit("setCurrenIndex", this.currenIndex - 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("?????????????????????");
        }
      } else if (this.playType == "personalFm") {
        return false;
      }
    },
    //?????????
    nextMusic() {
      console.log("?????????");
      if (this.playType === "music") {
        if (this.currenIndex != this.musicList.length - 1) {
          this.$store.commit("setCurrenIndex", this.currenIndex + 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("???????????????????????????");
        }
      }
    },
    /* ?????????????????? */
    getToltime() {
      this.$store.commit("setTotalTime", this.musicList[this.currenIndex].dt);
    },
    /* ?????????????????? */
    setHistory() {
      this.$store.commit("setHistoryList", {
        type: "unshift",
        data: this.musicList[this.currenIndex],
      });
    },
    /* ?????????????????? */
    getHistory() {
      if (!window.localStorage.getItem("historylist")) return;
      this.$store.commit("setHistoryList", {
        type: "get",
        data: JSON.parse(window.localStorage.getItem("historylist")),
      });
    },
    /* ?????????????????? */
    async getMusicUrl() {
      this.getImgInfo();
      this.getToltime();
      let res = await getMusicUrl(this.currenMusicId);
      console.log("????????????", res);
      if (res.data.code !== 200) return this.$message.error("????????????");
      if (!res.data.data[0].url) {
        // const h = this.$createElement;
        this.$notify({
          title: "????????????????????????",
          message: h(
            "i",
            { style: "color: teal" },
            "?????????????????????????????????????????????????????????????????????????????????"
          ),
        });
        this.musicUrl = "";
        this.$store.commit("setPlayState", false);
        return;
      }
      this.musicUrl = res.data.data[0].url;
      console.log("this.musicUrl", this.musicUrl);
    },
    /* ?????????????????? */
    getImgInfo() {
      if (this.musicList[this.currenIndex].al.picUrl) {
        this.imgInfo.imgUrl = this.musicList[this.currenIndex].al.picUrl;
      } else {
        this.imgInfo.imgUrl = imgUrl;
      }
      this.imgInfo.author = this.musicList[this.currenIndex].ar[0].name;
      this.imgInfo.name = this.musicList[this.currenIndex].name;
      this.setHistory();
    },
    //??????
    pause() {
      
      if (this.musicUrl.length === 0) return;
      this.$store.commit("setPlayState", !this.isPlay);
    },
    changePlayModel() {
      this.$notify({
        title: "?????????????????????",
      });
    },
    //????????????
    changeVolume() {
      this.$refs.audioRef.volume = this.volume / 100;
    },
    //??????????????????

    /* ???????????????????????? */
    updateCurrenTime() {
      if (!this.$refs.audioRef) return;
      /* ??????audio????????????????????????????????? */
      let time = this.$refs.audioRef.currentTime;

      time = Math.floor(time);
      /* ??????????????? */
      if (time != this.currenMusicInfo.currenTime) {
        this.$store.commit("setCurrenTime", time);
        let percent =
          ((this.currenMusicInfo.currenTime * 1000) /
            this.currenMusicInfo.totalTime) *
          100;
        percent = Math.floor(percent);
        this.curren = percent;
      }
    },
    /* ??????????????????????????????????????????????????? */
    changeCurrenTime(val) {
      console.log(val);
      let time = ((val / 100) * this.currenMusicInfo.totalTime) / 1000;
      this.$refs.audioRef.currentTime = time;
    },

    /* ?????? */

    /* ????????????????????? */
    openPlayView() {
      if (this.playType === "music") {
        this.PlayViewDrawer = true;
      } else if (this.playType === "personalFm") {
        if (this.$route.path !== "/personalfm")
          this.$router.push("/personalfm");
      }
    },
    /* ????????????????????? */
    handleClose() {
      console.log("close");
      this.PlayViewDrawer = false;
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  display: flex;
  .footer-left {
    width: 300px;
    display: flex;
    align-items: center;
    img {
      border-radius: 8px;
      height: 50px;
      width: 50px;
      margin: 0 10px;
    }
    .left-content {
      div {
        &:nth-child(1) {
          font-size: 14px;
        }
        &:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }
  .footer-center {
    flex: 1;
    .player-bar {
      width: 300px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      margin-top: 6px;
      justify-content: space-around;

      &-btn {
        outline: none;
        border: none;
        background-color: #fff;
        cursor: pointer;

        .iconfont {
          font-size: 18px;
        }

        &:nth-child(3) {
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background-color: #f4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;

          .iconfont {
            font-size: 16px;
          }
        }

        &:hover {
          color: red;
        }

        &:nth-child(3):hover {
          background-color: #e5e5e5;
        }
      }

      &-btn_disabled {
        cursor: not-allowed;
        color: #e5e5e5;

        &:hover {
          color: #e5e5e5;
        }
      }
    }
    .time-progress {
      line-height: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .timeSlider {
        width: 460px;
        margin: 0 10px;
      }
    }
  }
  .footer-right {
    display: flex;
    align-items: center;
    width: 300px;
    justify-content: flex-end;
    .download {
      margin-right: 20px;
    }
    .volume {
      position: relative;
      margin-right: 20px;

      .volume-slider {
        display: none;
        position: absolute;
        top: -220px;
        left: -3px;
        background-color: #ffffff;
        padding: 10px 0;
        border-radius: 5px;
        box-shadow: 0 0 10px #bbbbbb;
      }

      &:hover .volume-slider {
        display: block;
      }
    }
  }
  .volume-icon {
    font-size: 30px;
  }
}
</style>