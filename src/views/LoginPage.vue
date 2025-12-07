<template>
  <div class="login-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">
            <img src="/logo.png" alt="Nutri-Check Logo" class="icon" />
          </div>
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
              <HeartIcon class="brand-icon" />
            </div>
            <h2 class="brand-title">Medical Professional Portal</h2>
            <p class="brand-subtitle">
              Secure access for healthcare providers. Manage patient records, track BMI data, and deliver quality care.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Manage patient records</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Track health metrics</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Secure cloud storage</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="login-form-wrapper">
            <div class="form-header">
              <h1 class="form-title">{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</h1>
              <p class="form-subtitle">
                {{ isSignUp ? 'Register as a medical professional to get started' : 'Sign in to access patient records and manage health data' }}
              </p>
            </div>

            <form @submit.prevent="isSignUp ? handleSignUp : handleLogin" class="login-form">
              <div v-if="isSignUp" class="form-group">
                <label for="name" class="form-label">
                  <UserIcon class="label-icon" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  v-model="fullName"
                  placeholder="Dr. John Smith"
                  required
                  class="form-input"
                />
              </div>

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
                  :placeholder="isSignUp ? 'Create a password (min. 6 characters)' : 'Enter your password'"
                  required
                  class="form-input"
                  :minlength="6"
                />
              </div>

              <div v-if="isSignUp" class="form-group">
                <label for="confirmPassword" class="form-label">
                  <LockClosedIcon class="label-icon" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Re-enter your password"
                  required
                  class="form-input"
                  :minlength="6"
                />
              </div>

              <div v-if="error" class="error-message">
                <ExclamationCircleIcon class="error-icon" />
                <span>{{ error }}</span>
              </div>

              <button 
                type="submit" 
                class="submit-btn" 
                :disabled="loading"
                @click="testButtonClick"
              >
                <span v-if="!loading">{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
                <span v-else>{{ isSignUp ? 'Creating account...' : 'Signing in...' }}</span>
                <ArrowRightIcon v-if="!loading" class="btn-arrow" />
              </button>

              <div class="toggle-mode">
                <p class="toggle-text">
                  {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
                  <button type="button" @click="toggleMode" class="toggle-btn">
                    {{ isSignUp ? 'Sign In' : 'Sign Up' }}
                  </button>
                </p>
              </div>
            </form>

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
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon
} from '@heroicons/vue/24/solid'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const error = ref('')
const loading = ref(false)
const isSignUp = ref(false)
const router = useRouter()

const toggleMode = () => {
  console.log('Toggle mode clicked, current isSignUp:', isSignUp.value)
  isSignUp.value = !isSignUp.value
  console.log('New isSignUp value:', isSignUp.value)
  error.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  fullName.value = ''
}

const testButtonClick = (e) => {
  console.log('🔵 BUTTON CLICKED!')
  console.log('isSignUp:', isSignUp.value)
  console.log('Form values:', {
    fullName: fullName.value,
    email: email.value,
    password: password.value ? 'has value' : 'empty',
    confirmPassword: confirmPassword.value ? 'has value' : 'empty'
  })
  
  // Prevent default and call the appropriate handler
  e.preventDefault()
  if (isSignUp.value) {
    handleSignUp()
  } else {
    handleLogin()
  }
}

const handleSignUp = async () => {
  console.log('=== SIGN UP STARTED ===')
  error.value = ''
  
  console.log('Form values:', {
    fullName: fullName.value,
    email: email.value,
    passwordLength: password.value.length,
    confirmPasswordLength: confirmPassword.value.length
  })
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    console.log('❌ Passwords do not match')
    error.value = 'Passwords do not match.'
    return
  }
  console.log('✓ Passwords match')
  
  // Validate password length
  if (password.value.length < 6) {
    console.log('❌ Password too short:', password.value.length)
    error.value = 'Password must be at least 6 characters long.'
    return
  }
  console.log('✓ Password length valid')
  
  loading.value = true
  console.log('Loading set to true')
  
  try {
    // Check if email already exists
    console.log('Checking if email exists:', email.value)
    const q = query(collection(db, 'medstaff'), where('email', '==', email.value))
    const querySnapshot = await getDocs(q)
    console.log('Query result - docs found:', querySnapshot.size)
    
    if (!querySnapshot.empty) {
      console.log('❌ Email already exists')
      error.value = 'This email is already registered. Please sign in instead.'
      return
    }
    console.log('✓ Email is available')
    
    // Create new medical staff account in Firestore
    console.log('Creating new document in medstaff collection...')
    const docRef = await addDoc(collection(db, 'medstaff'), {
      name: fullName.value,
      email: email.value,
      password: password.value, // In production, hash this!
      role: 'medical_staff',
      createdAt: new Date().toISOString()
    })
    console.log('✓ Document created with ID:', docRef.id)
    
    // Store staff ID in session
    sessionStorage.setItem('medStaffId', docRef.id)
    sessionStorage.setItem('medStaffName', fullName.value)
    console.log('✓ Session storage set:', {
      medStaffId: docRef.id,
      medStaffName: fullName.value
    })
    
    console.log('✓ Redirecting to dashboard...')
    router.push('/dashboard')
    console.log('=== SIGN UP COMPLETED SUCCESSFULLY ===')
  } catch (err) {
    console.error('❌ Sign up error:', err)
    console.error('Error code:', err.code)
    console.error('Error message:', err.message)
    error.value = `Registration failed: ${err.message}`
  } finally {
    loading.value = false
    console.log('Loading set to false')
  }
}

const handleLogin = async () => {
  console.log('=== LOGIN STARTED ===')
  error.value = ''
  loading.value = true
  
  console.log('Login attempt with email:', email.value)
  
  try {
    // Query Firestore for medical staff with matching email
    console.log('Querying medstaff collection...')
    const q = query(collection(db, 'medstaff'), where('email', '==', email.value))
    const querySnapshot = await getDocs(q)
    console.log('Query result - docs found:', querySnapshot.size)
    
    if (querySnapshot.empty) {
      console.log('❌ No account found with this email')
      error.value = 'Account not found. Please sign up first.'
      return
    }
    console.log('✓ Account found')
    
    // Check password
    const staffDoc = querySnapshot.docs[0]
    const staffData = staffDoc.data()
    console.log('Staff data:', {
      id: staffDoc.id,
      name: staffData.name,
      email: staffData.email,
      role: staffData.role
    })
    
    if (staffData.password !== password.value) {
      console.log('❌ Password mismatch')
      error.value = 'Incorrect password. Please try again.'
      return
    }
    console.log('✓ Password correct')
    
    // Store staff ID in session
    sessionStorage.setItem('medStaffId', staffDoc.id)
    sessionStorage.setItem('medStaffName', staffData.name)
    console.log('✓ Session storage set:', {
      medStaffId: staffDoc.id,
      medStaffName: staffData.name
    })
    
    console.log('✓ Redirecting to dashboard...')
    router.push('/dashboard')
    console.log('=== LOGIN COMPLETED SUCCESSFULLY ===')
  } catch (err) {
    console.error('❌ Login error:', err)
    console.error('Error code:', err.code)
    console.error('Error message:', err.message)
    error.value = `Login failed: ${err.message}`
  } finally {
    loading.value = false
    console.log('Loading set to false')
  }
}


</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

/* Navigation */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 1000;
  padding: 1rem 0;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-icon .icon {
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

.logo-icon .icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
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
  width: 1.25rem;
  height: 1.25rem;
}

/* Login Section */
.login-section {
  padding: 6rem 2rem 4rem;
  min-height: 100vh;
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

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
  background: #f7fafc;
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

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  color: #a0aec0;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
}

/* Google Sign In Button */
.google-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #2d3748;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.google-btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.info-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
}

.info-text {
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
}

.info-text strong {
  font-weight: 600;
  color: #1e3a8a;
}

/* Toggle Mode */
.toggle-mode {
  margin-top: 1.5rem;
  text-align: center;
}

.toggle-text {
  font-size: 0.95rem;
  color: #4a5568;
}

.toggle-btn {
  background: none;
  border: none;
  color: #42b983;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  transition: color 0.3s ease;
}

.toggle-btn:hover {
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
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 1rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .logo-icon .icon {
    height: 3rem;
    width: auto;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .login-section {
    padding: 5rem 1rem 2rem;
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
