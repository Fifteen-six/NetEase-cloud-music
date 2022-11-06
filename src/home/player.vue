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
        <!-- 播放列表 -->
      </div>
    </div>
    <!-- 播放界面 -->
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
      musicUrl: "", //音乐资源
      volume: 50, //音量
      saveVolume: 50, //静音前保存的音量
      isMute: false, //是否是静音
      imgInfo: {
        //img区域信息，图片，歌名，歌手
        imgUrl: imgUrl,
        name: "未知歌名",
        author: "未知歌手名",
      },
      curren: 0, //进度条的百分比
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
      console.log("播放歌曲改变");
      this.getMusicUrl();
    },
    //   if (this.PlayViewDrawer) {
    //       document.querySelector(".player")
    //     }
    // },
    isPlay(val) {
      /* 由于misicUrl第一次是状态改变后获取，所以第一次改变不要进入监听 */
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
      //监听音量改变
      this.changeVolume();
    },
  },
  created() {
    this.getHistory();
  },
  methods: {
    //歌曲时间处理
    timeFormat(time) {
      if (typeof time === "undefined") return 0;
      let minutes = parseInt(time / 60); // 获取时长分钟
      let seconds = parseInt(time % 60); // 获取时长秒数
      seconds = seconds < 10 ? "0" + seconds : seconds; // 秒
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return minutes + ":" + seconds;
    },
    //上一首
    lastMusic() {
      console.log("上一首");
      if (this.playType == "music") {
        if (this.currenIndex != 0) {
          this.$store.commit("setCurrenIndex", this.currenIndex - 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("已经是第一首了");
        }
      } else if (this.playType == "personalFm") {
        return false;
      }
    },
    //下一首
    nextMusic() {
      console.log("下一首");
      if (this.playType === "music") {
        if (this.currenIndex != this.musicList.length - 1) {
          this.$store.commit("setCurrenIndex", this.currenIndex + 1);
          this.$store.commit(
            "setCurrenMusicId",
            this.musicList[this.currenIndex].id
          );
        } else {
          this.$store.commit("setPlayState", false);
          this.$message.error("已经是最后一首了！");
        }
      }
    },
    /* 获取歌曲时长 */
    getToltime() {
      this.$store.commit("setTotalTime", this.musicList[this.currenIndex].dt);
    },
    /* 更新历史播放 */
    setHistory() {
      this.$store.commit("setHistoryList", {
        type: "unshift",
        data: this.musicList[this.currenIndex],
      });
    },
    /* 获取历史播放 */
    getHistory() {
      if (!window.localStorage.getItem("historylist")) return;
      this.$store.commit("setHistoryList", {
        type: "get",
        data: JSON.parse(window.localStorage.getItem("historylist")),
      });
    },
    /* 获取音乐地址 */
    async getMusicUrl() {
      this.getImgInfo();
      this.getToltime();
      let res = await getMusicUrl(this.currenMusicId);
      console.log("歌曲数据", res);
      if (res.data.code !== 200) return this.$message.error("播放失败");
      if (!res.data.data[0].url) {
        // const h = this.$createElement;
        this.$notify({
          title: "当前歌曲暂无音源",
          message: h(
            "i",
            { style: "color: teal" },
            "因版权方要求，该资源暂时无法播放，我们正在争取歌曲回归"
          ),
        });
        this.musicUrl = "";
        this.$store.commit("setPlayState", false);
        return;
      }
      this.musicUrl = res.data.data[0].url;
      console.log("this.musicUrl", this.musicUrl);
    },
    /* 获取图片信息 */
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
    //暂停
    pause() {
      
      if (this.musicUrl.length === 0) return;
      this.$store.commit("setPlayState", !this.isPlay);
    },
    changePlayModel() {
      this.$notify({
        title: "该功能还未完善",
      });
    },
    //改变音量
    changeVolume() {
      this.$refs.audioRef.volume = this.volume / 100;
    },
    //展示播放列表

    /* 更新当前播放时间 */
    updateCurrenTime() {
      if (!this.$refs.audioRef) return;
      /* 通过audio对象的方法获取当前时间 */
      let time = this.$refs.audioRef.currentTime;

      time = Math.floor(time);
      /* 同步进度条 */
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
    /* 拖动进度条的回调，手动改变播放进度 */
    changeCurrenTime(val) {
      console.log(val);
      let time = ((val / 100) * this.currenMusicInfo.totalTime) / 1000;
      this.$refs.audioRef.currentTime = time;
    },

    /* 下载 */

    /* 打开歌曲播放页 */
    openPlayView() {
      if (this.playType === "music") {
        this.PlayViewDrawer = true;
      } else if (this.playType === "personalFm") {
        if (this.$route.path !== "/personalfm")
          this.$router.push("/personalfm");
      }
    },
    /* 抽屉关闭的回调 */
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