<template>
  <div class="login-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">
            <HeartIcon class="icon" />
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
            <h2 class="brand-title">Welcome to Nutri-Check</h2>
            <p class="brand-subtitle">
              Your health journey starts here. Track BMI, monitor wellness, and receive personalized health insights.
            </p>
            <div class="features-list">
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Instant BMI calculations</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Personalized health tips</span>
              </div>
              <div class="feature-item">
                <CheckCircleIcon class="check-icon" />
                <span>Secure data management</span>
              </div>
            </div>
          </div>

          <!-- Right Side - Form -->
          <div class="login-form-wrapper">
            <div class="form-header">
              <h1 class="form-title">{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</h1>
              <p class="form-subtitle">
                {{ isSignUp ? 'Sign up to get started with Nutri-Check' : 'Sign in to continue to your account' }}
              </p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
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

              <div v-if="error" class="error-message">
                <ExclamationCircleIcon class="error-icon" />
                <span>{{ error }}</span>
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
                <span v-else>Processing...</span>
                <ArrowRightIcon v-if="!loading" class="btn-arrow" />
              </button>
            </form>

            <!-- Divider -->
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">or</span>
              <span class="divider-line"></span>
            </div>

            <!-- Google Sign In -->
            <button @click="handleGoogleSignIn" class="google-btn" :disabled="loading">
              <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

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
import { auth } from '../firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth'
import {
  HeartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/solid'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const isSignUp = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    if (isSignUp.value) {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    } else {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    }
    router.push('/dashboard')
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already registered. Please sign in instead.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password should be at least 6 characters.'
    } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      error.value = 'Invalid email or password.'
    } else if (err.code === 'auth/invalid-credential') {
      error.value = 'Invalid email or password.'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/dashboard')
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = 'Sign-in popup was closed. Please try again.'
    } else if (err.code === 'auth/cancelled-popup-request') {
      error.value = 'Sign-in was cancelled.'
    } else {
      error.value = err.message
    }
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
  width: 2rem;
  height: 2rem;
  color: #42b983;
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
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 1rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .logo-icon .icon {
    width: 1.5rem;
    height: 1.5rem;
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
