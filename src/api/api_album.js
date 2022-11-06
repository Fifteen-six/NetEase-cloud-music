import { service } from '@/request'
export function getSubAlbum(cookie) {
    return service({
        method: 'GET',
        url: `/topic/sublist?limit=2&offset=1&timestamp=${Date.now()}`,
        data: {
            cookie
        }
    })
}
export function search({ limit, type, keywords }) {
    return service({
        method: 'GET',
        url: `/cloudsearch?limit=${limit}&type=${type}&keywords=${keywords}`
    })
}