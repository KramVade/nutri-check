<template>
  <div class="patient-login-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/')">
          <img src="/logo.png" alt="Nutri-Check Logo" class="logo-icon" />
          <span class="logo-text">Nutri-Check</span>
        </div>
        <button @click="$router.push('/')" class="back-btn">
          <ArrowLeftIcon class="btn-icon" />
          Back to Home
        </button>
      </div>
    </nav>

    <!-- Login Section -->
    <section class="login-section">
      <div class="login-container">
        <div class="login-card">
          <!-- Left Side - Branding -->
          <div class="login-branding">
            <div class="brand-icon-wrapper">
              <UserCircleIcon class="brand-icon" />
            </div>
            <h2 class="brand-title">Patient Portal</h2>
            <p class="brand-subtitle">
              Your personal health dashboard. Track your BMI, monitor your wellness journey, and get personalized health insights.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Track your BMI progress</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>View your health history</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Get personalized health tips</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="login-form-wrapper">
            <div class="form-header">
              <h1 class="form-title">{{ isSignUp ? 'Create Your Account' : 'Welcome Back' }}</h1>
              <p class="form-subtitle">
                {{ isSignUp ? 'Register to start tracking your health' : 'Sign in to access your health dashboard' }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <EnvelopeIcon class="label-icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="you@example.com"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="password" class="form-label">
                  <LockClosedIcon class="label-icon" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                  class="form-input"
                  :minlength="6"
                />
              </div>

              <div v-if="isSignUp" class="signup-fields">
                <div class="form-group">
                  <label for="name" class="form-label">
                    <UserIcon class="label-icon" />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    v-model="name"
                    placeholder="Enter your full name"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-row two-cols">
                  <div class="form-group">
                    <label for="age" class="form-label">
                      <CalendarIcon class="label-icon" />
                      Age
                    </label>
                    <input
                      id="age"
                      type="number"
                      v-model.number="age"
                      placeholder="Age"
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
                    <select id="gender" v-model="gender" required class="form-select">
                      <option disabled value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="contact" class="form-label">
                    <PhoneIcon class="label-icon" />
                    Contact Number
                  </label>
                  <input
                    id="contact"
                    type="tel"
                    v-model="contact"
                    placeholder="Enter contact number"
                    class="form-input"
                  />
                </div>
              </div>

              <div v-if="error" class="error-message">
                <ExclamationCircleIcon class="error-icon" />
                <span>{{ error }}</span>
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
                <span v-else>{{ isSignUp ? 'Creating Account...' : 'Signing In...' }}</span>
                <ArrowRightIcon v-if="!loading" class="btn-arrow" />
              </button>
            </form>

            <div class="toggle-section">
              <p class="toggle-text">
                {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
                <a @click="toggleMode" class="toggle-link">
                  {{ isSignUp ? 'Sign In' : 'Sign Up' }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  UserCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CalendarIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const email = ref('')
const password = ref('')
const name = ref('')
const age = ref(null)
const gender = ref('')
const contact = ref('')
const error = ref('')
const loading = ref(false)
const isSignUp = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
  // Clear form
  if (!isSignUp.value) {
    name.value = ''
    age.value = null
    gender.value = ''
    contact.value = ''
  }
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (isSignUp.value) {
      await handleSignUp()
    } else {
      await handleSignIn()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Simple hash function (for demo - use bcrypt in production)
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const handleSignUp = async () => {
  // Check if email already exists
  const q = query(collection(db, 'patientAccounts'), where('email', '==', email.value.toLowerCase()))
  const querySnapshot = await getDocs(q)
  
  if (!querySnapshot.empty) {
    throw new Error('Email already registered. Please sign in instead.')
  }

  // Hash password
  const hashedPassword = await hashPassword(password.value)

  // Create patient account
  const patientData = {
    email: email.value.toLowerCase(),
    password: hashedPassword,
    name: name.value,
    age: age.value,
    gender: gender.value,
    contact: contact.value,
    createdAt: new Date(),
    lastLogin: new Date()
  }

  const docRef = await addDoc(collection(db, 'patientAccounts'), patientData)
  
  // Store patient ID in session
  sessionStorage.setItem('patientId', docRef.id)
  sessionStorage.setItem('patientName', name.value)
  sessionStorage.setItem('patientEmail', email.value)
  
  // Redirect to patient dashboard
  router.push('/patient-dashboard')
}

const handleSignIn = async () => {
  // Find patient by email
  const q = query(collection(db, 'patientAccounts'), where('email', '==', email.value.toLowerCase()))
  const querySnapshot = await getDocs(q)
  
  if (querySnapshot.empty) {
    throw new Error('Account not found. Please check your email or sign up.')
  }

  const patientDoc = querySnapshot.docs[0]
  const patientData = patientDoc.data()

  // Verify password
  const hashedPassword = await hashPassword(password.value)
  
  if (hashedPassword !== patientData.password) {
    throw new Error('Incorrect password. Please try again.')
  }

  // Store patient ID in session
  sessionStorage.setItem('patientId', patientDoc.id)
  sessionStorage.setItem('patientName', patientData.name)
  sessionStorage.setItem('patientEmail', patientData.email)
  
  // Redirect to patient dashboard
  router.push('/patient-dashboard')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.patient-login-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

/* Navigation */
.nav-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
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

/* Login Section */
.login-section {
  padding: 3rem 2rem;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

.login-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

/* Left Side - Branding */
.login-branding {
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  padding: 4rem 3rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.brand-icon {
  width: 3rem;
  height: 3rem;
  color: white;
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 2.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
}

.check-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

/* Right Side - Form */
.login-form-wrapper {
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  gap: 1rem;
}

.form-row.two-cols {
  grid-template-columns: 1fr 1fr;
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

.signup-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.95rem;
}

.error-icon {
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
  margin-top: 0.5rem;
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

.toggle-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.toggle-text {
  text-align: center;
  font-size: 0.95rem;
  color: #4a5568;
}

.toggle-link {
  color: #42b983;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.3s ease;
}

.toggle-link:hover {
  color: #369e73;
  text-decoration: underline;
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
@media (max-width: 968px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-branding {
    padding: 3rem 2rem;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .brand-subtitle {
    font-size: 1rem;
  }

  .login-form-wrapper {
    padding: 3rem 2rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-row.two-cols {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 1rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .logo-icon {
    height: 3rem;
    width: auto;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .login-section {
    padding: 2rem 1rem;
  }

  .login-branding {
    padding: 2rem 1.5rem;
  }

  .brand-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .brand-icon {
    width: 2rem;
    height: 2rem;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-subtitle {
    font-size: 0.95rem;
  }

  .login-form-wrapper {
    padding: 2rem 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }
}
</style>
