<template>
  <!-- 歌单详情 -->
  <div class="play-list-detail">
    <!-- 歌单图片及信息 -->
    <div class="detail-desc">
      <!-- 歌单图片 -->
      <div class="detail-img-wrapper">
        <img class="img-wrapper" :src="this.info.coverImgUrl" />
      </div>
      <!-- 歌单信息 -->
      <div class="detail-desc-info">
        <div class="info-title">
          <div class="tag">歌单</div>
          <span>{{ info.name }}</span>
        </div>
        <div class="author">
          <div class="author-img" @click="Login_on(creator)">
            <img class="img-h" :src="creator.avatarUrl" />
          </div>
          <div class="author-info" @click="Login_on(creator)">
            <span>{{ creator.nickname }}</span>
            <!-- <span>{{ info.createTime }}</span> -->
          </div>
        </div>
        <!-- 歌单按钮 -->
        <div class="info-btn" @click="playAll">
          <button class="btn">
            <i class="iconfont icon-bofang"></i>
            <span>全部播放</span>
          </button>
        </div>
        <div class="num-info">
          <span>歌曲 : {{ info.trackCount }}</span>
          <span>播放 : {{ info.playCount }}</span>
        </div>
        <div class="title-info">
          <span style="max-width: 1000px">简介 : {{ info.description }}</span>
        </div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="detail-head">
      <span style="font-size: 18px; font-weight: bold">歌曲列表</span>
      <div class="detail-search">
        <el-input
          placeholder="搜索音乐"
          clearable
          suffix-icon="el-icon-search"
          v-model="key"
        ></el-input>
      </div>
    </div>
    <MusicList ref="clearable" :list="list" />
  </div>
</template>

<script>
import MusicList from "@/tool/MusicList.vue";
import { getPlayListDetail } from "@/api/api_playlist";
import { getMusicListByIds } from "@/api/api_music";
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    MusicList,
  },
  computed: {
    list() {
      let reg = new RegExp(this.key.trim(), "ig"); //'g'全局，'i'不分大小
      return this.playList.filter((item) => {
        return item.name.match(reg);
      });
    },
  },
  data() {
    return {
      key: "",
      info: {},
      tags: [],
      creator: {},
      subscribed: false,
      playList: [],
    };
  },
  created() {
    this.getPlayList();
  },
  mounted() {},
  methods: {
    playAll() {
      this.$refs.clearable.playMusicAll();
    },
    async getPlayList() {
      let MusicList = [];
      let res = await getPlayListDetail(this.id);
      this.info = Object.freeze(res.data.playlist);
      this.tags = Object.freeze(res.data.playlist.tags);
      this.creator = Object.freeze(res.data.playlist.creator);
      this.subscribed = res.data.playlist.subscribed;
      this.info.trackIds.forEach((item) => {
        MusicList.push(item.id);
      });
      if (MusicList.length > 800) {
        let res = await getMusicListByIds(MusicList.slice(0, 800).join(","));
        this.playList = Object.freeze(res.song);
        this.$message.error("太多歌曲了，只加载一部分");
      } else {
        let res = await getMusicListByIds(MusicList.join(","));
        this.playList = Object.freeze(res.data.songs);
      }
    },
    async PlayMusicList() {},
    Login_on(item) {
      this.$router.push("/Login_on/" + item.userId);
    },
  },
};
</script>

<style lang="less" scoped>
.play-list-detail {
  height: 100%;

  .detail-desc {
    display: flex;
    height: 180px;
    width: 70%;
 
    .detail-img-wrapper {
      height: 180px;
      width: 180px;
      border-radius: 8px;
      .img-wrapper {
        border-radius: 8px;
        height: 100%;
        width: 100%;
      }
    }
    .detail-desc-info {
      margin-left: 20px;
      height: 180px;
      width: 400px;

      .info-title {
        margin-bottom: 5px;
        width: 100%;
        height: 24px;

        .tag {
          display: inline-block;
          border-radius: 2px;
          padding: 0 2px;
          border: 1px solid #ec4141;
          height: 22px;
          line-height: 22px;
          color: #ec4141;
        }
        span {
          margin-left: 12px;
          font-size: 20px;
          font-weight: bold;
        }
      }
      .author {
        display: flex;
        margin: 10px 0;
        height: 24px;
        width: 290px;
        .author-img {
          .img-h {
            height: 24px;
            width: 24px;
            height: 100%;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .author-info {
          height: 24px;
          width: 150px;
          span {
            margin-left: 12px;
            font-size: 12px;
            &:nth-child(1) {
              cursor: pointer;
              color: rgb(11, 88, 176);
            }
          }
        }
      }
      .info-btn {
        margin: 10px 0;
        .btn {
          background-color: #ec4141;
          color: #fff;
          border: none;
          height: 30px;
          padding: 4px 14px;
          border-radius: 15px;
          cursor: pointer;
          &:hover {
            background-color: #b42f2f;
          }
        }
      }
      .num-info {
        margin: 5px 0;
        height: 24px;
        width: 100%;
        span {
          font-size: 14px;
          &:nth-child(2) {
            margin-left: 12px;
          }
        }
      }
      .title-info {
        height: 24px;
        width: 100%;
        margin: 5px 0;
        overflow: hidden;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .detail-head {
    margin: 5px 0;
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      display: inline-block;
    }
    .detail-search {
      color: #676767;
      background-color: #f7f7f7;
      font-size: 14px;
      border-radius: 16px;
      border: 0;
      /deep/input {
        border: none;
        border-radius: 16px;
      }
    }
  }
}
</style>