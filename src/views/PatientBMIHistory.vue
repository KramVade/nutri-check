<template>
  <div class="bmi-history-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="logo" @click="$router.push('/patient-dashboard')">
          <img src="/logo.png" alt="Nutri-Check Logo" class="logo-icon" />
          <span class="logo-text">Nutri-Check</span>
        </div>
        <button @click="$router.push('/patient-dashboard')" class="back-btn">
          <ArrowLeftIcon class="btn-icon" />
          Back to Dashboard
        </button>
      </div>
    </nav>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">BMI History</h1>
        <p class="page-subtitle">Track your BMI measurements over time</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading your BMI history...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="records.length === 0" class="empty-state">
        <ChartBarIcon class="empty-icon" />
        <h3>No BMI Records Yet</h3>
        <p>Your BMI measurements will appear here once recorded by medical staff</p>
        <button @click="$router.push('/patient-dashboard')" class="action-btn">
          Back to Dashboard
        </button>
      </div>

      <!-- Records List -->
      <div v-else class="records-section">
        <div class="records-header">
          <h2 class="section-title">All Records ({{ records.length }})</h2>
        </div>

        <div class="records-list">
          <div v-for="(record, index) in records" :key="record.id" class="record-card">
            <div class="record-number">#{{ records.length - index }}</div>
            <div class="record-content">
              <div class="record-main">
                <div class="bmi-display">
                  <div class="bmi-value">{{ record.bmi.toFixed(1) }}</div>
                  <div class="bmi-label">BMI</div>
                </div>
                <div class="category-badge" :class="getCategoryClass(record.category)">
                  {{ record.category }}
                </div>
              </div>
              <div class="record-details">
                <div class="detail-item">
                  <span class="detail-label">Weight:</span>
                  <span class="detail-value">{{ record.weight }} kg</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Height:</span>
                  <span class="detail-value">{{ record.height }} cm</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">{{ formatDate(record.timestamp) }}</span>
                </div>
                <div v-if="record.medStaffName" class="detail-item">
                  <span class="detail-label">Recorded by:</span>
                  <span class="detail-value">{{ record.medStaffName }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  ChartBarIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const loading = ref(true)
const records = ref([])

onMounted(async () => {
  const patientId = sessionStorage.getItem('patientId')
  if (!patientId) {
    router.push('/patient-login')
    return
  }

  await fetchBMIHistory(patientId)
})

const fetchBMIHistory = async (patientId) => {
  loading.value = true
  try {
    console.log('=== Fetching BMI history ===')
    console.log('Patient ID:', patientId)

    // Get current BMI from patientAccounts
    const patientDocRef = doc(db, 'patientAccounts', patientId)
    console.log('Fetching from patientAccounts...')
    const patientDoc = await getDoc(patientDocRef)
    
    const allRecords = []
    
    if (patientDoc.exists()) {
      const patientData = patientDoc.data()
      console.log('Patient data found:', patientData)
      
      if (patientData.bmi) {
        console.log('✓ BMI data exists:', patientData.bmi)
        allRecords.push({
          id: 'current',
          bmi: patientData.bmi,
          category: patientData.category,
          weight: patientData.weight,
          height: patientData.height,
          timestamp: patientData.lastBMIUpdate || patientData.createdAt || new Date(),
          medStaffName: patientData.lastUpdatedBy || null
        })
      } else {
        console.log('⚠️ No BMI data in patient account')
      }
    } else {
      console.log('❌ Patient document not found')
    }

    // Get history from patients collection (fetch all, filter in JS to avoid index)
    console.log('Fetching history from patients collection...')
    const historySnapshot = await getDocs(collection(db, 'patients'))
    console.log('Total patients records:', historySnapshot.size)
    
    // Filter for this patient and sort in JavaScript
    const patientRecords = []
    historySnapshot.forEach(doc => {
      const data = doc.data()
      if (data.patientId === patientId) {
        patientRecords.push({
          id: doc.id,
          ...data
        })
      }
    })
    
    console.log('History records for this patient:', patientRecords.length)
    
    // Sort by timestamp (newest first)
    patientRecords.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp)
      return dateB - dateA
    })
    
    // Add to all records
    allRecords.push(...patientRecords)

    records.value = allRecords
    console.log('✓ Total records loaded:', records.value.length)
    console.log('Records:', records.value)
  } catch (error) {
    console.error('❌ Error fetching BMI history:', error)
    console.error('Error details:', error.message)
  } finally {
    loading.value = false
  }
}

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
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bmi-history-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  background: #f7fafc;
}

/* Navigation */
.nav-bar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
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

.back-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Main Container */
.main-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
}

/* Loading & Empty */
.loading,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
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
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

/* Records Section */
.records-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.records-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.record-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.record-card:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #9ca3af;
  min-width: 3rem;
}

.record-content {
  flex: 1;
}

.record-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.bmi-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.bmi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #42b983;
}

.bmi-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.category-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
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

.record-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.95rem;
  color: #1a202c;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }

  .record-card {
    flex-direction: column;
  }

  .record-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-details {
    grid-template-columns: 1fr;
  }
}
</style>
