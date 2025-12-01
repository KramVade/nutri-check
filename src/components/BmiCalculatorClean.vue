<template>
  <div class="bmi-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="logo" @click="$router.push('/dashboard')">
          <HeartIcon class="logo-icon" />
          <span class="logo-text">Nutri-Check</span>
        </div>
        <button @click="$router.push('/dashboard')" class="back-btn">
          <ArrowLeftIcon class="btn-icon" />
          Back to Dashboard
        </button>
      </div>
    </nav>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">BMI Calculator</h1>
        <p class="page-subtitle">Select a patient and calculate their Body Mass Index</p>
      </div>

      <!-- Patient Selection -->
      <div v-if="!selectedPatient" class="selection-card">
        <h2 class="card-title">Select Patient</h2>
        
        <!-- Search -->
        <div class="search-wrapper">
          <MagnifyingGlassIcon class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search patients..."
            class="search-input"
          />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Loading patients...</p>
        </div>

        <!-- Patient List -->
        <div v-else-if="filteredPatients.length > 0" class="patient-list">
          <div 
            v-for="patient in filteredPatients" 
            :key="patient.id"
            @click="selectPatient(patient)"
            class="patient-card"
          >
            <UserCircleIcon class="patient-icon" />
            <div class="patient-info">
              <div class="patient-name">{{ patient.name }}</div>
              <div class="patient-details">{{ patient.age }} yrs • {{ patient.gender }}</div>
            </div>
            <ArrowRightIcon class="arrow-icon" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="empty">
          <p>No patients found</p>
        </div>
      </div>

      <!-- BMI Calculator -->
      <div v-else class="calculator-card">
        <!-- Selected Patient -->
        <div class="selected-patient">
          <div class="patient-badge">
            <UserCircleIcon class="badge-icon" />
            <div>
              <div class="badge-name">{{ selectedPatient.name }}</div>
              <div class="badge-details">{{ selectedPatient.age}} yrs • {{ selectedPatient.gender }}</div>
            </div>
          </div>
          <button @click="clearSelection" class="change-btn">
            Change Patient
          </button>
        </div>

        <!-- Input Form -->
        <div class="form-section">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Weight (kg)</label>
              <input v-model.number="weight" type="number" step="0.1" class="form-input" placeholder="0.0" />
            </div>
            <div class="form-group">
              <label class="form-label">Height (cm)</label>
              <input v-model.number="height" type="number" step="0.1" class="form-input" placeholder="0.0" />
            </div>
          </div>

          <button @click="calculateBMI" class="calc-btn" :disabled="calculating">
            {{ calculating ? 'Calculating...' : 'Calculate & Save BMI' }}
          </button>
        </div>

        <!-- Result -->
        <div v-if="bmi" class="result-section">
          <div class="bmi-result">
            <div class="bmi-number">{{ bmi.toFixed(1) }}</div>
            <div class="bmi-label">BMI</div>
          </div>
          <div class="category-badge" :class="categoryClass">
            {{ category }}
          </div>
        </div>

        <!-- BMI Info -->
        <div class="bmi-info">
          <p class="info-text">
            <strong>Note:</strong> BMI is calculated using the standard WHO/CDC formula: weight(kg) ÷ [height(m)]². 
            Adult categories (&lt;18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, ≥30 obese) apply to ages 20+. 
            BMI is a screening tool and should be interpreted with other health factors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const patients = ref([])
const loading = ref(true)
const selectedPatient = ref(null)
const searchQuery = ref('')
const weight = ref(null)
const height = ref(null)
const bmi = ref(null)
const category = ref('')
const calculating = ref(false)

const filteredPatients = computed(() => {
  if (!searchQuery.value) return patients.value
  const q = searchQuery.value.toLowerCase()
  return patients.value.filter(p => 
    p.name?.toLowerCase().includes(q) ||
    p.email?.toLowerCase().includes(q)
  )
})

const categoryClass = computed(() => {
  const classes = {
    'Normal weight': 'healthy',
    'Underweight': 'warning',
    'Overweight': 'warning',
    'Obese': 'danger'
  }
  return classes[category.value] || ''
})

const fetchPatients = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'patientAccounts'))
    patients.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const selectPatient = (patient) => {
  selectedPatient.value = patient
  weight.value = patient.weight || null
  height.value = patient.height || null
  if (patient.bmi) {
    bmi.value = patient.bmi
    category.value = patient.category || ''
  }
}

const clearSelection = () => {
  selectedPatient.value = null
  weight.value = null
  height.value = null
  bmi.value = null
  category.value = ''
}

const calculateBMI = async () => {
  if (!weight.value || !height.value) {
    alert('Please enter weight and height')
    return
  }

  calculating.value = true

  try {
    // Standard BMI Formula: BMI = weight(kg) / [height(m)]²
    const heightInMeters = height.value / 100
    bmi.value = weight.value / (heightInMeters * heightInMeters)

    // WHO/CDC Adult Categories (20+ years, same for both sexes)
    // Source: CDC.gov, WHO guidelines
    if (bmi.value < 18.5) {
      category.value = 'Underweight'
    } else if (bmi.value >= 18.5 && bmi.value < 25.0) {
      category.value = 'Normal weight'
    } else if (bmi.value >= 25.0 && bmi.value < 30.0) {
      category.value = 'Overweight'
    } else {
      category.value = 'Obese'
    }

    const medStaffId = sessionStorage.getItem('medStaffId')
    const medStaffName = sessionStorage.getItem('medStaffName')

    await addDoc(collection(db, 'patients'), {
      patientId: selectedPatient.value.id,
      patientName: selectedPatient.value.name,
      weight: weight.value,
      height: height.value,
      bmi: bmi.value,
      category: category.value,
      medStaffId,
      medStaffName,
      timestamp: new Date()
    })

    await updateDoc(doc(db, 'patientAccounts', selectedPatient.value.id), {
      weight: weight.value,
      height: height.value,
      bmi: bmi.value,
      category: category.value,
      lastBMIUpdate: new Date()
    })

    alert('BMI saved successfully!')
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to save BMI')
  } finally {
    calculating.value = false
  }
}

onMounted(fetchPatients)
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.bmi-page {
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
  width: 2rem;
  height: 2rem;
  color: #42b983;
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

/* Cards */
.selection-card,
.calculator-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

/* Search */
.search-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.125rem;
  height: 1.125rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

/* Patient List */
.patient-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.patient-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.2s;
}

.patient-card:last-child {
  border-bottom: none;
}

.patient-card:hover {
  background: #f7fafc;
}

.patient-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #42b983;
  flex-shrink: 0;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
}

.patient-details {
  font-size: 0.875rem;
  color: #6b7280;
}

.arrow-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #cbd5e0;
}

/* Selected Patient */
.selected-patient {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #d1fae5;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.patient-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon {
  width: 2rem;
  height: 2rem;
  color: #065f46;
}

.badge-name {
  font-size: 1rem;
  font-weight: 600;
  color: #065f46;
}

.badge-details {
  font-size: 0.875rem;
  color: #047857;
}

.change-btn {
  padding: 0.5rem 1rem;
  background: white;
  color: #065f46;
  border: 1px solid #10b981;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Form */
.form-section {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
}

.calc-btn {
  width: 100%;
  padding: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.calc-btn:hover:not(:disabled) {
  background: #369e73;
}

.calc-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Result */
.result-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: #f0fdf4;
  border-radius: 8px;
}

.bmi-result {
  text-align: center;
}

.bmi-number {
  font-size: 3rem;
  font-weight: 700;
  color: #42b983;
}

.bmi-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.category-badge {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1.125rem;
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

/* Loading & Empty */
.loading,
.empty {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
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

/* BMI Info */
.bmi-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
}

.info-text {
  font-size: 0.8125rem;
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
}

.info-text strong {
  font-weight: 600;
  color: #1e3a8a;
}

/* Responsive */
@media (max-width: 768px) {
  .main-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .selected-patient {
    flex-direction: column;
    gap: 1rem;
  }

  .change-btn {
    width: 100%;
  }

  .info-text {
    font-size: 0.75rem;
  }
}
</style>
