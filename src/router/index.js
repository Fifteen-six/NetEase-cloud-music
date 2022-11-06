import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: "/homepage",
    children: [
      { path: '/homepage', title: "发现音乐", component: () => import('../home/homepage.vue'), },// 
      { path: "/recomsongs", component: () => import('../LeftContent/recomSongs.vue'), title: "每日推荐", Login: true, type: 1 },
      { path: "/personalfm", component: () => import('../LeftContent/personalfm.vue'), title: "私人FM", Login: true, type: 0 },
      { path: "/historyplay", component: () => import('../LeftContent/historyplay.vue'), title: "最近播放", Login: false, type: 1 },
      { path: "/subscribe", component: () => import('../LeftContent/subscribe.vue'), title: "我的收藏", Login: true, type: 1 },
      { path: '/Login_on/:id', component: () => import('../Login/Login_on.vue'), props: true, meta: { title: '用户主页' } },//个人主页
      { path: "/playlistdetail/:id", component: () => import('../components/playlistdetail.vue'), props: true, meta: { title: '歌单' } },//歌单详情页
      { path: "/search", component: () => import('../components/search.vue'), props: (route) => ({ keywords: route.query.keywords }) },//搜索详情

    ]


  },
  {
    path: '/header',
    name: 'Header',
    component: () => import('../components/header.vue'),

  },
  {//登录
    path: '/Login',
    name: 'Login',
    component: () => import('../Login/Login.vue')
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
