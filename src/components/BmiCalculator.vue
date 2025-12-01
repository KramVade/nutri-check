<template>
  <div class="bmi-calculator-page">
    <!-- Navigation Bar -->
    <nav class="page-nav">
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

    <!-- Main Content -->
    <div class="page-container">
      <div class="content-wrapper">
        <!-- Header -->
        <div class="page-header">
          <div class="header-icon-wrapper">
            <CalculatorIcon class="header-icon" style="width: 24px; height: 24px;" />
          </div>
          <h1 class="page-title">BMI Calculator</h1>
          <p class="page-subtitle">Calculate Body Mass Index and save health data</p>
          <p v-if="patient.name" class="patient-badge">
            <UserIcon class="badge-icon" style="width: 16px; height: 16px;" />
            Patient: {{ patient.name }}
          </p>
        </div>

        <!-- Patient Selection Card -->
        <div v-if="!selectedPatient" class="patient-selection-card">
          <div class="selection-header">
            <UsersIcon class="selection-icon" />
            <div>
              <h2 class="selection-title">Select Patient</h2>
              <p class="selection-subtitle">Choose a patient to calculate BMI</p>
            </div>
          </div>

          <!-- Search Box -->
          <div class="search-box">
            <MagnifyingGlassIcon class="search-icon" />
            <input 
              v-model="patientSearchQuery" 
              type="text" 
              placeholder="Search by name, email, or phone..."
              class="search-input"
            />
          </div>

          <!-- Loading State -->
          <div v-if="loadingPatients" class="loading-state">
            <div class="spinner"></div>
            <p>Loading patients...</p>
          </div>

          <!-- Patient List -->
          <div v-else-if="filteredPatientList.length > 0" class="patient-list">
            <div 
              v-for="patient in filteredPatientList" 
              :key="patient.id"
              @click="selectPatient(patient)"
              class="patient-item"
            >
              <UserCircleIcon class="patient-item-icon" />
              <div class="patient-item-info">
                <span class="patient-item-name">{{ patient.name }}</span>
                <span class="patient-item-details">
                  {{ patient.age }} years • {{ patient.gender }} • {{ patient.email }}
                </span>
              </div>
              <ArrowRightIcon class="patient-item-arrow" />
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state-small">
            <p>{{ patientSearchQuery ? 'No patients found' : 'No patients available' }}</p>
          </div>
        </div>

        <!-- Calculator Card -->
        <div v-else class="calculator-card">
          <!-- Selected Patient Info -->
          <div class="selected-patient-banner">
            <div class="selected-patient-info">
              <UserCircleIcon class="selected-patient-icon" />
              <div>
                <h3 class="selected-patient-name">{{ selectedPatient.name }}</h3>
                <p class="selected-patient-details">
                  {{ selectedPatient.age }} years • {{ selectedPatient.gender }} • {{ selectedPatient.email }}
                </p>
              </div>
            </div>
            <button @click="clearPatientSelection" class="change-patient-btn">
              <ArrowLeftIcon class="btn-icon" />
              Change Patient
            </button>
          </div>

          <!-- Mode Toggle -->
          <div class="mode-toggle-section">
            <div class="mode-info">
              <h3 class="mode-title">Input Mode</h3>
              <p class="mode-description">Choose between manual entry or Arduino sensors</p>
            </div>
            <button @click="toggleSensorMode" class="mode-toggle-btn" :class="{ active: sensorMode === 'sensor' }">
              <SignalIcon class="toggle-icon" />
              <span>{{ sensorMode === 'manual' ? 'Switch to Sensors' : 'Switch to Manual' }}</span>
            </button>
          </div>

          <!-- Sensor Status (only show in sensor mode) -->
          <div v-if="sensorMode === 'sensor'" class="sensor-status-section">
            <div class="sensor-status-card">
              <div class="status-item">
                <WifiIcon class="status-icon" :class="{ connected: weightSensorConnected }" />
                <div class="status-info">
                  <span class="status-label">Weight Sensor</span>
                  <span class="status-text" :class="{ connected: weightSensorConnected }">
                    {{ weightSensorStatus }}
                  </span>
                </div>
              </div>
              <div class="status-item">
                <WifiIcon class="status-icon" :class="{ connected: heightSensorConnected }" />
                <div class="status-info">
                  <span class="status-label">Height Sensor</span>
                  <span class="status-text" :class="{ connected: heightSensorConnected }">
                    {{ heightSensorStatus }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Sensor Configuration -->
            <div class="sensor-config">
              <div class="config-group">
                <label class="config-label">Weight Sensor URL:</label>
                <input v-model="WEIGHT_SENSOR_URL" type="text" class="config-input" placeholder="http://192.168.1.100:8080/weight" />
              </div>
              <div class="config-group">
                <label class="config-label">Height Sensor URL:</label>
                <input v-model="HEIGHT_SENSOR_URL" type="text" class="config-input" placeholder="http://192.168.1.101:8081/height" />
              </div>
              <button @click="readSensors" class="refresh-btn">
                <ArrowRightIcon class="btn-icon" />
                Read Sensors Now
              </button>
            </div>
          </div>

          <div class="input-section">
            <div class="form-row two-cols">
              <div class="form-group">
                <label for="weight" class="form-label">
                  <ScaleIcon class="label-icon" />
                  Weight (kg)
                  <span v-if="sensorMode === 'sensor'" class="sensor-badge">Sensor</span>
                </label>
                <input
                  id="weight"
                  v-model.number="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  step="0.1"
                  min="0"
                  class="form-input"
                  :class="{ 'sensor-active': sensorMode === 'sensor' && weightSensorConnected }"
                  :readonly="sensorMode === 'sensor'"
                />
              </div>

              <div class="form-group">
                <label for="height" class="form-label">
                  <ArrowsPointingOutIcon class="label-icon" />
                  Height (cm)
                  <span v-if="sensorMode === 'sensor'" class="sensor-badge">Sensor</span>
                </label>
                <input
                  id="height"
                  v-model.number="height"
                  type="number"
                  placeholder="Enter height in cm"
                  step="0.1"
                  min="0"
                  class="form-input"
                  :class="{ 'sensor-active': sensorMode === 'sensor' && heightSensorConnected }"
                  :readonly="sensorMode === 'sensor'"
                />
              </div>
            </div>

            <button @click="calculateBMI" class="calculate-btn" :disabled="loading">
              <span v-if="!loading">Calculate & Save BMI</span>
              <span v-else>Calculating...</span>
              <ArrowRightIcon v-if="!loading" class="btn-arrow" />
            </button>
          </div>

          <!-- Result Section -->
          <div v-if="bmi" class="result-section">
            <div class="result-card">
              <div class="bmi-display">
                <span class="bmi-label">Your BMI</span>
                <span class="bmi-value">{{ bmi.toFixed(1) }}</span>
              </div>
              <div class="category-display" :class="getCategoryClass(category)">
                <span class="category-icon">{{ getCategoryIcon(category) }}</span>
                <span class="category-text">{{ category }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <button @click="$router.push('/patients')" class="action-btn secondary">
            <UsersIcon class="btn-icon" />
            View All Patients
          </button>
          <button @click="$router.push('/dashboard')" class="action-btn secondary">
            <HomeIcon class="btn-icon" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { addDoc, collection, doc, updateDoc, getDocs } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalculatorIcon,
  UserIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
  UsersIcon,
  HomeIcon,
  SignalIcon,
  WifiIcon,
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const weight = ref(null)
const height = ref(null)
const bmi = ref(null)
const category = ref('')
const loading = ref(false)

// Patient selection
const patientList = ref([])
const loadingPatients = ref(true)
const selectedPatient = ref(null)
const patientSearchQuery = ref('')

// Arduino sensor connection
const sensorMode = ref('manual') // 'manual' or 'sensor'
const weightSensorConnected = ref(false)
const heightSensorConnected = ref(false)
const weightSensorStatus = ref('Disconnected')
const heightSensorStatus = ref('Disconnected')
const sensorPollingInterval = ref(null)

// Arduino endpoints (you'll need to set these based on your setup)
const WEIGHT_SENSOR_URL = ref('http://localhost:8080/weight') // Change to your Arduino IP
const HEIGHT_SENSOR_URL = ref('http://localhost:8081/height') // Change to your Arduino IP

const patient = ref({})

// Toggle between manual and sensor mode
const toggleSensorMode = () => {
  if (sensorMode.value === 'manual') {
    sensorMode.value = 'sensor'
    startSensorPolling()
  } else {
    sensorMode.value = 'manual'
    stopSensorPolling()
  }
}

// Read weight from Arduino sensor
const readWeightSensor = async () => {
  try {
    const response = await fetch(WEIGHT_SENSOR_URL.value, {
      method: 'GET',
      mode: 'cors'
    })
    
    if (response.ok) {
      const data = await response.json()
      weight.value = parseFloat(data.weight || data.value || 0)
      weightSensorConnected.value = true
      weightSensorStatus.value = 'Connected'
      console.log('Weight sensor reading:', weight.value, 'kg')
    } else {
      throw new Error('Failed to read weight sensor')
    }
  } catch (error) {
    console.error('Weight sensor error:', error)
    weightSensorConnected.value = false
    weightSensorStatus.value = 'Error: ' + error.message
  }
}

// Read height from Arduino sensor
const readHeightSensor = async () => {
  try {
    const response = await fetch(HEIGHT_SENSOR_URL.value, {
      method: 'GET',
      mode: 'cors'
    })
    
    if (response.ok) {
      const data = await response.json()
      height.value = parseFloat(data.height || data.value || 0)
      heightSensorConnected.value = true
      heightSensorStatus.value = 'Connected'
      console.log('Height sensor reading:', height.value, 'cm')
    } else {
      throw new Error('Failed to read height sensor')
    }
  } catch (error) {
    console.error('Height sensor error:', error)
    heightSensorConnected.value = false
    heightSensorStatus.value = 'Error: ' + error.message
  }
}

// Read both sensors
const readSensors = async () => {
  console.log('Reading sensors...')
  await Promise.all([
    readWeightSensor(),
    readHeightSensor()
  ])
}

// Start polling sensors
const startSensorPolling = () => {
  console.log('Starting sensor polling...')
  readSensors() // Read immediately
  sensorPollingInterval.value = setInterval(readSensors, 2000) // Poll every 2 seconds
}

// Stop polling sensors
const stopSensorPolling = () => {
  console.log('Stopping sensor polling...')
  if (sensorPollingInterval.value) {
    clearInterval(sensorPollingInterval.value)
    sensorPollingInterval.value = null
  }
  weightSensorConnected.value = false
  heightSensorConnected.value = false
  weightSensorStatus.value = 'Disconnected'
  heightSensorStatus.value = 'Disconnected'
}

const calculateBMI = async () => {
  if (!selectedPatient.value) {
    alert('Please select a patient first!')
    return
  }

  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    alert('Please enter valid weight and height values!')
    return
  }

  loading.value = true

  try {
    bmi.value = weight.value / ((height.value / 100) ** 2)

    if (bmi.value < 18.5) category.value = 'Underweight'
    else if (bmi.value < 24.9) category.value = 'Normal weight'
    else if (bmi.value < 29.9) category.value = 'Overweight'
    else category.value = 'Obese'

    // Get medical staff ID from session
    const medStaffId = sessionStorage.getItem('medStaffId')
    const medStaffName = sessionStorage.getItem('medStaffName')

    // Save to patients collection (for records/history)
    await addDoc(collection(db, 'patients'), {
      patientId: selectedPatient.value.id,
      patientName: selectedPatient.value.name,
      age: selectedPatient.value.age,
      gender: selectedPatient.value.gender,
      email: selectedPatient.value.email,
      weight: weight.value,
      height: height.value,
      bmi: bmi.value,
      category: category.value,
      medStaffId: medStaffId,
      medStaffName: medStaffName,
      sensorMode: sensorMode.value,
      timestamp: new Date()
    })

    // Update patient account with latest BMI data
    const patientRef = doc(db, 'patientAccounts', selectedPatient.value.id)
    await updateDoc(patientRef, {
      weight: weight.value,
      height: height.value,
      bmi: bmi.value,
      category: category.value,
      lastBMIUpdate: new Date(),
      lastUpdatedBy: medStaffName
    })

    console.log('BMI data saved successfully')
    alert('BMI data saved successfully!')
    
    // Update selected patient data
    selectedPatient.value.weight = weight.value
    selectedPatient.value.height = height.value
    selectedPatient.value.bmi = bmi.value
    selectedPatient.value.category = category.value
    
    loading.value = false
  } catch (e) {
    console.error('Failed to save BMI:', e)
    alert('Failed to save BMI result: ' + e.message)
    loading.value = false
  }
}

// Fetch all patients from patientAccounts
const fetchPatients = async () => {
  loadingPatients.value = true
  try {
    console.log('Fetching patients from patientAccounts...')
    const querySnapshot = await getDocs(collection(db, 'patientAccounts'))
    
    patientList.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log('Loaded', patientList.value.length, 'patients')
  } catch (error) {
    console.error('Error fetching patients:', error)
    alert('Failed to load patients: ' + error.message)
  } finally {
    loadingPatients.value = false
  }
}

// Filter patients based on search query
const filteredPatientList = computed(() => {
  if (!patientSearchQuery.value) {
    return patientList.value
  }
  
  const query = patientSearchQuery.value.toLowerCase()
  return patientList.value.filter(p => 
    p.name?.toLowerCase().includes(query) ||
    p.email?.toLowerCase().includes(query) ||
    p.phone?.includes(query)
  )
})

// Select a patient
const selectPatient = (patientData) => {
  console.log('Selected patient:', patientData)
  selectedPatient.value = patientData
  patient.value = patientData
  
  // Pre-fill weight and height if available
  if (patientData.weight) {
    weight.value = patientData.weight
  }
  if (patientData.height) {
    height.value = patientData.height
  }
  if (patientData.bmi) {
    bmi.value = patientData.bmi
    category.value = patientData.category || ''
  }
}

// Clear patient selection
const clearPatientSelection = () => {
  selectedPatient.value = null
  patient.value = {}
  weight.value = null
  height.value = null
  bmi.value = null
  category.value = ''
  patientSearchQuery.value = ''
  
  // Stop sensor polling if active
  if (sensorMode.value === 'sensor') {
    stopSensorPolling()
    sensorMode.value = 'manual'
  }
}

// Lifecycle hooks
onMounted(async () => {
  console.log('=== BMI Calculator Mounted ===')
  console.log('Checking icon imports...')
  console.log('HeartIcon:', typeof HeartIcon)
  console.log('CalculatorIcon:', typeof CalculatorIcon)
  console.log('UserCircleIcon:', typeof UserCircleIcon)
  
  // Check if icons are rendering correctly
  setTimeout(() => {
    const icons = document.querySelectorAll('svg')
    console.log('Total SVG elements found:', icons.length)
    icons.forEach((icon, index) => {
      const info = {
        width: icon.getAttribute('width'),
        height: icon.getAttribute('height'),
        viewBox: icon.getAttribute('viewBox'),
        computedWidth: window.getComputedStyle(icon).width,
        computedHeight: window.getComputedStyle(icon).height,
        className: icon.parentElement?.className || 'no parent class'
      }
      console.log(`Icon ${index}:`, info)
      
      // If icon is huge, log warning
      const width = parseFloat(info.computedWidth)
      const height = parseFloat(info.computedHeight)
      if (width > 100 || height > 100) {
        console.warn(`⚠️ HUGE ICON DETECTED! Icon ${index} is ${width}x${height}px`)
        console.log('Parent element:', icon.parentElement)
        console.log('Icon classes:', icon.className)
      }
    })
  }, 1000)
  
  await fetchPatients()
})

onUnmounted(() => {
  stopSensorPolling()
})

const getCategoryClass = (cat) => {
  const classes = {
    'Normal weight': 'healthy',
    'Underweight': 'warning',
    'Overweight': 'warning',
    'Obese': 'danger'
  }
  return classes[cat] || 'default'
}

const getCategoryIcon = (cat) => {
  const icons = {
    'Normal weight': '✓',
    'Underweight': '⚠',
    'Overweight': '⚠',
    'Obese': '!'
  }
  return icons[cat] || '•'
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* CRITICAL: Force all SVG icons to respect their container size */
svg {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
}

/* Prevent SVGs from growing beyond their parent */
.patient-item svg,
.selection-header svg,
.selected-patient-info svg,
.page-header svg,
.logo svg,
.back-btn svg,
.search-box svg,
.patient-item-arrow {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
}

.bmi-calculator-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

/* Navigation */
.page-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
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
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 2rem !important;
  height: 2rem !important;
  min-width: 2rem;
  min-height: 2rem;
  max-width: 2rem;
  max-height: 2rem;
  color: #42b983;
  display: block;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.back-btn {
  padding: 0.625rem 1.5rem;
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-icon {
  width: 1.125rem !important;
  height: 1.125rem !important;
  min-width: 1.125rem;
  min-height: 1.125rem;
  max-width: 1.125rem;
  max-height: 1.125rem;
  display: block;
}

/* Page Container */
.page-container {
  padding: 2rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.content-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.header-icon {
  width: 1.5rem !important;
  height: 1.5rem !important;
  min-width: 1.5rem;
  min-height: 1.5rem;
  max-width: 1.5rem;
  max-height: 1.5rem;
  color: white;
  display: block;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.patient-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.badge-icon {
  width: 1rem !important;
  height: 1rem !important;
  min-width: 1rem;
  min-height: 1rem;
  max-width: 1rem;
  max-height: 1rem;
  display: block;
}

/* Calculator Card */
.calculator-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.input-section {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-row.two-cols {
  grid-template-columns: 1fr 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #42b983;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #f7fafc;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.calculate-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.4);
}

.calculate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}

.calculate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-arrow {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.calculate-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

/* Result Section */
.result-section {
  animation: slideIn 0.5s ease-out;
}

.result-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.bmi-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bmi-label {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.bmi-value {
  font-size: 4rem;
  font-weight: 700;
  color: #42b983;
  line-height: 1;
}

.category-display {
  padding: 1rem 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.category-display.healthy {
  background: #d1fae5;
  color: #065f46;
}

.category-display.warning {
  background: #fef3c7;
  color: #92400e;
}

.category-display.danger {
  background: #fee2e2;
  color: #991b1b;
}

.category-icon {
  font-size: 1.5rem;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
}

.action-btn.secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .page-container {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .calculator-card {
    padding: 2rem 1.5rem;
  }

  .form-row.two-cols {
    grid-template-columns: 1fr;
  }

  .result-card {
    flex-direction: column;
    text-align: center;
  }

  .bmi-value {
    font-size: 3rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>


/* Mode Toggle Section */
.mode-toggle-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.mode-info {
  flex: 1;
}

.mode-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.mode-description {
  font-size: 0.95rem;
  color: #6b7280;
}

.mode-toggle-btn {
  padding: 0.875rem 1.5rem;
  background: #e2e8f0;
  color: #4a5568;
  border: 2px solid #cbd5e0;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mode-toggle-btn:hover {
  background: #cbd5e0;
}

.mode-toggle-btn.active {
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border-color: #42b983;
}

.toggle-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Sensor Status Section */
.sensor-status-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e0;
}

.sensor-status-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
}

.status-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #cbd5e0;
  transition: color 0.3s ease;
}

.status-icon.connected {
  color: #10b981;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.status-text {
  font-size: 0.875rem;
  color: #e74c3c;
  font-weight: 500;
}

.status-text.connected {
  color: #10b981;
}

/* Sensor Configuration */
.sensor-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.config-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Courier New', monospace;
  transition: all 0.3s ease;
}

.config-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.refresh-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.refresh-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

/* Sensor Badge */
.sensor-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  animation: pulse 2s ease-in-out infinite;
}

.form-input.sensor-active {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #10b981;
  font-weight: 600;
  color: #065f46;
}

/* Responsive adjustments for sensor UI */
@media (max-width: 768px) {
  .mode-toggle-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .mode-toggle-btn {
    width: 100%;
    justify-content: center;
  }

  .sensor-status-card {
    grid-template-columns: 1fr;
  }
}


/* Patient Selection Card */
.patient-selection-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.selection-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
}

.selection-icon {
  width: 1.5rem !important;
  height: 1.5rem !important;
  min-width: 1.5rem;
  min-height: 1.5rem;
  max-width: 1.5rem;
  max-height: 1.5rem;
  color: #42b983;
  flex-shrink: 0;
  display: block;
}

.selection-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.selection-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Search Box */
.search-box {
  position: relative;
  margin-bottom: 1.25rem;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.125rem !important;
  height: 1.125rem !important;
  min-width: 1.125rem;
  min-height: 1.125rem;
  max-width: 1.125rem;
  max-height: 1.125rem;
  color: #9ca3af;
  display: block;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

/* Patient List */
.patient-list {
  max-height: 360px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.patient-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.patient-item > * {
  flex-shrink: 0;
}

.patient-item:last-child {
  border-bottom: none;
}

.patient-item:hover {
  background: #f7fafc;
}

.patient-item-icon {
  width: 1.75rem !important;
  height: 1.75rem !important;
  min-width: 1.75rem;
  min-height: 1.75rem;
  max-width: 1.75rem;
  max-height: 1.75rem;
  color: #42b983;
  flex-shrink: 0;
  display: block;
}

.patient-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.patient-item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
}

.patient-item-details {
  font-size: 0.875rem;
  color: #6b7280;
}

.patient-item .patient-item-arrow,
.patient-item-arrow {
  width: 1.25rem !important;
  height: 1.25rem !important;
  min-width: 1.25rem !important;
  min-height: 1.25rem !important;
  max-width: 1.25rem !important;
  max-height: 1.25rem !important;
  color: #cbd5e0;
  transition: all 0.2s ease;
  display: block !important;
  flex-shrink: 0;
}

.patient-item svg {
  width: 1.25rem !important;
  height: 1.25rem !important;
}

.patient-item:hover .patient-item-arrow {
  color: #42b983;
  transform: translateX(4px);
}

/* Empty State Small */
.empty-state-small {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
  font-size: 0.95rem;
}

/* Selected Patient Banner */
.selected-patient-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.selected-patient-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.selected-patient-icon {
  width: 2rem !important;
  height: 2rem !important;
  min-width: 2rem;
  min-height: 2rem;
  max-width: 2rem;
  max-height: 2rem;
  color: #065f46;
  flex-shrink: 0;
  display: block;
}

.selected-patient-name {
  font-size: 1rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.25rem;
}

.selected-patient-details {
  font-size: 0.875rem;
  color: #047857;
}

.change-patient-btn {
  padding: 0.75rem 1.25rem;
  background: white;
  color: #065f46;
  border: 2px solid #10b981;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.change-patient-btn:hover {
  background: #f0fdf4;
  transform: translateY(-2px);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 2.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.875rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive adjustments for patient selection */
@media (max-width: 768px) {
  .patient-selection-card {
    padding: 2rem 1.5rem;
  }

  .selection-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .selection-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .selection-title {
    font-size: 1.5rem;
  }

  .patient-list {
    max-height: 300px;
  }

  .patient-item {
    padding: 1rem;
  }

  .patient-item-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .selected-patient-banner {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .change-patient-btn {
    width: 100%;
    justify-content: center;
  }
}
