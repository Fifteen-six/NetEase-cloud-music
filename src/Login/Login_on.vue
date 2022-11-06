<template>
  <div class="Login_on">
    <!-- 头部 -->
    <div class="Login_on-header">
      <div class="Login_on-header-img">
        <img :src="info.avatarUrl" />
      </div>
      <div class="Login_on-title">
        <div class="Login_on-title-top">{{ info.nickname }}</div>
        <div class="Login_on-title-content">
          <div class="lv">Lv{{ level }}</div>
        </div>
        <div class="Login_on-title-bottom">
          <div class="item">
            <p class="item-num">{{ info.eventCount }}</p>
            <p>动态</p>
          </div>
          <div class="item">
            <p class="item-num">{{ info.follows }}</p>
            <p>关注</p>
          </div>
          <div class="item">
            <p class="item-num">{{ info.followeds }}</p>
            <p>粉丝</p>
          </div>
        </div>
        <div class="title">所在地区 : {{ UserCity }}</div>
        <div class="title">个人介绍 : {{ info.signature }}</div>
      </div>
    </div>
    <div class="Login-title">
      <span
        class="Login-title-my"
        v-for="(item, index) in itemList"
        :key="index"
        :class="{ active: current == index }"
        @click="handleMenuClick(index)"
      >
        {{ item }}</span
      >
    </div>

    <div v-show="current === 0">
      <ImgList :list="creteList" />
    </div>
    <div v-show="current === 1">
      <ImgList :list="subList" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ImgList from "@/tool/ImgList.vue";
import { getUserDetail, getUserPlayList } from "@/api/api_user.js";
const city = require("../utils/city.json");
const province = require("../utils/province.json");
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      itemList: ["创建的歌单", "收藏的歌单"],
      current: 0,
      isImg: "",
      info: [], //基本信息
      level: 0, //等级
      List: [],
    };
  },

  mounted() {
    this.getDetail();
    this.getUserPlayList();
  },

  components: { ImgList },

  methods: {
    getArea(_province, _city) {
      let provinceobj = province.find((item) => item.c == _province);
      let cityobj = city.find((item) => item.c == _city);
      return `${provinceobj.n} ${cityobj.n}`;
    },
    //获取详情信息
    async getDetail() {
      let res = await getUserDetail(this.id);
      this.info = Object.freeze(res.data.profile);
      this.level = res.data.level;
    },
    //获取收藏及创建的歌单
    async getUserPlayList() {
      let res = await getUserPlayList(this.id);
      this.List = res.data.playlist;
    },
    handleMenuClick(index) {
      this.current = index;
    },
  },
  computed: {
    ...mapState(["account"]),
    UserCity() {
      return this.info.province && this.info.city
        ? this.getArea(this.info.province, this.info.city)
        : "用户已隐藏";
    },
    useID() {
      return this.info.userId;
    },
    creteList() {
      return this.List.filter((item) => item.userId == this.useID);
    },
    subList() {
      return this.List.filter((item) => item.userId !== this.useID);
    },
  },
};
</script>

<style lang="less" scoped>
.Login_on {
  width: 100%;
  height: 100%;

  align-items: center;
  color: #676767;

  .Login_on-header {
    display: flex;
    width: 75%;

    .Login_on-header-img {
      height: 200px;
      width: 200px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .Login_on-title {
    width: 70%;
    margin-left: 10px;

    .Login_on-title-top {
      font-size: 24px;
      font-weight: bold;
    }

    .Login_on-title-content {
      margin-top: 5px;
      height: 40px;
      align-items: center;
      display: flex;
      background-color: #fff;
      border-bottom: 1px solid #e0e0e0;

      .lv {
        height: 20px;
        width: 30px;
        color: #ec4141;
        border: 1px solid #ec4141;
        padding: 0 1px;
        border-radius: 3px;
        font-size: 12px;
      }
    }

    .Login_on-title-bottom {
      margin-top: 5px;
      display: flex;

      .item {
        height: 40px;
        width: 80px;
        border-right: 1px solid #e0e0e0;
        text-align: center;

        &:nth-child(3) {
          border: none;
        }
      }
    }

    .title {
      margin-top: 9px;
    }
  }

  .Login-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .Login-title-my {
      margin: 10px;

      cursor: pointer;
    }

    .active {
      font-size: 18px;
      font-weight: bold;
      border-bottom: 5px solid #d74545;
    }
  }
}
</style>