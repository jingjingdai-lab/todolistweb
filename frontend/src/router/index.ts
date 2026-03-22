import { createRouter, createWebHistory } from 'vue-router'

// Import page components (views)
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MainView from '../views/MainView.vue'

// Create the router instance
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

// Global navigation guard (runs before each route change)
router.beforeEach((to) => {
  const token = localStorage.getItem('token')

  // Case 1: User is already logged in but tries to access login/register
  if ((to.path === '/login' || to.path === '/register') && token) {
    return '/'
  }

  // Case 2: User is NOT logged in and tries to access protected pages
  if (to.path !== '/login' && to.path !== '/register' && !token) {
    return '/login'
  }
})


export default router