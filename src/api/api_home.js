import { service } from "@/request";
// 搜索建议
export function getSuggest(keywords) {
    return service({
        method: 'GET',
        url: `/search/suggest?keywords=${keywords}`
    })
}
//热搜
export function getHotSearch() {
    return service({
        method: 'GET',
        url: '/search/hot/detail'
    })
}
//轮播图
export function getBanner() {
    return service({
        method: 'GET',
        url: `/banner`
    })
}
//退出登录
export function getSignOut() {
    return service({
        method: 'GET',
        url: `/logout`
    })
}

