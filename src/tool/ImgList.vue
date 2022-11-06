<template>
  <div class="img-content">
    <div
      class="img-list"
      v-for="item in list"
      :key="item.id"
      @click="clickImg(item.id)"
    >
      <img class="img" :src="item.picUrl || item.coverImgUrl" />
      <div class="play">
        <i class="iconfont icon-24gl-play"></i>
        {{ num(item.playCount) }}
      </div>
      <div class="play-btn pointer">
        <i class="iconfont icon-bofang"></i>
      </div>
      <div class="span">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: { type: Array, required: true, default: () => [] },
  },
  methods: {
    clickImg(id) {

      this.$router.push({ path: "/playlistdetail/" + id });
    },
    num(num) {
      if (num > 100000000) {
        let num1 = parseInt(num / 100000000) + "亿";
        return num1;
      } else if (num > 10000) {
        let num2 = parseInt(num / 10000) + "万";
        return num2;
      } else {
        return num;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.img-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .img-list {
    cursor: pointer;
    height: 175px;
    width: 175px;
    margin: 0px 10px 40px 10px;
    position: relative;
    .img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
    .play {
      position: absolute;
      color: #ffffff;
      right: 10px;
      top: 10px;
    }
    .play-btn {
      position: absolute;
      right: 15px;
      bottom: 15px;
      background-color: #fbf7f6;
      color: #ec4141;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      opacity: 0;
      transition: all 0.8s;
      i {
        font-size: 16px;
      }
    }
    &:hover .play-btn {
      opacity: 1;
    }
    .span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>