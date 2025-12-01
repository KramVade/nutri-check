<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="nav-bar">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-icon">
            <HeartIcon class="icon" />
          </div>
          <span class="logo-text">Nutri-Check</span>
        </div>
        <div class="nav-login-buttons">
          <button @click="$router.push('/patient-login')" class="nav-login-btn primary">
            Patient Login
          </button>
          <button @click="$router.push('/login')" class="nav-login-btn secondary">
            Staff
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Your Health, Simplified</h1>
          <p class="hero-subtitle">
            Track your BMI, monitor your wellness journey, and get personalized health insights. For patients and healthcare professionals.
          </p>
          <div class="cta-buttons">
            <button @click="$router.push('/patient-login')" class="cta-button primary">
              Patient Portal
              <ArrowRightIcon class="arrow-icon" />
            </button>
            <button @click="$router.push('/login')" class="cta-button secondary">
              Medical Staff Login
              <ArrowRightIcon class="arrow-icon" />
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="dashboard-illustration">
            <div class="bmi-meter">
              <div class="meter-arc"></div>
              <div class="meter-needle"></div>
              <div class="meter-label">BMI</div>
            </div>
            <div class="health-cards">
              <div class="mini-card card-1">
                <HeartIcon class="card-icon healthy" />
                <div class="card-text">Healthy</div>
              </div>
              <div class="mini-card card-2">
                <ChartBarIcon class="card-icon" />
                <div class="card-text">Track</div>
              </div>
              <div class="mini-card card-3">
                <CheckBadgeIcon class="card-icon" />
                <div class="card-text">Goals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <h2 class="section-title">Why Choose Nutri-Check?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <BoltIcon class="feature-icon" />
            </div>
            <h3 class="feature-title">Fast BMI Calculation</h3>
            <p class="feature-description">
              Get instant BMI results with our accurate calculator. Simple input, immediate insights.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <LightBulbIcon class="feature-icon" />
            </div>
            <h3 class="feature-title">Personalized Health Suggestions</h3>
            <p class="feature-description">
              Receive tailored health recommendations based on your BMI category and health profile.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <CpuChipIcon class="feature-icon" />
            </div>
            <h3 class="feature-title">Arduino Integration Ready</h3>
            <p class="feature-description">
              Connect with Arduino devices for automated height and weight measurements.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-container">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Enter Patient Data</h3>
              <p class="step-description">Input basic information or scan automatically with connected devices</p>
            </div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Get BMI Instantly</h3>
              <p class="step-description">Receive accurate BMI calculation and health category classification</p>
            </div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Receive Actionable Advice</h3>
              <p class="step-description">Get personalized health suggestions and track progress over time</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="section-container">
        <div class="about-content">
          <h2 class="section-title">About Nutri-Check</h2>
          <p class="about-text">
            Nutri-Check is designed to simplify patient health assessments for clinics, schools, and community health centers. 
            Our mission is to empower healthcare providers with efficient tools for BMI tracking, patient management, and data-driven care.
          </p>
          <p class="about-text">
            With seamless patient record management, instant BMI calculations, and comprehensive health tracking, Nutri-Check helps 
            medical professionals deliver better care and improve patient outcomes.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Footer -->
    <section class="cta-footer">
      <div class="cta-container">
        <h2 class="cta-title">Ready to Get Started?</h2>
        <p class="cta-subtitle">Join thousands tracking their health with Nutri-Check</p>
        <div class="cta-footer-buttons">
          <button @click="$router.push('/patient-login')" class="cta-button-large primary">
            Patient Portal
          </button>
          <button @click="$router.push('/login')" class="cta-button-large secondary">
            Medical Staff
          </button>
        </div>
        <div class="footer-links">
          <a @click="$router.push('/login')" class="footer-link">Login</a>
          <span class="separator">•</span>
          <a href="#features" class="footer-link">Features</a>
          <span class="separator">•</span>
          <a href="#how-it-works" class="footer-link">How It Works</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <p class="footer-text">© 2024 Nutri-Check. Simplifying health, one calculation at a time.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  BoltIcon,
  LightBulbIcon,
  CpuChipIcon
} from '@heroicons/vue/24/solid'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2d3748;
  background: #ffffff;
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

.nav-login-buttons {
  display: flex;
  gap: 0.75rem;
}

.nav-login-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-login-btn.primary {
  background: #42b983;
  color: white;
  border: none;
}

.nav-login-btn.primary:hover {
  background: #369e73;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.nav-login-btn.secondary {
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.nav-login-btn.secondary:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

/* Hero Section */
.hero-section {
  padding: 8rem 2rem 6rem;
  background: 
    linear-gradient(135deg, rgba(240, 253, 244, 0.75) 0%, rgba(255, 255, 255, 0.85) 100%),
    url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop') center/cover;
  position: relative;
  background-attachment: fixed;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.15) 0%, rgba(54, 158, 115, 0.1) 100%);
  pointer-events: none;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1a202c;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #2d3748;
  margin-bottom: 2.5rem;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.8);
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #369e73 0%, #2d8a5f 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(66, 185, 131, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.9);
}

.cta-button.secondary {
  background: white;
  color: #42b983;
  border: 2px solid #42b983;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.2);
}

.cta-button.secondary:hover {
  background: #42b983;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.4);
}

.arrow-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(5px);
}

/* Hero Illustration */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 1s ease-out;
}

.dashboard-illustration {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 400px;
}

.bmi-meter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12), 0 0 0 6px rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.meter-arc {
  position: absolute;
  top: 20%;
  width: 180px;
  height: 90px;
  border: 15px solid #e2e8f0;
  border-bottom: none;
  border-radius: 180px 180px 0 0;
}

.meter-arc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  border: 15px solid #42b983;
  border-bottom: none;
  border-right: none;
  border-radius: 180px 0 0 0;
}

.meter-needle {
  position: absolute;
  top: 45%;
  width: 4px;
  height: 80px;
  background: #2d3748;
  border-radius: 2px;
  transform-origin: bottom center;
  transform: rotate(-30deg);
  animation: needleSwing 3s ease-in-out infinite;
}

.meter-label {
  position: absolute;
  bottom: 30%;
  font-size: 1.5rem;
  font-weight: 700;
  color: #42b983;
}

.health-cards {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mini-card {
  position: absolute;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(66, 185, 131, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: float 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
}

.card-1 {
  top: 10%;
  right: 0;
  animation-delay: 0s;
}

.card-2 {
  bottom: 20%;
  left: 0;
  animation-delay: 1s;
}

.card-3 {
  top: 50%;
  right: -10%;
  animation-delay: 2s;
}

.card-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #42b983;
}

.card-icon.healthy {
  color: #10b981;
}

.card-text {
  font-weight: 600;
  color: #2d3748;
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background: white;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: #1a202c;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f7fafc;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(66, 185, 131, 0.15);
  border-color: #42b983;
}

.feature-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.3);
}

.feature-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.feature-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
}

/* How It Works Section */
.how-it-works-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.step {
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.step-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #4a5568;
}

.step-arrow {
  font-size: 2rem;
  color: #42b983;
  font-weight: 700;
}

/* About Section */
.about-section {
  padding: 6rem 2rem;
  background: white;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 1.5rem;
}

/* CTA Footer */
.cta-footer {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  text-align: center;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.cta-footer-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button-large {
  padding: 1.25rem 3rem;
  border: none;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button-large.primary {
  background: white;
  color: #42b983;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.cta-button-large.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

.cta-button-large.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cta-button-large.secondary:hover {
  background: white;
  color: #42b983;
  transform: translateY(-3px);
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
}

.footer-links {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.footer-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.separator {
  opacity: 0.6;
}

/* Footer */
.footer {
  padding: 2rem;
  background: #1a202c;
  color: #a0aec0;
  text-align: center;
}

.footer-text {
  font-size: 0.95rem;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes needleSwing {
  0%, 100% {
    transform: rotate(-30deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps-container {
    flex-direction: column;
  }

  .step-arrow {
    transform: rotate(90deg);
  }

  .cta-title {
    font-size: 2rem;
  }

  .dashboard-illustration {
    max-width: 300px;
    height: 300px;
  }

  .bmi-meter {
    width: 200px;
    height: 200px;
  }
}
</style>
