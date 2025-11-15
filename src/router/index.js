import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BmiCalculator from '../components/BmiCalculator.vue'
import HealthSuggestionPage from '../views/HealthSuggestionPage.vue'
import PatientInfoPage from '../views/PatientInfoPage.vue' // Add this import
import PatientListPage from '../views/PatientListPage.vue'
import PatientDetailPage from '../views/PatientDetailPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bmi-calculator',
    name: 'BmiCalculator',
    component: BmiCalculator
  },
  {
    path: '/health-suggestion',
    name: 'HealthSuggestionPage',
    component: HealthSuggestionPage
  },
  {
    path: '/patient-info', // Add this route
    name: 'PatientInfoPage',
    component: PatientInfoPage
  },
  {
    path: '/patients',
    name: 'PatientListPage',
    component: PatientListPage
  },
  {
    path: '/patients/:id',
    name: 'PatientDetailPage',
    component: PatientDetailPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router