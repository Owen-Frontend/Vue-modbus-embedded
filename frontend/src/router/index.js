import Vue from 'vue'
import VueRouter from 'vue-router'
import AddRule from '../views/addRule'
import Table from '../views/table'
import Temperature from '../views/temperature'
import About from '../components/about'

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const routes = [{
    path: '/',
    name: 'table',
    component: Table
  },
  {
    path: '/addRule',
    name: 'addRule',
    component: AddRule
  },
  {
    path: '/temperature',
    name: 'temperature',
    component: Temperature
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }

]

const router = new VueRouter({
  routes
})

export default router