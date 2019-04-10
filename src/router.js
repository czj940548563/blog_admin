import Vue from 'vue'
import Router from 'vue-router'
import Index from "@/views/Index";
import User from "./views/User";


Vue.use(Router)

export const constantRouterMap = [
    // { path: '/404', component: () => import('@/views/404'), hidden: true },
    {
        path: '/',
        component: Index,
        name: 'Index',
        redirect: '/home',
        hidden: true,
        children:[
            {
                path: 'home',
                component: () => import(/* webpackChunkName: "list" */ '@/views/Home'),
                //meta: { title: 'User', icon: 'icon-shoujitianchong' }
            },
        ]
    },

    {
        path: '/auth',
        component:Index,
        name: 'Auth',
        redirect: '/user',
        meta: { title: '用户权限',icon: 'fa fa-address-book' },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import(/* webpackChunkName: "list" */ '@/views/User'),
                //meta: { title: 'User', icon: 'icon-shoujitianchong' }
                meta: { title: '用户',icon: 'fa fa-address-book' },
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import(/* webpackChunkName: "list" */ '@/views/Role'),
                //meta: { title: 'Tree', icon: 'icon-gengduotianchong' }
                meta: { title: '角色',icon: 'fa fa-address-book' },
            },
        ]
    }
    // { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap

})

