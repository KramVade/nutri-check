<template>
  <div class="dashboard-page">
    <!-- Navigation Bar -->
    <nav class="dashboard-nav">
      <div class="nav-content">
        <div class="logo" @click="$router.push('/dashboard')">
          <HeartIcon class="logo-icon" />
          <span class="logo-text">Nutri-Check</span>
        </div>
        <div class="nav-actions">
          <div class="user-info">
            <UserCircleIcon class="user-icon" />
            <span class="user-email">{{ userEmail }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <ArrowRightOnRectangleIcon class="btn-icon" />
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Dashboard Content -->
    <div class="dashboard-container">
      <!-- Header Section -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="header-title">Medical Professional Dashboard</h1>
            <p class="header-subtitle">Manage patient records, track BMI data, and monitor health metrics</p>
          </div>
          <button @click="$router.push('/patient-info')" class="add-patient-btn">
            <UserPlusIcon class="btn-icon" />
            Add New Patient
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <UsersIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Patients</p>
            <h3 class="stat-value">{{ totalPatients }}</h3>
            <p class="stat-change positive">
              <ArrowTrendingUpIcon class="change-icon" />
              {{ newPatientsThisWeek }} new this week
            </p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper green">
            <HeartIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Healthy BMI</p>
            <h3 class="stat-value">{{ healthyCount }}</h3>
            <p class="stat-change">
              {{ healthyPercentage }}% of total patients
            </p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper yellow">
            <ExclamationTriangleIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Needs Attention</p>
            <h3 class="stat-value">{{ needsAttentionCount }}</h3>
            <p class="stat-change warning">
              Overweight or Underweight
            </p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <ChartBarIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Avg BMI</p>
            <h3 class="stat-value">{{ averageBMI }}</h3>
            <p class="stat-change">
              Across all patients
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/patient-info')">
            <div class="action-icon-wrapper">
              <UserPlusIcon class="action-icon" />
            </div>
            <h3 class="action-title">Add Patient</h3>
            <p class="action-description">Register new patient and collect basic information</p>
            <div class="action-arrow">
              <ArrowRightIcon class="arrow-icon" />
            </div>
          </div>

          <div class="action-card" @click="$router.push('/patients')">
            <div class="action-icon-wrapper">
              <UsersIcon class="action-icon" />
            </div>
            <h3 class="action-title">View All Patients</h3>
            <p class="action-description">Browse complete patient list and records</p>
            <div class="action-arrow">
              <ArrowRightIcon class="arrow-icon" />
            </div>
          </div>

          <div class="action-card" @click="$router.push('/bmi-calculator')">
            <div class="action-icon-wrapper">
              <CalculatorIcon class="action-icon" />
            </div>
            <h3 class="action-title">BMI Calculator</h3>
            <p class="action-description">Calculate and record patient BMI data</p>
            <div class="action-arrow">
              <ArrowRightIcon class="arrow-icon" />
            </div>
          </div>

          <div class="action-card" @click="$router.push('/health-suggestion')">
            <div class="action-icon-wrapper">
              <LightBulbIcon class="action-icon" />
            </div>
            <h3 class="action-title">Health Suggestions</h3>
            <p class="action-description">View personalized health recommendations</p>
            <div class="action-arrow">
              <ArrowRightIcon class="arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Patients -->
      <div class="recent-patients-section">
        <div class="section-header">
          <h2 class="section-title">Recent Patients</h2>
          <button @click="$router.push('/patients')" class="view-all-btn">
            View All
            <ArrowRightIcon class="btn-icon" />
          </button>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading patients...</p>
        </div>

        <div v-else-if="recentPatients.length === 0" class="empty-state">
          <UsersIcon class="empty-icon" />
          <h3>No Patients Yet</h3>
          <p>Start by adding your first patient</p>
          <button @click="$router.push('/patient-info')" class="empty-action-btn">
            <UserPlusIcon class="btn-icon" />
            Add Patient
          </button>
        </div>

        <div v-else class="patients-table">
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>BMI</th>
                <th>Category</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient in recentPatients" :key="patient.id" class="patient-row">
                <td class="patient-name">
                  <UserCircleIcon class="patient-avatar" />
                  <span>{{ patient.name }}</span>
                </td>
                <td>{{ patient.age }} years</td>
                <td>{{ patient.gender }}</td>
                <td class="bmi-value">{{ patient.bmi ? patient.bmi.toFixed(1) : 'N/A' }}</td>
                <td>
                  <span :class="['category-badge', getCategoryClass(patient.category)]">
                    {{ patient.category || 'N/A' }}
                  </span>
                </td>
                <td>{{ formatDate(patient.timestamp) }}</td>
                <td>
                  <button @click="$router.push(`/patients/${patient.id}`)" class="view-btn">
                    <EyeIcon class="btn-icon" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import {
  HeartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CalculatorIcon,
  LightBulbIcon,
  EyeIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const userEmail = ref('')
const loading = ref(true)
const recentPatients = ref([])
const allPatients = ref([])

onMounted(async () => {
  userEmail.value = auth.currentUser?.email || 'Guest'
  await fetchPatients()
})

const fetchPatients = async () => {
  loading.value = true
  try {
    const q = query(collection(db, 'patients'), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    allPatients.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Get recent 5 patients
    recentPatients.value = allPatients.value.slice(0, 5)
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const totalPatients = computed(() => allPatients.value.length)

const healthyCount = computed(() => {
  return allPatients.value.filter(p => p.category === 'Normal weight').length
})

const healthyPercentage = computed(() => {
  if (totalPatients.value === 0) return 0
  return Math.round((healthyCount.value / totalPatients.value) * 100)
})

const needsAttentionCount = computed(() => {
  return allPatients.value.filter(p => 
    p.category === 'Overweight' || 
    p.category === 'Underweight' || 
    p.category === 'Obese'
  ).length
})

const averageBMI = computed(() => {
  if (allPatients.value.length === 0) return '0.0'
  const total = allPatients.value.reduce((sum, p) => sum + (p.bmi || 0), 0)
  return (total / allPatients.value.length).toFixed(1)
})

const newPatientsThisWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return allPatients.value.filter(p => {
    if (!p.timestamp) return false
    const patientDate = p.timestamp.toDate ? p.timestamp.toDate() : new Date(p.timestamp)
    return patientDate >= oneWeekAgo
  }).length
})

const getCategoryClass = (category) => {
  const classes = {
    'Normal weight': 'healthy',
    'Underweight': 'warning',
    'Overweight': 'warning',
    'Obese': 'danger'
  }
  return classes[category] || 'default'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    localStorage.removeItem('patientInfo')
    router.push('/login')
  } catch (error) {
    alert('Logout failed: ' + error.message)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: #f7fafc;
}

/* Navigation */
.dashboard-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #42b983;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.user-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #4a5568;
}

.user-email {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 500;
}

.logout-btn {
  padding: 0.625rem 1.25rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Dashboard Container */
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.dashboard-header {
  margin-bottom: 2.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.header-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
}

.add-patient-btn {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.4);
}

.add-patient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.75rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon-wrapper.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon-wrapper.yellow {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon-wrapper.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.warning {
  color: #f59e0b;
}

.change-icon {
  width: 1rem;
  height: 1rem;
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #42b983 0%, #369e73 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.action-card:hover::before {
  transform: scaleX(1);
}

.action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.action-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.action-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #42b983;
}

.action-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.action-description {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.action-arrow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #42b983;
  transition: transform 0.3s ease;
}

.action-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* Recent Patients */
.recent-patients-section {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: #42b983;
  border: 1px solid #42b983;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all-btn:hover {
  background: #42b983;
  color: white;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #cbd5e0;
  margin: 0 auto 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.empty-action-btn {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
}

/* Patients Table */
.patients-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  text-align: left;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.patient-row {
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s ease;
}

.patient-row:hover {
  background: #f7fafc;
}

td {
  padding: 1rem;
  font-size: 0.95rem;
  color: #2d3748;
}

.patient-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.patient-avatar {
  width: 2rem;
  height: 2rem;
  color: #42b983;
}

.bmi-value {
  font-weight: 600;
  color: #42b983;
}

.category-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.category-badge.healthy {
  background: #d1fae5;
  color: #065f46;
}

.category-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.category-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.category-badge.default {
  background: #e2e8f0;
  color: #4a5568;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.view-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .user-info {
    display: none;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .patients-table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
