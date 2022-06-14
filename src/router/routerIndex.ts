import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/views/Login.vue"
import rootIndex from '@/views/rootIndex.vue'
import userIndex from '@/views/userIndex.vue'
import {ElNotification} from 'element-plus'
const routes = [{
        path: '/',
        name: 'User_index',
        component: userIndex,
        meta: {
            isAuth: false
        },
    },
    {
        path: '/root',
        name: 'root_index',
        component: rootIndex,
        meta: {
            isAuth: true
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            isAuth: false
        },
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/root' && localStorage.getItem('loginUsername') != 'admin') {
        // 如果非管理员用户跳转后台 则强行跳转
        ElNotification({
            title:'你不是管理员！,即将跳转！',
            type:'warning'
        })
        setTimeout(async function(){
            await router.push("/")
            await router.go(0)
        },1000)
        return
    }
    if (to.meta.isAuth) {
        let token = localStorage.getItem('Authorization')
        if (token != '' || token != null)
            next()
        else {
            next("/login")
        }
    } else {
        next();
    }
})

export default router