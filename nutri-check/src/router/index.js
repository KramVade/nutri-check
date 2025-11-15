import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BmiCalculator from '../components/BmiCalculator.vue'
import HealthSuggestionPage from '../views/HealthSuggestionPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router