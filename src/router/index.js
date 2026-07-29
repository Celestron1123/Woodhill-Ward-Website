import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import FeedView from '../views/FeedView.vue'
import LoginView from '../views/LoginView.vue'
import PostDetailView from '../views/PostDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthView
    },
    {
      path: '/feed',
      name: 'feed',
      component: FeedView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetailView
    }
  ]
})

export default router
