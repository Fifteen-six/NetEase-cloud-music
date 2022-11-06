<template>
  <div class="RankingList">
    <!-- 官方榜 -->
    <div class="guanfang-list">
      <h2>官方榜</h2>
      <div
        class="guanfang-item"
        v-for="(item, index) in guanfangList"
        :key="index"
      >
        <div class="item">
          <div class="img" @click="toPlayListDetail(item.id)">
            <img :src="item.coverImgUrl" />
            <div class="btn">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
          <div class="title">
            <ul class="title-ul">
              <li
                v-for="(music, index) in item.tracks"
                :key="index"
                @click="playMusic(music)"
              >
                <span class="mleft-12 text-hidden">{{ index + 1 }}</span
                ><span class="mleft-12 geming text-hidden">{{
                  music.name
                }}</span
                ><span class="zuozhe mright-10 text-hidden">{{
                  music.ar[0].name
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 全球榜 -->
    <div class="global-list">
      <h2>全球榜</h2>
      <ImgList :list="globalList" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImgList from "@/tool/ImgList.vue";
import { getToplist, getPlayListDetail } from "@/api/api_play";
export default {
  data() {
    return {
      guanfangListId: [], //官方榜ID
      guanfangList: [], //官方榜的列表
      globalList: [], //全球榜列表
      playMusicList: [],
    };
  },
  created() {
    this.getToplist();
  },
  computed: {
    ...mapState(["musicList"]),
  },
  components: {
    ImgList,
  },
  methods: {
    playMusic(row) {
    
      console.log("列表没变", this.playMusicList == this.musicList);
      this.$store.dispatch("playMusic", {
        list: this.playMusicList,
        id: row.id,
      });
    },
    async getToplist() {
      // 使用缓存数据
      if (this.guanfangList.length !== 0) return;
      let res = await getToplist();
      //清空官方榜ID数据
      this.guanfangListId = [];
      // console.log(res);
      res.data.list.slice(0, 4).forEach((item) => {
        this.guanfangListId.push(item.id);
      });
      this.globalList = Object.freeze(res.data.list.slice(4));
      this.guanfangListId.forEach((item) => {
        this.getPlayList(item);
      });
    },
    async getPlayList(id) {
      //清空官方榜数据
      this.guanfangList = [];
      let res = await getPlayListDetail(id);
      this.playMusicList = res.data.playlist.tracks;
      res.data.playlist.tracks = Object.freeze(
        res.data.playlist.tracks.slice(0, 5)
      );

      console.log(res.data.playlist.tracks);
      this.guanfangList.push(Object.freeze(res.data.playlist));
    },
    //跳转歌单详情页
    toPlayListDetail(id) {
      this.$router.push({ path: "/playlistdetail/" + id });
    },
  },
};
</script>

<style lang="less" scoped>
.RankingList {
  width: 100%;
  height: 100%;
  .guanfang-list {
    width: 100%;
    height: 100%;
    .guanfang-item {
      width: 100%;
      height: 100%;

      .item {
        margin: 20px 0;
        display: flex;
        .img {
          cursor: pointer;
          height: 160px;
          width: 160px;
          position: relative;
          img {
            height: 100%;
            width: 100%;
          }
          .btn {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fbf7f6;
            color: #ec4141;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 50%;
            opacity: 0;
            transition: all 0.8s;
            i {
              font-size: 18px;
            }
            &:hover {
              opacity: 1;
            }
          }
        }
        .title {
          flex-grow: 1;
          margin-left: 30px;
          width: 70%;
          height: 160px;
          .title-ul {
            cursor: pointer;
            flex-grow: 1;
            li {
              height: 32px;
              line-height: 32px;
              color: #f00;
              background-color: #ffffff;
              &:nth-child(odd) {
                background-color: #f9f9f9;
              }
              &:nth-child(n + 4) {
                color: #666;
              }
              &:hover {
                background-color: #f4f4f4;
              }
              span {
                display: inline-block;
                margin-left: 12px;
                &:nth-child(2) {
                  color: #373737;
                }
                &:nth-child(3) {
                  float: right;
                  color: #9b9b9b;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>