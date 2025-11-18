import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import BmiCalculator from '../components/BmiCalculator.vue'
import HealthSuggestionPage from '../views/HealthSuggestionPage.vue'
import PatientInfoPage from '../views/PatientInfoPage.vue'
import PatientListPage from '../views/PatientListPage.vue'
import PatientDetailPage from '../views/PatientDetailPage.vue'
import LoginPage from '../views/LoginPage.vue'
import { auth } from '../firebase'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/bmi-calculator',
    name: 'BmiCalculator',
    component: BmiCalculator,
    meta: { requiresAuth: true }
  },
  {
    path: '/health-suggestion',
    name: 'HealthSuggestionPage',
    component: HealthSuggestionPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient-info',
    name: 'PatientInfoPage',
    component: PatientInfoPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients',
    name: 'PatientListPage',
    component: PatientListPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/patients/:id',
    name: 'PatientDetailPage',
    component: PatientDetailPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const user = auth.currentUser

  if (requiresAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router