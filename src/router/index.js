import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import BmiCalculator from '../components/BmiCalculatorClean.vue'
import HealthSuggestionPage from '../views/HealthSuggestionPage.vue'
import PatientInfoPage from '../views/PatientInfoPage.vue'
import PatientListPage from '../views/PatientListPage.vue'
import PatientDetailPage from '../views/PatientDetailPage.vue'
import LoginPage from '../views/LoginPage.vue'
import PatientLoginPage from '../views/PatientLoginPage.vue'
import PatientDashboardPage from '../views/PatientDashboardPage.vue'
import PatientProfilePage from '../views/PatientProfilePage.vue'
import PatientBMIHistory from '../views/PatientBMIHistory.vue'

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
    path: '/patient-login',
    name: 'PatientLogin',
    component: PatientLoginPage
  },
  {
    path: '/patient-dashboard',
    name: 'PatientDashboard',
    component: PatientDashboardPage,
    meta: { requiresPatientAuth: true }
  },
  {
    path: '/patient-profile',
    name: 'PatientProfile',
    component: PatientProfilePage,
    meta: { requiresPatientAuth: true }
  },
  {
    path: '/patient-bmi-history',
    name: 'PatientBMIHistory',
    component: PatientBMIHistory,
    meta: { requiresPatientAuth: true }
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
  const requiresPatientAuth = to.matched.some(record => record.meta.requiresPatientAuth)
  const medStaffId = sessionStorage.getItem('medStaffId')
  const patientId = sessionStorage.getItem('patientId')

  // Check medical professional auth
  if (requiresAuth && !medStaffId) {
    next('/login')
  } 
  // Check patient auth
  else if (requiresPatientAuth && !patientId) {
    next('/patient-login')
  }
  // Redirect logged-in medical professional from login page
  else if (to.path === '/login' && medStaffId) {
    next('/dashboard')
  }
  // Redirect logged-in patient from patient login page
  else if (to.path === '/patient-login' && patientId) {
    next('/patient-dashboard')
  }
  else {
    next()
  }
})

export default router