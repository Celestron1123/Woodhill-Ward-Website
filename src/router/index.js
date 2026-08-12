import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import FeedView from '../views/FeedView.vue'
import LoginView from '../views/LoginView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import HomeView from '@/views/HomeView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import ReliefSocietyView from '../views/ReliefSocietyView.vue'
import YoungWomenView from '../views/YoungWomenView.vue'
import YoungMenView from '../views/YoungMenView.vue'
import EldersQuorumView from '../views/EldersQuorumView.vue'
import PrimaryView from '../views/PrimaryView.vue'
import SundaySchoolView from '../views/SundaySchoolView.vue'
import AccountCenter from '../views/AccountCenter.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signup',
      component: AuthView,
    },
    {
      path: '/feed',
      name: 'feed',
      component: FeedView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetailView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagementView,
    },
    {
      path: '/relief-society',
      name: 'reliefSociety',
      component: ReliefSocietyView,
    },
    {
      path: '/young-women',
      name: 'youngWomen',
      component: YoungWomenView,
    },
    {
      path: '/young-men',
      name: 'youngMen',
      component: YoungMenView,
    },
    {
      path: '/elders-quorum',
      name: 'eldersQuorum',
      component: EldersQuorumView,
    },
    {
      path: '/primary',
      name: 'primary',
      component: PrimaryView,
    },
    {
      path: '/sunday-school',
      name: 'sundaySchool',
      component: SundaySchoolView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountCenter,
    },
  ],
})

export default router
