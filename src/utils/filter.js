import Vue from "vue";
/* 歌曲时长的过滤器 */
Vue.filter('timeFormat', function (time) {
    if (typeof time === 'undefined') return 0
    let minutes = parseInt(time / 60); // 获取时长分钟
    let seconds = parseInt(time % 60); // 获取时长秒数
    seconds = seconds < 10 ? '0' + seconds : seconds // 秒
    minutes = minutes < 10 ? '0' + minutes : minutes
    return minutes + ':' + seconds
})