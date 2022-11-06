import { service } from "@/request";
export function getPersonalized(limit) {
    return service({
        /* 获取推荐歌单 */
        method: 'GET',
        url: `/personalized?limit=${limit}&timestamp=${Date.now()}`
    })
}
export function getPlayListDetail(id) {
    /* 获取歌单详情 */
    return service({
        method: 'GET',
        url: `/playlist/detail?id=${id}&timestamp=${Date.now()}`
    })
}
export function getToplist() {
    /* 获取排行榜信息 */
    return service({
        method: 'GET',
        url: `/toplist`
    })
}
export function getAllCat() {
    /* 获取歌单分类 */
    return service({
        method: 'GET',
        url: `/playlist/catlist`
    })
}
export function getHotCat() {
    /* 获取热门歌单分类 */
    return service({
        method: 'GET',
        url: `/playlist/hot`
    })
}
export function getRecSongList() {
    // 获取推荐歌单
    return service({
        method: 'GET',
        url: `/personalized`
    })
}
export function getHighquality(limit, cat, before) {
    // 获取精品歌单
    return service({
        method: 'GET',
        url: `/top/playlist/highquality?limit=${limit}&cat=${cat}&before=${before}`
    })
}
export function getPlayListByCat(limit, order, cat, offset) {
    //根据分类获取歌单
    return service({
        method: 'GET',
        url: `/top/playlist?limit=${limit}&cat=${cat}&order=${order}&offset=${offset}`
    })
}



// export function getHotCat() {
//     // 获取热门歌单分类
//     return service({
//         method: 'GET',
//         url: `/playlist/hot`
//     })
// }
