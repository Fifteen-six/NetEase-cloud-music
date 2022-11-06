import { service } from "@/request";
export function getToplist() {
    //根据分类获取歌单
    return service({
        method: 'GET',
        url: `/toplist`
    })
}
export function getPlayListDetail(id) {
    //根据分类获取歌单
    return service({
        method: 'GET',
        url: `/playlist/detail?id=${id}`
    })
}
export function getTopAlbum({limit , offset, area , type , year, month}) {
    //根据分类获取歌单
    return service({
        method: 'GET',
        url: `/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`
    })
}