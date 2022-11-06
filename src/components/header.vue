<template>
  <div class="header-bar">
    <div class="logo-wrap" @click="toHome">
      <i class="iconfont icon-logView"></i>
    </div>
    <div class="btn-history">
      <button @click="goTo(-1)" class="btn-circle">
        <i class="iconfont icon-arrow-left-bold"></i>
      </button>
      <button @click="goTo(1)" class="btn-circle">
        <i class="iconfont icon-arrow-right"></i>
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="search-input">
      <el-input
        style="width: 200px"
        v-model="keywords"
        placeholder="搜索"
        @focus="focus_Suggest"
        @change="toSearch"
        @input="handleInput"
        @blur="showInfoTip = false"
        clearable
        ref="inputRef"
        prefix-icon="el-icon-search"
      >
      </el-input>

      <transition name="el-fade-in">
        <div class="his" v-show="showInfoTip">
          <div v-show="keywords === ''">
            <div v-show="history.length !== 0">
              <div class="his-title">
                <span>搜索历史</span>
                <button class="no-btn" @click="clearHis">
                  <i class="el-icon-delete"></i>
                </button>
              </div>
            </div>
            <div class="his-wrap">
              <button
                class="btn-title"
                v-for="val in history"
                :key="val"
                @click="clickHot(val)"
              >
                {{ val }}
              </button>
            </div>
            <div class="hot-search">
              <div class="hot-title">热搜榜</div>
              <div
                class="hot-item"
                :class="{ 'top-item': index < 3 }"
                v-for="(item, index) in hotList"
                @click="HotItem(item.searchWord)"
                :key="index"
              >
                <div class="item-index">{{ index + 1 }}</div>
                <div class="item-info">
                  <div class="key_word">
                    <span style="font-weight: bold">{{ item.searchWord }}</span>
                    <span style="color: #c2c1c1">{{ item.score }}</span>
                  </div>
                  <div>
                    <span>{{ item.content }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="keywords !== ''">
            <div class="search-suggest">
              <div class="search-btn-wrap">
                <button class="no-btn">
                  搜“{{ keywords }}”相关的内容<i
                    class="el-icon-arrow-right"
                  ></i>
                </button>
              </div>
              <SuggestList v-if="showMusic">
                <template #title>
                  <i class="iconfont icon-yinle font-16"></i
                  ><span class="mleft-10">单曲</span>
                </template>
                <template #item>
                  <div
                    v-for="s in suggestInfo.songs"
                    :key="s.id"
                    class="item pointer text-hidden"
                    @click="playMusic(s.id)"
                  >
                    {{ s.name }} - {{ s.artists[0].name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showAlbum">
                <template #title>
                  <i class="iconfont icon-zhuanji font-16"></i
                  ><span class="mleft-10">专辑</span>
                </template>
                <template #item>
                  <div
                    v-for="al in suggestInfo.albums"
                    :key="al.id"
                    class="item pointer text-hidden"
                    @click="toAlbumDetail(al.id)"
                  >
                    {{ al.name }} - {{ al.artist.name }}
                  </div>
                </template>
              </SuggestList>
              <SuggestList v-if="showArtist">
                <template #title
                  ><i class="el-icon-user font-16"></i
                  ><span class="mleft-10">歌手</span>
                </template>
                <template #item>
                  <div
                    v-for="ar in suggestInfo.artists"
                    :key="ar.id"
                    class="item pointer text-hidden"
                    @click="toArtistDetail(ar.id)"
                  >
                    {{ ar.name }}
                  </div>
                </template>
              </SuggestList>

              <SuggestList v-if="showPlaylist">
                <template #title>
                  <i class="iconfont icon-gedan font-16"></i
                  ><span class="mleft-10">歌单</span>
                </template>
                <template #item>
                  <div
                    v-for="p in suggestInfo.playlists"
                    :key="p.id"
                    class="item pointer text-hidden"
                    @click="toPlayListDetail(p.id)"
                  >
                    {{ p.name }}
                  </div>
                </template>
              </SuggestList>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- </div> -->
    <div class="Login-img login" icon="el-icon-user-solid" @click="_Login">
      <el-avatar
        :size="30"
        icon="el-icon-user-solid"
        :src="HeadPortrait"
      ></el-avatar>
    </div>
    <div class="Login-text login" @click="signOut">
      {{ name }}
    </div>
  </div>
</template>

<script>
import SuggestList from "@/tool/SuggestList.vue";
import { getUserDetail } from "@/api/api_user.js";
import { mapState } from "vuex";
import { getHotSearch, getSuggest } from "@/api/api_home";

export default {
  data() {
    return {
      keywords: "", //输入框
      showInfoTip: false,
      history: [], //搜索历史
      hotList: [], //热搜列表
      suggestInfo: {}, //建议

      id: localStorage.getItem("account_id"),
    };
  },
  components: { SuggestList },
  computed: {
    ...mapState(["Username", "isLogin", "Userimg"]),
    /* 搜索建议相关状态,判断是否有该属性*/
    showMusic() {
      return Object.hasOwnProperty.call(this.suggestInfo, "songs");
    },
    showAlbum() {
      return Object.hasOwnProperty.call(this.suggestInfo, "albums");
    },
    showArtist() {
      return Object.hasOwnProperty.call(this.suggestInfo, "artists");
    },
    showPlaylist() {
      return Object.hasOwnProperty.call(this.suggestInfo, "playlists");
    },

    name() {
      console.log(this.Username);
      return this.isLogin ? this.Username : "未登录";
    },
    HeadPortrait() {
      return this.isLogin ? this.Userimg : " ";
    },
  },
  methods: {
    HotItem(val) {
      console.log(val);
      this.keywords = val;
      if (this.$route.path != "/search?keywords=" + this.keywords) {
        this.$router.push(`/search?keywords=${this.keywords}`);
      }
    },
    clickHot(val) {
      if (val !== "") {
        this.keywords = val;
        this.toSearch();
      }
    },
    handleInput(val) {
      console.log(val);
      /* input事件防抖 */
      if (this.timer) {
        window.clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(() => {
        console.log(val, "timer");
        this.getSuggest(val);
      }, 500);
    },
    toSearch() {
      if (this.keywords == "") return;
      this.$refs.inputRef.blur();
      console.log(this.$route.path);
      if (this.$route.path != "/search?keywords=" + this.keywords) {
        this.$router.push(`/search?keywords=${this.keywords}`);
      }
      this.setHistory();
    },
    // setHistory(val) {
    //   if (val) {
    //     //去重
    //     if (this.historySearchList.findIndex((item) => item == val) !== -1)
    //       return;
    //     this.historySearchList.unshift(val);
    //     // 固定长度
    //     this.historySearchList = this.historySearchList.slice(0, 5);
    //     window.localStorage.setItem(
    //       "search",
    //       JSON.stringify(this.historySearchList)
    //     );
    //   }
    // },
    //更新搜索历史
    setHistory() {
      if (this.keywords == "") return;
      this.history.unshift(this.keywords);
      //去重
      this.history = [...new Set(this.history)];
      //固定长度
      if (this.history.length >= 5) {
        this.history.splice(this.history.length - 1, 1);
      }
      localStorage.setItem("keyWord", JSON.stringify(this.history));
    },
    signOut() {
      this.$store.dispatch("sigOut");
    },
    clearHis() {
      this.$confirm("确认清空历史记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        window.localStorage.removeItem("keyWord");
        this.history = [];
      });
    },
    toHome() {
      if (this.$route.path != "/homepage") this.$router.push("/homepage");
    },

    goTo(number) {
      // 前进后退
      this.$router.go(number);
    },
    //登录
    _Login() {
  
      if (!this.isLogin) {
        this.$router.push("/Login");
      } else {
        if (this.$route.path === "/Login_on/" + this.id) return 0;
        this.$router.push("/Login_on/" + this.id);
      }
    },
    //无输入时获取热搜，有输入时获取建议
    async focus_Suggest() {
      this.showInfoTip = true;
      if (this.keywords !== "") {
        //获取搜索建议
        this.getSuggest(this.keywords);
      }
      //热搜
      if (this.hotList.length !== 0) return;
      let res = await getHotSearch();
      this.hotList = res.data.data;
      console.log(this.hotList);
    },
    async getSuggest(val) {
      let res = await getSuggest(val);
      if (res.data.code !== 200) return;
      if (Object.keys(res.data.result).length !== 0)
        this.suggestInfo = res.data.result;
    },
    async getDetail() {
      console.log("执行了getDetail", this.id);
      if (this.id == null) return;
      else {
        let res = await getUserDetail(this.id);
        this.$store.commit("Userimg", res.data.profile.avatarUrl);
        this.$store.commit("Username", res.data.profile.nickname);
      }
    },
    getHistory() {
      if (localStorage.getItem("keyWord")) {
        this.history = JSON.parse(localStorage.getItem("keyWord"));
      }
    },
  },
  mounted() {
    this.getDetail();
    this.getHistory();
  },
};
</script>

<style lang="less" scoped>
.header-bar {
  height: 100%;
  display: flex;
  align-items: center;
  color: #ffffff;
  .logo-wrap {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
    .icon-logView {
      font-size: 48px;
    }
  }
  .btn-history {
    margin-left: 100px;
    display: flex;

    .btn-circle {
      // 圆按钮
      display: flex;
      height: 26px;
      width: 26px;
      border-radius: 50%;
      background-color: #e13e3e;
      color: #ffffff;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      border: 0;
      // outline: 0;
    }
  }
  .search-input {
    margin-left: 10px;
    position: relative;
    color: #ffffff;
    /deep/input {
      border: none;
      background-color: #e13e3e;
      border-radius: 16px;
    }
    .his {
      width: 300px;
      height: 500px;
      position: absolute;
      color: #666666;
      background-color: #ffffff;
      border-radius: 15px;
      margin: 10px -50px;
      z-index: 1000;
      overflow-y: auto;
      .btn-title {
        padding: 0 8px;
        border-radius: 15px;
        border-style: solid;
        border-color: #ebe3e3;
        background-color: #ffffff;
        margin-left: 10px;
        margin-top: 5px;
        &:hover {
          background-color: #f1eaea;
          cursor: pointer;
        }
      }

      span {
        margin-left: 20px;
      }
      .no-btn {
        margin-top: 10px;
        margin-left: 10px;
        border: none;
        background-color: #ffffff;
      }
      .no-btn :hover {
        cursor: pointer;
      }
    }
    .his::-webkit-scrollbar {
      display: none;
    }
    .hot-search {
      font-size: 13px;
      margin-top: 20px;
      .hot-title {
        margin-left: 15px;
      }
      .hot-item {
        padding-left: 20px;
        margin-top: 10px;
        height: 50px;
        display: flex;
        align-items: center;
        &:hover {
          background-color: #f2f2f2;
        }
        .item-info {
          align-content: center;
        }
      }
    }
  }

  .Login-img {
    display: flex;
    height: 30px;
    width: 30px;
  }
  .login {
    cursor: pointer;
    margin-left: 10px;
  }
  .Login-text {
    font-size: 14px;
  }
  .top-item {
    .item-index {
      color: #ec4141;
    }
  }
}
.el-button {
  background-color: #ec4141;
  border: 1px solid #ec4141;
  &:hover {
    color: #e0d0d0;
  }
}
</style>