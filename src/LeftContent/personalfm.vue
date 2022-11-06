<template>
  <div class="Personalfm">
    <Playback :imgInfo="PersonalfmList" :currenMusicId="id" />
  </div>
</template>

<script>
import Playback from "../tool/Playback.vue";
import { getPersonalfm, getMusicListByIds } from "../api/api_music";
export default {
  components: {
    Playback,
  },
  data() {
    return {
      PersonalfmList: {
        imgUrl: "",
        name: "未知歌名",
        author: "未知歌手名",
      },
      playMusicList: {},
      id: "",
    };
  },
  created() {
    this.getPersonalfm();
  },
  mounted() {
   
  },
  methods: {
    async getPersonalfm() {
      let res = await getPersonalfm();
      this.id = res.data.data[0].id;
      this.getMusicListByIds(this.id); 
    },
    async getMusicListByIds(id) {
      let res = await getMusicListByIds(id);
      // console.log(res);
      console.log(res.data.songs);
      this.playMusicList = res.data.songs;
      this.PersonalfmList.imgUrl = res.data.songs[0].al.picUrl;
      this.PersonalfmList.author = res.data.songs[0].ar[0].name;
      this.PersonalfmList.name = res.data.songs[0].name;
       this.playMusic();
    },
    playMusic() {
     console.log(this.playMusicList[0].al.id);
      console.log(this.playMusicList);
    
      console.log("列表没变", this.playMusicList == this.musicList);
      this.$store.dispatch("playMusic", {
        list: this.playMusicList,
        id: this.playMusicList[0].id,
      });
    },
  },
};
</script>

<style lang="less"
scoped>
.PersonalfmList {
  margin-top: 100px;
  height: 100%;
  width: 100%;
  padding: 0 20%;
}
</style>