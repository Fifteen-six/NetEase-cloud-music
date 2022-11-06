import Vue from 'vue'
import Vuex from 'vuex'
import { getSignOut } from "@/api/api_home";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: window.localStorage.getItem("isLogin") != 1 ? 0 : 1,
    //名字
    Username: '',
    //头像
    Userimg: '',
    /* 播放音乐的总时间和当前时间 */
    currenMusicInfo: {
      totalTime: 0,
      currenTime: 0
    },
    /* 播放列表 */
    musicList: [],
    //播放状态
    isPlay: false,
    /* 当前播放的id */
    currenMusicId: 0,
    /* 当前播放的列表下标 */
    currenIndex: 0,
    //播放历史
    historyList: [],
    //账号信息
    account: {
      id: ''
    },
    //用户信息
    profile: {},

    /* 播放列表抽屉的状态 */
    drawerMusicList: false,
    /* 播放类型 */
    playType: 'music',//music,personalFm
  },
  getters: {
  },
  mutations: {
    setCurrenTime(state, currenTime) {
      state.currenMusicInfo.currenTime = currenTime
    },
    Username(state, Username) {
      state.Username = Username
    },
    Userimg(state, Userimg) {
      state.Userimg = Userimg
    },
    setDrawerMusicList(state, drawerMusicList) {
      state.drawerMusicList = drawerMusicList
    },
    setCurrenMusicId(state, currenMusicId) {
      state.currenMusicId = currenMusicId
    },
    setCurrenIndex(state, currenIndex) {
      state.currenIndex = currenIndex
    },

    setPlayType(state, playType) {
      if (playType === 'music' || playType === 'personalFm') {
        state.playType = playType
      }
    },
    setTotalTime(state, totalTime) {
      state.currenMusicInfo.totalTime = totalTime
    },
    getLogin(state, isLogin) {
      state.isLogin = isLogin
      window.localStorage.setItem('isLogin', isLogin)
    },
    getLoginStatusID(state, result) {
      state.account.id = result.data.account.id,
        state.profile = result.data.profile,
        window.localStorage.setItem('account_id', state.account.id)
    },
    setLoginInfo(state, loginInfo) {
      state.account = loginInfo.account
      state.profile = loginInfo.profile
      state.Username = loginInfo.Username
    },

    setPlayState(state, isPlay) {
      state.isPlay = isPlay
    },

    setHistoryList(state, payload) {
      if (payload.type === 'unshift') {
        /* 判断历史播放里是否有重复，这里重复直接不走，也可以删除之前的，再unshift把最新的提到最前面 */
        if (state.historyList.findIndex((item) => item.id == payload.data.id) !== -1)
          return
        state.historyList.unshift(payload.data)
        if (state.historyList.length > 50) {
          state.historyList.splice(-1, 1)
          console.log(state.historyList.length);
        }
        window.localStorage.setItem(
          'historylist',
          JSON.stringify(state.historyList)
        )
        return
      }
      else if (payload.type === 'get') {
        state.historyList = payload.data
        return
      }
      else if (payload.type === 'clear') {
        state.historyList = []
        window.localStorage.removeItem('historylist')
        return
      }
    },
    setMusicList(state, musicList) {
      state.musicList = musicList
    },
  },
  actions: {

    sigOut({ commit, state }) {
      /* 退出登录 */
      if (!state.isLogin) return Vue.prototype.$message.warning('似乎并没有登录')
      Vue.prototype.$confirm('将要退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await getSignOut()
          if (res.data.code !== 200) return;
          Vue.prototype.$message.success('退出成功')
          commit('setLoginInfo', { account: null, profile: null, Username: null })
          console.log('getLogin 已执行')
          commit('getLogin', 0)

        })
        .catch((err) => {
          console.log(err);
          Vue.prototype.$message({
            type: 'info',
            message: '已取消'
          })
        })

    },
    /* music */
    playMusic({ commit }, payload) {
      console.log(payload.id);
      console.log(payload.list.id);
      let index = payload.list.findIndex((item) => item.id == payload.id)
      if (index !== -1) {
        commit('setMusicList', payload.list)
        commit('setCurrenMusicId', payload.id)
        commit('setCurrenIndex', index)
        commit('setPlayState', true)
      } else {
        window.alert("因版权方要求或该资源为VIP付费资源，该资源暂时无法播放，我们正在争取歌曲回归");
      }
    },
  },
  modules: {
  }
})
