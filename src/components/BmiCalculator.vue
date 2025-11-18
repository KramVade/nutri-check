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
            <CalculatorIcon class="header-icon" />
          </div>
          <h1 class="page-title">BMI Calculator</h1>
          <p class="page-subtitle">Calculate Body Mass Index and save health data</p>
          <p v-if="patient.name" class="patient-badge">
            <UserIcon class="badge-icon" />
            Patient: {{ patient.name }}
          </p>
        </div>

        <!-- Calculator Card -->
        <div class="calculator-card">
          <div class="input-section">
            <div class="form-row two-cols">
              <div class="form-group">
                <label for="weight" class="form-label">
                  <ScaleIcon class="label-icon" />
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  v-model.number="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  step="0.1"
                  min="0"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="height" class="form-label">
                  <ArrowsPointingOutIcon class="label-icon" />
                  Height (cm)
                </label>
                <input
                  id="height"
                  v-model.number="height"
                  type="number"
                  placeholder="Enter height in cm"
                  step="0.1"
                  min="0"
                  class="form-input"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalculatorIcon,
  UserIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
  UsersIcon,
  HomeIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const weight = ref(null)
const height = ref(null)
const bmi = ref(null)
const category = ref('')
const loading = ref(false)

const patient = JSON.parse(localStorage.getItem('patientInfo')) || {}

const calculateBMI = async () => {
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

    await addDoc(collection(db, 'patients'), {
      ...patient,
      weight: weight.value,
      height: height.value,
      bmi: bmi.value,
      category: category.value,
      userId: auth.currentUser?.uid,
      timestamp: new Date()
    })

    setTimeout(() => {
      alert('BMI data saved successfully!')
      loading.value = false
    }, 500)
  } catch (e) {
    alert('Failed to save BMI result: ' + e.message)
    loading.value = false
  }
}

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
  width: 1.125rem;
  height: 1.125rem;
}

/* Page Container */
.page-container {
  padding: 3rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.content-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.3);
}

.header-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.patient-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
}

.badge-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Calculator Card */
.calculator-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
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
