import { service } from "@/request"
/*二维码登录*/
//获取二维码key
export function getQrKey() {
    return service({
        method: 'GET',
        url: `/login/qr/key?timestamp=${Date.now()}`
    })
}
//生成二维码Base 64
// export const createQr = (key, qrimg = true) => get('/login/qr/create', { key, qrimg, timestamp: Date.now() })
export function createQr(key, qrimg = true) {
    return service({
        method: 'GET',
        url: `/login/qr/create?key=${key}&qrimg=${qrimg}&timestamp=${Date.now()}`

    })
}
//轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
export function checkQr(key) {
    return service({
        method: 'GET',
        url: `/login/qr/check?key=${key}&timestamp=${Date.now()}`,

    })
}
//获取用户登录状态
export function getLoginStatus(cookie) {
    return service({
        method: 'GET',
        url: `/login/status?timestamp=${Date.now()}`,
        data: {
            cookie
        }
    })
}
//获取账号信息
export function getAcount(val) {
    return service({
        method: 'GET',
        url: `/user/account?timestamp=${Date.now()}&cookie=${val}`,
    })
}
//获取用户详情
export function getUserDetail(uid) {
    return service({
        method: 'GET',
        url: `/user/detail?uid=${uid}&timestamp=${Date.now()}`
    })
}
//获取用户歌单
export function getUserPlayList(uid, limit = 30) {
    return service({
        method: 'GET',
        url: `/user/playlist?uid=${uid}&limit=${limit}&timestamp=${Date.now()}`
    })
}