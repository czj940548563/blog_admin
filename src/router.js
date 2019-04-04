import Vue from 'vue'
import Router from 'vue-router'
import User from "@/views/User";
import Index from "@/views/Index";
import Header from "@/views/Header";
import Aside from "@/views/Aside";

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [

    {
      path: '/header',
      name: 'header',
      component: Header
    },
    {
      path: '/aside',
      name: 'aside',
      component: Aside
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
  ]
})
