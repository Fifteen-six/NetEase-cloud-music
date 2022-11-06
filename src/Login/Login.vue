<template>
  <div class="login">
    <div class="login-container">
      <p class="login-h">二维码登录</p>
      <p class="login-title">请打开网易云音乐手机端扫码登录</p>
      <div class="login-img">
        <img class="img" :src="imgData" />
        <div class="img-btn" @click="getKey" v-show="qrType === 800">
          <i class="el-icon-refresh-left"></i>
        </div>
      </div>
      <div class="login-title">状态 : {{ message }}</div>
    </div>
  </div>
</template>

<script>
import { getQrKey, createQr, checkQr, getAcount } from "@/api/api_user";

export default {
  data() {
    return {
      key: "", //存储unikey
      imgData: "", //存储qrimg
      qrType: "",
      message: "",
    };
  },
  created() {
    this.getKey();
  },
  beforeDestroy() {
    window.clearTimeout(this.timer);
  },
  methods: {
    //获取二维码key
    async getKey() {
      let res = await getQrKey();
      if (res.data.code !== 200) return this.$message.error("获取二维码失败");
      this.key = res.data.data.unikey;
      this._createQr();
    },
    //生产二维码
    async _createQr() {
      let res = await createQr(this.key);
      console.log(res);
      if (res.data.code !== 200) return this.$message.error("生成二维码失效");
      this.imgData = res.data.data.qrimg;
      this._checkQr();
    },
    async _checkQr() {
      let res = await checkQr(this.key);
      this.qrType = res.data.code;
      this.message = res.data.message;
      if (res.data.code === 801 || res.data.code === 802) {
        this.timer = window.setTimeout(() => {
          this._checkQr();
        }, 1000);
      } else if ((res.data.code = 803)) {
        this.$message.success("登录成功");
        this.$store.commit("getLogin", 1);
        // window.localStorage.setItem("isLogin", 1);
        window.localStorage.setItem("cookie", res.data.cookie);
        console.log(res.data.cookie);
        let result = await getAcount(res.data.cookie);
        console.log(result);
        this.$store.commit("getLoginStatusID", result);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("@/assets/login.jpg");
  min-height: 100vh;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-container {
    width: 500px;
    height: 600px;
    border-radius: 10px;
    background-color: aliceblue;
    position: relative;
    .login-h {
      text-align: center;
      font-size: 30px;
      margin-top: 30px;
    }
    .login-title {
      margin-top: 20px;
    }
    .login-img {
      position: absolute;
      top: 50%;
      left: 50%;
      /* 子div高度的一半 */
      margin-top: -100px;
      margin-left: -100px;

      width: 200px;
      height: 200px;

      .img-btn {
        position: absolute;
        width: 200px;
        height: 200px;
        background-color: #cccc;
        opacity: 0.8;
        color: red;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          font-size: 30px;
        }
      }
    }
    .login-title {
      text-align: center;
    }
  }
}
</style>