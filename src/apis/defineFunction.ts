import axios from "./axiosApi"
import {ElNotification} from 'element-plus'
import router from '@/router/routerIndex'

export function ServerDataRequest(yourUrl:any) {
    return axios.post(yourUrl).then(async(res:any) => {
        if (res.data.code == "50000") {
            await notify_messeage("没有登录或登录凭证失效,前往登录中...", "error")
            await setTimeout(() => {
                router.push('/login')
            }, 1000)
        } else {
            console.log("Request is Sucess! RequestMapping is ->\t" + yourUrl)
            return res.data
        }
    }).catch((error:any) => {
        console.log("Request is error! check your server! -> \t" + error);
        notify_messeage("数据获取失败，服务器的问题", "error")
    })
}

export function colorFuntion(color:String) {
    if (color == '晨岛') return 'blue'
    if (color == '云野') return 'green'
    if (color == '雨林') return 'cornflowerblue'
    if (color == '墓土') return 'black'
    if (color == '霞谷') return 'salmon'
    if (color == '禁阁') return 'slateblue'
}

export function notify_messeage(titled:any, typed:any) {
    ElNotification({
        title: titled,
        type: typed,
    });
}

export const $staticData = "/api/image/" // 静态资源用的全局url
