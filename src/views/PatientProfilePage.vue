<template>
  <div class="profile-page">
    <!-- Navigation Bar -->
    <nav class="page-nav">
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

    <!-- Main Content -->
    <div class="page-container">
      <div class="content-wrapper">
        <!-- Header -->
        <div class="page-header">
          <div class="header-icon-wrapper">
            <UserIcon class="header-icon" />
          </div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-subtitle">Manage your personal information and account settings</p>
        </div>

        <!-- Profile Card -->
        <div class="profile-card">
          <form @submit.prevent="saveProfile" class="profile-form">
            <div class="form-section">
              <h3 class="section-title">Personal Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name" class="form-label">
                    <UserIcon class="label-icon" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    v-model="profile.name"
                    type="text"
                    placeholder="Enter your full name"
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
                    v-model.number="profile.age"
                    type="number"
                    placeholder="Enter age"
                    required
                    min="1"
                    max="150"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="gender" class="form-label">
                    <UserCircleIcon class="label-icon" />
                    Gender
                  </label>
                  <select id="gender" v-model="profile.gender" required class="form-select">
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
                    v-model="profile.contact"
                    type="tel"
                    placeholder="Enter your contact number"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Account Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="email" class="form-label">
                    <EnvelopeIcon class="label-icon" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    v-model="profile.email"
                    type="email"
                    disabled
                    class="form-input disabled"
                  />
                  <p class="field-hint">Email cannot be changed</p>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    <CalendarIcon class="label-icon" />
                    Member Since
                  </label>
                  <input
                    v-model="memberSince"
                    type="text"
                    disabled
                    class="form-input disabled"
                  />
                </div>
              </div>
            </div>

            <div v-if="error" class="error-message">
              <ExclamationCircleIcon class="error-icon" />
              <span>{{ error }}</span>
            </div>

            <div v-if="successMessage" class="success-message">
              <CheckCircleIcon class="success-icon" />
              <span>{{ successMessage }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">Save Changes</span>
              <span v-else>Saving...</span>
              <ArrowRightIcon v-if="!loading" class="btn-arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  UserCircleIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const profile = ref({
  email: '',
  name: '',
  age: null,
  gender: '',
  contact: '',
  createdAt: null
})

onMounted(async () => {
  // Check if patient is logged in
  const patientId = sessionStorage.getItem('patientId')
  if (!patientId) {
    router.push('/patient-login')
    return
  }

  await loadProfile()
})

const loadProfile = async () => {
  try {
    const patientId = sessionStorage.getItem('patientId')
    if (!patientId) return

    const profileDoc = await getDoc(doc(db, 'patientAccounts', patientId))
    if (profileDoc.exists()) {
      const data = profileDoc.data()
      profile.value = {
        email: data.email || '',
        name: data.name || '',
        age: data.age || null,
        gender: data.gender || '',
        contact: data.contact || '',
        createdAt: data.createdAt
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = 'Failed to load profile. Please try again.'
  }
}

const memberSince = computed(() => {
  if (!profile.value.createdAt) return 'N/A'
  const date = profile.value.createdAt.toDate ? profile.value.createdAt.toDate() : new Date(profile.value.createdAt)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

const saveProfile = async () => {
  error.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const patientId = sessionStorage.getItem('patientId')
    if (!patientId) throw new Error('Not authenticated')

    // Update profile in Firestore
    await updateDoc(doc(db, 'patientAccounts', patientId), {
      name: profile.value.name,
      age: profile.value.age,
      gender: profile.value.gender,
      contact: profile.value.contact,
      updatedAt: new Date()
    })

    // Update session storage
    sessionStorage.setItem('patientName', profile.value.name)

    successMessage.value = 'Profile updated successfully!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Failed to update profile. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-page {
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

/* Profile Card */
.profile-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
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

.form-input.disabled {
  background: #edf2f7;
  color: #a0aec0;
  cursor: not-allowed;
}

.form-input::placeholder {
  color: #a0aec0;
}

.form-select {
  cursor: pointer;
}

.field-hint {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.success-message {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.error-icon,
.success-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
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

/* Responsive Design */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .page-container {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .profile-card {
    padding: 2rem 1.5rem;
  }

  .form-row.two-cols {
    grid-template-columns: 1fr;
  }
}
</style>
