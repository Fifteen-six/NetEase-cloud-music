import { service } from '@/request';
/* 获取音乐详情 */
export function getMusicListByIds(ids) {
    return service({
        method: 'GET',
        url: `/song/detail?ids=${ids}`
    })

}

// 推荐新音乐
export function getRecommendSong() {
    return service({
        method: 'GET',
        url: "/personalized/newsong"
    })

}
export function getPersonalfm() {
    return service({
        method: 'GET',
        url: "/personal_fm"
    })

}
export function getPersonalized() {
    return service({
        method: 'GET',
        url: "/personalized?limit=1"
    })

}
export function getPlaylistTrack(id) {
    return service({
        method: 'GET',
        url: `/playlist/track/all?id=${id}`
    })
}
export function getRecord() {
    return service({
        method: 'GET',
        url: `/record/recent/song`
    })
}
export function getLyric(id) {
    return service({
        method: 'GET',
        url: `/lyric?id=${id}`
    })
}
export function getMusicUrl(id) {
    return service({
        method: 'GET',
        url: `/song/url?id=${id}`
    })
}
