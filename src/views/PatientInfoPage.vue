<template>
  <div class="patient-info-page">
    <!-- Navigation Bar -->
    <nav class="page-nav">
      <div class="nav-content">
        <div class="logo" @click="$router.push('/dashboard')">
          <img src="/logo.png" alt="Nutri-Check Logo" class="logo-icon" />
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
            <UserPlusIcon class="header-icon" />
          </div>
          <h1 class="page-title">Patient Information</h1>
          <p class="page-subtitle">Enter patient details to create a new health record</p>
        </div>

        <!-- Form Card -->
        <div class="form-card">
          <form @submit.prevent="submitInfo" class="patient-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name" class="form-label">
                  <UserIcon class="label-icon" />
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  placeholder="Enter patient's full name"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row two-cols">
              <div class="form-group">
                <label for="age" class="form-label">
                  <CalendarIcon class="label-icon" />
                  Age
                </label>
                <input
                  id="age"
                  v-model.number="age"
                  type="number"
                  placeholder="Enter age"
                  required
                  min="0"
                  max="150"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="gender" class="form-label">
                  <UserCircleIcon class="label-icon" />
                  Gender
                </label>
                <select id="gender" v-model="gender" required class="form-select">
                  <option disabled value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="contact" class="form-label">
                  <PhoneIcon class="label-icon" />
                  Contact Number
                </label>
                <input
                  id="contact"
                  v-model="contact"
                  type="tel"
                  placeholder="Enter contact number"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">Save Patient Information</span>
              <span v-else>Saving...</span>
              <ArrowRightIcon v-if="!loading" class="btn-arrow" />
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-card">
            <CheckCircleIcon class="success-icon" />
            <div class="success-content">
              <h3 class="success-title">Patient Information Saved!</h3>
              <p class="success-text">{{ successMessage }}</p>
              <button @click="goToBMICalculator" class="bmi-btn">
                <CalculatorIcon class="btn-icon" />
                Calculate BMI Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserPlusIcon,
  UserIcon,
  UserCircleIcon,
  CalendarIcon,
  PhoneIcon,
  CheckCircleIcon,
  CalculatorIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const name = ref('')
const age = ref(null)
const gender = ref('')
const contact = ref('')
const successMessage = ref('')
const loading = ref(false)

const submitInfo = () => {
  loading.value = true
  
  setTimeout(() => {
    const patient = {
      name: name.value,
      age: age.value,
      gender: gender.value,
      contact: contact.value
    }
    localStorage.setItem('patientInfo', JSON.stringify(patient))
    successMessage.value = 'Ready to calculate BMI and complete the health record.'
    loading.value = false
  }, 500)
}

const goToBMICalculator = () => {
  router.push('/bmi-calculator')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.patient-info-page {
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
  max-width: 800px;
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
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.patient-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-row {
  display: grid;
  gap: 1.5rem;
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

.form-input,
.form-select {
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

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #42b983;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-select {
  cursor: pointer;
}

.submit-btn {
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
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-arrow {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

/* Success Card */
.success-card {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 16px;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  animation: slideIn 0.5s ease-out;
}

.success-icon {
  width: 3rem;
  height: 3rem;
  color: #059669;
  flex-shrink: 0;
}

.success-content {
  flex: 1;
}

.success-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
}

.success-text {
  font-size: 1rem;
  color: #047857;
  margin-bottom: 1.25rem;
}

.bmi-btn {
  padding: 0.75rem 1.5rem;
  background: #059669;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.bmi-btn:hover {
  background: #047857;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
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
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

  .page-subtitle {
    font-size: 1rem;
  }

  .form-card {
    padding: 2rem 1.5rem;
  }

  .form-row.two-cols {
    grid-template-columns: 1fr;
  }

  .success-card {
    flex-direction: column;
    text-align: center;
  }

  .success-icon {
    margin: 0 auto;
  }
}
</style>
