<template>
  <el-table @row-dblclick="playMusic" :data="list" stripe style="width: 100%">
    <el-table-column type="index" width="80"> </el-table-column>
    <el-table-column width="50"> </el-table-column>
    <el-table-column prop="name" label="音乐标题" width="350">
    </el-table-column>
    <el-table-column prop="ar[0].name" label="歌手" width="290">
    </el-table-column>
    <el-table-column prop="al.name" label="专辑名" width="300">
    </el-table-column>
    <el-table-column prop="dt" label="时长" width="130">
      <template v-slot="{ row }">
        {{ _list(row.dt / 1000) }}
      </template></el-table-column
    >
  </el-table>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => {},
    },

  },
  computed: {
    ...mapState(["musicList"]),
  },
  mounted() {},
  methods: {
    _list(time) {
      // if (typeof time === "undefined") return 0;
      let minutes = parseInt(time / 60); // 获取时长分钟
      let seconds = parseInt(time % 60); // 获取时长秒数
      seconds = seconds < 10 ? "0" + seconds : seconds; // 秒
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return minutes + ":" + seconds;
    },
    //  播放音乐
    playMusic(row) {
      console.log("列表没变", this.list == this.musicList);
      this.$store.dispatch("playMusic", {
        list: this.list,
        id: row.id,
      });
    },
    /* 播放当前列表 */
    playMusicAll() {
      if (this.list.length == 0) return;
      let id = this.list[0].id;
      console.log("列表没变", this.list == this.musicList);
      this.$store.dispatch("playMusic", {
        list: this.list,
        id,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-table /deep/ .el-table__cell {
  padding: 6px;
  font-size: 12px;
}
</style>

