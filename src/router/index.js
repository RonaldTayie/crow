import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexView from "@/views/IndexView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: IndexView
  },
  {
    path:"/home",
    name:"Home",
    component: ()=>import('../views/HomeView'),
    beforeEnter: (to, from, next) => {
      if (localStorage.token != undefined) {
        next()
      } else {
        router.push(from)
      }
    },
  },
  {
    path:"/report/:uid/:startDate/:endDate",
    name:"Report",
    component: ()=> import('../views/ReportView'),
    beforeEnter: (to, from, next) => {
      if (localStorage.token != undefined) {
        next()
      } else {
        router.push(from)
      }
    },
  },
  {
    path:"/geofence/:uid",
    name:"GeoFence",
    component: ()=> import('../views/GeofenceView'),
    beforeEnter: (to, from, next) => {
      if (localStorage.token != undefined) {
        next()
      } else {
        router.push(from)
      }
    },
  },
  {
    path:"/geofence/",
    name:"NewGeoFence",
    component: ()=> import('../views/GeofenceView'),
    beforeEnter: (to, from, next) => {
      if (localStorage.token != undefined) {
        next()
      } else {
        router.push(from)
      }
    },
  },
  {
    path:"/fleet",
    name:"FleetView",
    component: ()=> import('../views/FleetView'),
    beforeEnter: (to, from, next) => {
      if (localStorage.token != undefined) {
        next()
      } else {
        router.push(from)
      }
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  hash: false,
  routes
})

export default router
