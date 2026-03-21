import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'main',
      component: MainView,
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  if ((to.path === '/login' || to.path === '/register') && token) {
    return '/'
  }

  if (to.path !== '/login' && to.path !== '/register' && !token) {
    return '/login'
  }
})

export default router