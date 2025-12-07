<template>
  <div class="patient-dashboard">
    <!-- Navigation Bar -->
    <nav class="dashboard-nav">
      <div class="nav-content">
        <div class="logo">
          <img src="/logo.png" alt="Nutri-Check Logo" class="logo-icon" />
          <span class="logo-text">Nutri-Check</span>
        </div>
        <div class="nav-actions">
          <div class="user-info">
            <UserCircleIcon class="user-icon" />
            <span class="user-name">{{ patientName }}</span>
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
      <!-- Welcome Header -->
      <header class="dashboard-header">
        <div class="welcome-section">
          <h1 class="welcome-title">Welcome back, {{ patientName }}!</h1>
          <p class="welcome-subtitle">Track your health journey and monitor your BMI progress</p>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card primary bmi-gauge-card">
          <div class="bmi-gauge-container">
            <svg class="bmi-gauge" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
              <!-- Background arc segments with lighter colors -->
              <path d="M 20 100 A 80 80 0 0 1 60 30" 
                    fill="none" 
                    stroke="#93c5fd" 
                    stroke-width="16" 
                    stroke-linecap="round"
                    class="gauge-segment underweight"/>
              <path d="M 60 30 A 80 80 0 0 1 100 20" 
                    fill="none" 
                    stroke="#86efac" 
                    stroke-width="16" 
                    stroke-linecap="round"
                    class="gauge-segment normal"/>
              <path d="M 100 20 A 80 80 0 0 1 140 30" 
                    fill="none" 
                    stroke="#fcd34d" 
                    stroke-width="16" 
                    stroke-linecap="round"
                    class="gauge-segment overweight"/>
              <path d="M 140 30 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="#fca5a5" 
                    stroke-width="16" 
                    stroke-linecap="round"
                    class="gauge-segment obese"/>
              
              <!-- Shorter needle (reduced from 80 to 55 length) -->
              <line :x1="100" 
                    :y1="100" 
                    :x2="needleX" 
                    :y2="needleY" 
                    stroke="white" 
                    stroke-width="3" 
                    stroke-linecap="round"
                    class="gauge-needle"/>
              <circle cx="100" cy="100" r="6" fill="white" class="gauge-center"/>
            </svg>
            
            <div class="bmi-gauge-info">
              <div class="bmi-value-display">{{ currentBMI }}</div>
              <div class="bmi-category-display" :class="getCategoryClass(currentCategory)">
                {{ currentCategory || 'Not calculated yet' }}
              </div>
            </div>
            
            <div class="bmi-gauge-legend">
              <div class="legend-item">
                <span class="legend-color underweight"></span>
                <span class="legend-text">Underweight (&lt;18.5)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color normal"></span>
                <span class="legend-text">Normal (18.5-24.9)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color overweight"></span>
                <span class="legend-text">Overweight (25-29.9)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color obese"></span>
                <span class="legend-text">Obese (≥30)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper blue">
            <ChartBarIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Records</p>
            <h3 class="stat-value">{{ totalRecords }}</h3>
            <p class="stat-change">BMI calculations saved</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <CalendarIcon class="stat-icon" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Last Check</p>
            <h3 class="stat-value">{{ lastCheckDate }}</h3>
            <p class="stat-change">{{ daysSinceLastCheck }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card highlight" @click="requestBMICheck">
            <div class="action-icon-wrapper primary">
              <ScaleIcon class="action-icon" />
            </div>
            <h3 class="action-title">Request BMI Check</h3>
            <p class="action-description">Send a request to medical staff for BMI measurement</p>
          </div>

          <div class="action-card" @click="$router.push('/patient-profile')">
            <div class="action-icon-wrapper">
              <UserIcon class="action-icon" />
            </div>
            <h3 class="action-title">My Profile</h3>
            <p class="action-description">View and update your personal information</p>
          </div>

          <div class="action-card" @click="$router.push('/patient-bmi-history')">
            <div class="action-icon-wrapper">
              <ClockIcon class="action-icon" />
            </div>
            <h3 class="action-title">BMI History</h3>
            <p class="action-description">View your BMI trends over time</p>
          </div>

          <div class="action-card" @click="scrollToHealthTips">
            <div class="action-icon-wrapper">
              <LightBulbIcon class="action-icon" />
            </div>
            <h3 class="action-title">Get Help Tips</h3>
            <p class="action-description">View personalized health recommendations</p>
            <span v-if="hasNewRecommendations" class="notification-badge">New</span>
          </div>
        </div>
      </div>

      <!-- Health Tips Section -->
      <div ref="healthTipsSection" class="health-tips-section" v-if="recommendations.length > 0">
        <div class="section-header">
          <h2 class="section-title">
            <LightBulbIcon class="section-icon" />
            Get Help Tips
          </h2>
        </div>

        <div class="tips-grid">
          <div v-for="rec in recommendations" :key="rec.id" class="tip-card" :class="getCategoryClass(rec.category)">
            <div class="tip-header">
              <div class="tip-info">
                <h3 class="tip-title">{{ rec.category }} Recommendations</h3>
                <p class="tip-meta">
                  <span>From: {{ rec.sentBy }}</span>
                  <span class="tip-date">{{ formatDate(rec.sentAt) }}</span>
                </p>
              </div>
              <span class="tip-bmi">BMI: {{ rec.bmi ? rec.bmi.toFixed(1) : 'N/A' }}</span>
            </div>

            <div class="tip-content">
              <div class="tip-section">
                <h4 class="tip-section-title">
                  <HeartIcon class="tip-section-icon" />
                  Dietary Suggestions
                </h4>
                <ul class="tip-list">
                  <li v-for="(item, index) in rec.recommendations.dietary" :key="index">{{ item }}</li>
                </ul>
              </div>

              <div class="tip-section">
                <h4 class="tip-section-title">
                  <FireIcon class="tip-section-icon" />
                  Lifestyle Recommendations
                </h4>
                <ul class="tip-list">
                  <li v-for="(item, index) in rec.recommendations.lifestyle" :key="index">{{ item }}</li>
                </ul>
              </div>
            </div>

            <button @click="markAsRead(rec.id)" v-if="!rec.read" class="mark-read-btn">
              <CheckCircleIcon class="btn-icon" />
              Mark as Read
            </button>
          </div>
        </div>
      </div>

      <!-- Recent BMI Records -->
      <div class="recent-records-section">
        <div class="section-header">
          <h2 class="section-title">Recent BMI Records</h2>
          <button @click="$router.push('/patient-bmi-history')" class="view-all-btn">
            View All
            <ArrowRightIcon class="btn-icon" />
          </button>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your records...</p>
        </div>

        <div v-else-if="recentRecords.length === 0" class="empty-state">
          <ScaleIcon class="empty-icon" />
          <h3>No BMI Records Yet</h3>
          <p>Start tracking your health by calculating your first BMI</p>
          <button @click="$router.push('/patient-bmi-calculator')" class="empty-action-btn">
            <CalculatorIcon class="btn-icon" />
            Calculate BMI Now
          </button>
        </div>

        <div v-else class="records-grid">
          <div v-for="record in recentRecords" :key="record.id" class="record-card">
            <div class="record-header">
              <span class="record-date">{{ formatDate(record.timestamp) }}</span>
              <span :class="['record-badge', getCategoryClass(record.category)]">
                {{ record.category }}
              </span>
            </div>
            <div class="record-body">
              <div class="record-bmi">
                <span class="bmi-label">BMI</span>
                <span class="bmi-value">{{ record.bmi.toFixed(1) }}</span>
              </div>
              <div class="record-details">
                <div class="detail-item">
                  <span class="detail-label">Weight</span>
                  <span class="detail-value">{{ record.weight }} kg</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Height</span>
                  <span class="detail-value">{{ record.height }} cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  HeartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ScaleIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  CalculatorIcon,
  ClockIcon,
  LightBulbIcon,
  ArrowRightIcon,
  FireIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const patientName = ref('')
const loading = ref(true)
const recentRecords = ref([])
const allRecords = ref([])
const recommendations = ref([])
const hasNewRecommendations = ref(false)
const healthTipsSection = ref(null)

onMounted(async () => {
  // Check if patient is logged in
  const patientId = sessionStorage.getItem('patientId')
  if (!patientId) {
    router.push('/patient-login')
    return
  }

  patientName.value = sessionStorage.getItem('patientName') || 'Patient'
  await fetchBMIRecords()
  await fetchRecommendations()
})

const fetchBMIRecords = async () => {
  loading.value = true
  try {
    const patientId = sessionStorage.getItem('patientId')
    if (!patientId) return

    console.log('Fetching BMI data for patient:', patientId)

    // Get patient's current BMI from patientAccounts
    const patientDocRef = doc(db, 'patientAccounts', patientId)
    const patientDoc = await getDoc(patientDocRef)
    
    if (patientDoc.exists()) {
      const patientData = patientDoc.data()
      console.log('Patient data:', patientData)
      
      // If patient has BMI data, add it as the most recent record
      if (patientData.bmi) {
        allRecords.value = [{
          id: 'current',
          bmi: patientData.bmi,
          category: patientData.category,
          weight: patientData.weight,
          height: patientData.height,
          timestamp: patientData.lastBMIUpdate || patientData.createdAt || new Date()
        }]
      }
    }

    // Get BMI history from patients collection (fetch all, filter in JS)
    const historySnapshot = await getDocs(collection(db, 'patients'))
    
    // Filter for this patient
    const historyRecords = []
    historySnapshot.forEach(doc => {
      const data = doc.data()
      if (data.patientId === patientId) {
        historyRecords.push({
          id: doc.id,
          ...data
        })
      }
    })
    
    console.log('History records:', historyRecords.length)
    
    // Sort by timestamp
    historyRecords.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp)
      return dateB - dateA
    })
    
    // Combine current and history
    if (historyRecords.length > 0) {
      allRecords.value = [...allRecords.value, ...historyRecords]
    }
    
    // Get recent 3 records
    recentRecords.value = allRecords.value.slice(0, 3)
    
    console.log('Total records:', allRecords.value.length)
  } catch (error) {
    console.error('Error fetching BMI records:', error)
    console.error('Error details:', error.message)
  } finally {
    loading.value = false
  }
}

const currentBMI = computed(() => {
  if (allRecords.value.length === 0) return 'N/A'
  const bmi = allRecords.value[0].bmi
  return bmi ? bmi.toFixed(1) : 'N/A'
})

const currentCategory = computed(() => {
  if (allRecords.value.length === 0) return ''
  return allRecords.value[0].category || ''
})

const totalRecords = computed(() => {
  return allRecords.value.length
})

const lastCheckDate = computed(() => {
  if (allRecords.value.length === 0) return 'Never'
  const timestamp = allRecords.value[0].timestamp
  if (!timestamp) return 'Unknown'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
})

const daysSinceLastCheck = computed(() => {
  if (allRecords.value.length === 0) return 'No records yet'
  
  const timestamp = allRecords.value[0].timestamp
  if (!timestamp) return 'Unknown'
  
  const lastDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const today = new Date()
  const diffTime = Math.abs(today - lastDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
})

const needleX = computed(() => {
  if (allRecords.value.length === 0) return 100
  const bmi = allRecords.value[0].bmi
  if (!bmi) return 100
  
  // Map BMI to angle (0-180 degrees)
  let angle
  if (bmi < 18.5) {
    angle = (bmi / 18.5) * 45
  } else if (bmi < 25) {
    angle = 45 + ((bmi - 18.5) / 6.5) * 45
  } else if (bmi < 30) {
    angle = 90 + ((bmi - 25) / 5) * 45
  } else {
    angle = 135 + Math.min((bmi - 30) / 10, 1) * 45
  }
  
  const radians = (angle * Math.PI) / 180
  return 100 + 55 * Math.cos(Math.PI - radians) // Shortened needle length
})

const needleY = computed(() => {
  if (allRecords.value.length === 0) return 100
  const bmi = allRecords.value[0].bmi
  if (!bmi) return 100
  
  let angle
  if (bmi < 18.5) {
    angle = (bmi / 18.5) * 45
  } else if (bmi < 25) {
    angle = 45 + ((bmi - 18.5) / 6.5) * 45
  } else if (bmi < 30) {
    angle = 90 + ((bmi - 25) / 5) * 45
  } else {
    angle = 135 + Math.min((bmi - 30) / 10, 1) * 45
  }
  
  const radians = (angle * Math.PI) / 180
  return 100 - 55 * Math.sin(Math.PI - radians) // Shortened needle length
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const requestBMICheck = async () => {
  try {
    const patientId = sessionStorage.getItem('patientId')
    const patientName = sessionStorage.getItem('patientName')
    
    if (!patientId) {
      alert('Please log in first')
      return
    }

    // Create a BMI request in Firestore
    await addDoc(collection(db, 'bmiRequests'), {
      patientId: patientId,
      patientName: patientName,
      status: 'pending',
      requestedAt: new Date(),
      message: 'Patient has requested a BMI measurement'
    })

    alert('BMI check request sent successfully! Medical staff will contact you soon.')
  } catch (error) {
    console.error('Error sending BMI request:', error)
    alert('Failed to send request. Please try again.')
  }
}

const fetchRecommendations = async () => {
  try {
    const patientId = sessionStorage.getItem('patientId')
    if (!patientId) return

    console.log('Fetching recommendations for patient:', patientId)

    // Get all recommendations and filter in JavaScript
    const allRecsSnapshot = await getDocs(collection(db, 'healthRecommendations'))
    
    const patientRecs = []
    allRecsSnapshot.forEach(doc => {
      const data = doc.data()
      if (data.patientId === patientId) {
        patientRecs.push({
          id: doc.id,
          ...data
        })
      }
    })

    // Sort by date (most recent first)
    patientRecs.sort((a, b) => {
      const dateA = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt)
      const dateB = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt)
      return dateB - dateA
    })

    recommendations.value = patientRecs
    hasNewRecommendations.value = patientRecs.some(rec => !rec.read)

    console.log('Recommendations loaded:', recommendations.value.length)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
  }
}

const markAsRead = async (recId) => {
  try {
    const recRef = doc(db, 'healthRecommendations', recId)
    await updateDoc(recRef, {
      read: true,
      readAt: new Date()
    })

    // Update local state
    const rec = recommendations.value.find(r => r.id === recId)
    if (rec) {
      rec.read = true
    }

    // Update badge
    hasNewRecommendations.value = recommendations.value.some(rec => !rec.read)

    // Update patient document
    const patientId = sessionStorage.getItem('patientId')
    if (patientId) {
      const patientRef = doc(db, 'patientAccounts', patientId)
      await updateDoc(patientRef, {
        hasNewRecommendations: hasNewRecommendations.value
      })
    }
  } catch (error) {
    console.error('Error marking as read:', error)
  }
}

const scrollToHealthTips = () => {
  if (healthTipsSection.value) {
    healthTipsSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleLogout = () => {
  sessionStorage.clear()
  router.push('/patient-login')
}
</script>

<style scoped>
/* Same styles as before - copying from previous PatientDashboard */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.patient-dashboard {
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
}

.logo-icon {
  height: 3.5rem;
  width: auto;
  border-radius: 8px;
  padding: 0.4rem;
  background: white;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
  border: 2px solid #42b983;
  transition: all 0.3s ease;
  object-fit: contain;
}

.logo-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
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
  color: #42b983;
}

.user-name {
  font-size: 0.95rem;
  color: #2d3748;
  font-weight: 600;
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

/* Welcome Header */
.dashboard-header {
  margin-bottom: 2.5rem;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
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

.stat-card.primary {
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
}

.stat-card.primary .stat-label,
.stat-card.primary .stat-category {
  color: rgba(255, 255, 255, 0.9);
}

.stat-card.primary .stat-value {
  color: white;
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
}

.stat-card.primary .stat-icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.stat-icon-wrapper.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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

.stat-category,
.stat-change {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.stat-category.healthy {
  color: rgba(255, 255, 255, 0.95);
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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

.action-card.highlight {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #42b983;
}

.action-card.highlight::before {
  transform: scaleX(1);
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

.action-icon-wrapper.primary {
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
}

.action-icon-wrapper.primary .action-icon {
  color: white;
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
}

.notification-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.625rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 12px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Health Tips Section */
.health-tips-section {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.section-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #42b983;
}

.tips-grid {
  display: grid;
  gap: 1.5rem;
}

.tip-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tip-card.healthy {
  border-color: #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
}

.tip-card.warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
}

.tip-card.danger {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
}

.tip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.tip-info {
  flex: 1;
}

.tip-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.tip-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.tip-date {
  font-weight: 500;
}

.tip-bmi {
  padding: 0.5rem 1rem;
  background: rgba(66, 185, 131, 0.1);
  color: #42b983;
  font-size: 1.125rem;
  font-weight: 700;
  border-radius: 8px;
}

.tip-content {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.tip-section {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
}

.tip-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.875rem;
}

.tip-section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #42b983;
}

.tip-list {
  list-style-position: inside;
  padding-left: 0.5rem;
}

.tip-list li {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.mark-read-btn {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.mark-read-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

/* Recent Records */
.recent-records-section {
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

/* Loading & Empty States */
.loading-state,
.empty-state {
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

/* Records Grid */
.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.record-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.record-card:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.record-date {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.record-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.record-badge.healthy {
  background: #d1fae5;
  color: #065f46;
}

.record-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.record-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.record-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-bmi {
  display: flex;
  flex-direction: column;
}

.bmi-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.bmi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #42b983;
}

.record-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.detail-value {
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 600;
}

/* BMI Gauge Styles */
.bmi-gauge-card {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.bmi-gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.bmi-gauge {
  width: 100%;
  max-width: 280px;
  height: auto;
}

.gauge-segment {
  transition: all 0.3s ease;
  opacity: 0.9;
}

.gauge-segment:hover {
  opacity: 1;
  filter: brightness(1.1);
}

.gauge-needle {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.5s ease;
}

.gauge-center {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.bmi-gauge-info {
  text-align: center;
}

.bmi-value-display {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.bmi-category-display {
  font-size: 1.125rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.bmi-gauge-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  width: 100%;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-color.underweight {
  background: #93c5fd;
}

.legend-color.normal {
  background: #86efac;
}

.legend-color.overweight {
  background: #fcd34d;
}

.legend-color.obese {
  background: #fca5a5;
}

.legend-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .user-info {
    display: none;
  }

  .dashboard-container {
    padding: 1.5rem 1rem;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }
}
</style>
