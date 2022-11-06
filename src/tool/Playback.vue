<template>
  <div class="playback">
    <div class="play-view">
      <div class="music-info">
        <div class="music-title">{{ imgInfo.name }}</div>
        <div class="music-author">{{ imgInfo.author }}</div>
        <div class="lyric-view">
          <div class="img-wrap">
            <div class="changzhen" :class="{ 'changzhen-active': isPlay }">
              <img src="../assets/changzhen.png" alt="" />
            </div>
            <div class="changpian" :class="{ 'changpian-active': isPlay }">
              <div class="changpian-wrap">
                <img :src="imgInfo.imgUrl" />
              </div>
            </div>
          </div>
          <LyricWrap
            :currenTime="currenMusicInfo.currenTime"
            :musicId="currenMusicId"
          ></LyricWrap>
        </div>
      </div>
      <div class="comment-view mtop-50"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LyricWrap from "./LyricWrap.vue";
export default {
  props: ["imgInfo", "currenMusicId"],
  components: {
    LyricWrap,
  },
  computed: {
    ...mapState(["isPlay", "currenMusicInfo"]),
  },
};
</script>

<style lang="less" scoped>
.playback {
  height: 100%;
  width: 100%;
  .play-view {
    padding: 0 20%;
    .music-info {
      .music-title {
        text-align: center;
        font-size: 30px;
      }
      .music-author {
        text-align: center;
        font-size: 14px;
      }
    }
    .lyric-view {
      display: flex;
      .img-wrap {
        position: relative;
        .changzhen {
          position: absolute;
          top: -20px;
          left: 130px;
          width: 120px;
          transform-origin: 3px 3px;
          transition: all 0.5s;
          z-index: 20;

          img {
            width: 120px;
          }
        }
        .changpian {
          margin-top: 40px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background-color: #c4c3c6;
          display: flex;
          justify-content: center;
          align-items: center;

          .changpian-wrap {
            width: 240px;
            height: 240px;
          
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          img {
            width: 180px;
            height: 180px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
.changzhen-active {
  transform: rotate(30deg);
}

.changpian-active {
  animation: circle 30s infinite linear;
}
@keyframes circle {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>