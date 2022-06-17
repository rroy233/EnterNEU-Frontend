import Vue from 'vue'
import VueRouter from 'vue-router'
import IndexPage from '../views/index.vue'
import StatusPage from '../views/status.vue'
import DeletePage from '../views/delete.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexPage
  },
  {
    path: '/status/:token/:key',
    name: 'status',
    component: StatusPage
  },
  {
    path: '/delete/:token/:key',
    name: 'delete',
    component: DeletePage
  },
]

const router = new VueRouter({
  base: process.env.VUE_APP_BASE_PATH,
  routes
})

export default router
