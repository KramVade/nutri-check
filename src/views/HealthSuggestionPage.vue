<template>
  <div class="health-suggestion-page">
    <!-- Navigation Bar -->
    <nav class="suggestion-nav">
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
    <div class="suggestion-container">
      <header class="page-header">
        <h1 class="page-title">Health Suggestions</h1>
        <p class="page-subtitle">View personalized health recommendations based on BMI categories</p>
      </header>

      <!-- Patient Selection -->
      <div class="patient-selection">
        <label class="selection-label">Select a patient to view suggestions:</label>
        <select v-model="selectedPatientId" @change="loadPatientData" class="patient-select">
          <option value="">-- Choose a patient --</option>
          <option v-for="patient in patients" :key="patient.id" :value="patient.id">
            {{ patient.name }} - BMI: {{ patient.bmi ? patient.bmi.toFixed(1) : 'N/A' }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading patient data...</p>
      </div>

      <!-- No Patient Selected -->
      <div v-else-if="!selectedPatient" class="empty-state">
        <UserCircleIcon class="empty-icon" />
        <h3>No Patient Selected</h3>
        <p>Please select a patient from the dropdown above to view their health suggestions</p>
      </div>

      <!-- Patient Info & Suggestions -->
      <div v-else class="suggestion-content">
        <!-- Patient Info Card -->
        <div class="patient-info-card">
          <div class="info-header">
            <UserCircleIcon class="patient-icon" />
            <div>
              <h3 class="patient-name">{{ selectedPatient.name }}</h3>
              <p class="patient-details">{{ selectedPatient.age }} years • {{ selectedPatient.gender }}</p>
            </div>
          </div>
          <div class="bmi-display">
            <div class="bmi-value-section">
              <span class="bmi-label">BMI</span>
              <span class="bmi-value">{{ selectedPatient.bmi ? selectedPatient.bmi.toFixed(1) : 'N/A' }}</span>
            </div>
            <span :class="['bmi-category', getCategoryClass(selectedPatient.category)]">
              {{ selectedPatient.category || 'N/A' }}
            </span>
          </div>
        </div>

        <!-- Health Suggestions -->
        <div class="suggestions-section">
          <h2 class="section-title">
            <LightBulbIcon class="title-icon" />
            Personalized Health Recommendations
          </h2>

          <!-- Send Button -->
          <div class="send-section">
            <button @click="sendRecommendations" class="send-btn">
              <PaperAirplaneIcon class="btn-icon" />
              Send Recommendations to Patient
            </button>
          </div>

          <!-- Suggestions based on BMI Category -->
          <div v-if="selectedPatient.category === 'Underweight'" class="suggestion-card underweight">
            <h3 class="suggestion-title">Underweight Recommendations</h3>
            <div class="suggestion-content-text">
              <h4>Dietary Suggestions:</h4>
              <ul>
                <li>Increase calorie intake with nutrient-dense foods</li>
                <li>Eat more frequently (5-6 small meals per day)</li>
                <li>Include healthy fats: nuts, avocados, olive oil</li>
                <li>Add protein-rich foods: lean meats, fish, eggs, legumes</li>
                <li>Drink smoothies and shakes with added calories</li>
              </ul>
              
              <h4>Lifestyle Recommendations:</h4>
              <ul>
                <li>Strength training to build muscle mass</li>
                <li>Avoid skipping meals</li>
                <li>Get adequate sleep (7-9 hours)</li>
                <li>Manage stress levels</li>
                <li>Consult with a nutritionist for personalized meal plans</li>
              </ul>
            </div>
          </div>

          <div v-else-if="selectedPatient.category === 'Normal weight'" class="suggestion-card normal">
            <h3 class="suggestion-title">Healthy Weight Maintenance</h3>
            <div class="suggestion-content-text">
              <h4>Dietary Suggestions:</h4>
              <ul>
                <li>Maintain balanced diet with variety of foods</li>
                <li>Include fruits and vegetables (5+ servings daily)</li>
                <li>Choose whole grains over refined grains</li>
                <li>Moderate portions of lean proteins</li>
                <li>Stay hydrated (8 glasses of water daily)</li>
              </ul>
              
              <h4>Lifestyle Recommendations:</h4>
              <ul>
                <li>Regular physical activity (150 minutes/week)</li>
                <li>Mix cardio and strength training exercises</li>
                <li>Maintain consistent sleep schedule</li>
                <li>Regular health check-ups</li>
                <li>Practice stress management techniques</li>
              </ul>
            </div>
          </div>

          <div v-else-if="selectedPatient.category === 'Overweight'" class="suggestion-card overweight">
            <h3 class="suggestion-title">Overweight Management</h3>
            <div class="suggestion-content-text">
              <h4>Dietary Suggestions:</h4>
              <ul>
                <li>Reduce calorie intake by 500-750 calories/day</li>
                <li>Increase vegetable and fruit consumption</li>
                <li>Choose lean proteins and low-fat dairy</li>
                <li>Limit processed foods and added sugars</li>
                <li>Control portion sizes</li>
                <li>Avoid sugary drinks and excessive alcohol</li>
              </ul>
              
              <h4>Lifestyle Recommendations:</h4>
              <ul>
                <li>Aim for 200-300 minutes of moderate exercise weekly</li>
                <li>Include both cardio and resistance training</li>
                <li>Track food intake and physical activity</li>
                <li>Set realistic weight loss goals (1-2 lbs/week)</li>
                <li>Consider working with a dietitian</li>
              </ul>
            </div>
          </div>

          <div v-else-if="selectedPatient.category === 'Obese'" class="suggestion-card obese">
            <h3 class="suggestion-title">Obesity Management Plan</h3>
            <div class="suggestion-content-text">
              <h4>Dietary Suggestions:</h4>
              <ul>
                <li>Consult with healthcare provider for personalized plan</li>
                <li>Focus on whole, unprocessed foods</li>
                <li>Significantly reduce sugar and refined carbs</li>
                <li>Increase fiber intake (vegetables, whole grains)</li>
                <li>Practice mindful eating and portion control</li>
                <li>Consider meal planning and preparation</li>
              </ul>
              
              <h4>Lifestyle Recommendations:</h4>
              <ul>
                <li>Start with low-impact exercises (walking, swimming)</li>
                <li>Gradually increase activity duration and intensity</li>
                <li>Work with healthcare team (doctor, dietitian, trainer)</li>
                <li>Address underlying health conditions</li>
                <li>Consider behavioral therapy or support groups</li>
                <li>Monitor progress with regular check-ins</li>
              </ul>
              
              <div class="warning-note">
                <ExclamationTriangleIcon class="warning-icon" />
                <p><strong>Important:</strong> Medical supervision is recommended for comprehensive weight management.</p>
              </div>
            </div>
          </div>

          <div v-else class="suggestion-card default">
            <h3 class="suggestion-title">General Health Recommendations</h3>
            <div class="suggestion-content-text">
              <p>BMI data is not available for this patient. Please calculate BMI first to receive personalized health suggestions.</p>
              <button @click="goToBMICalculator" class="action-btn">
                <CalculatorIcon class="btn-icon" />
                Calculate BMI
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Resources -->
        <div class="resources-section">
          <h3 class="resources-title">Additional Resources</h3>
          <div class="resources-grid">
            <div class="resource-card">
              <HeartIcon class="resource-icon" />
              <h4>Nutrition Guide</h4>
              <p>Comprehensive dietary guidelines and meal planning tips</p>
            </div>
            <div class="resource-card">
              <FireIcon class="resource-icon" />
              <h4>Exercise Plans</h4>
              <p>Customized workout routines for different fitness levels</p>
            </div>
            <div class="resource-card">
              <ClipboardDocumentCheckIcon class="resource-icon" />
              <h4>Progress Tracking</h4>
              <p>Monitor patient progress and adjust recommendations</p>
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
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore'
import {
  ArrowLeftIcon,
  UserCircleIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CalculatorIcon,
  HeartIcon,
  FireIcon,
  ClipboardDocumentCheckIcon,
  PaperAirplaneIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const loading = ref(true)
const patients = ref([])
const selectedPatientId = ref('')
const selectedPatient = ref(null)

onMounted(async () => {
  await fetchPatients()
})

const fetchPatients = async () => {
  loading.value = true
  try {
    const querySnapshot = await getDocs(collection(db, 'patientAccounts'))
    patients.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    patients.value.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const loadPatientData = () => {
  if (selectedPatientId.value) {
    selectedPatient.value = patients.value.find(p => p.id === selectedPatientId.value)
  } else {
    selectedPatient.value = null
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

const goToBMICalculator = () => {
  if (selectedPatient.value) {
    localStorage.setItem('patientInfo', JSON.stringify(selectedPatient.value))
    router.push('/bmi-calculator')
  }
}

const sendRecommendations = async () => {
  if (!selectedPatient.value) {
    alert('Please select a patient first')
    return
  }

  if (!selectedPatient.value.category || selectedPatient.value.category === 'N/A') {
    alert('This patient does not have BMI data. Please calculate BMI first.')
    return
  }

  try {
    const medStaffName = sessionStorage.getItem('medStaffName') || 'Medical Staff'
    
    // Get recommendations based on category
    const recommendations = getRecommendationsText(selectedPatient.value.category)
    
    // Save to Firebase
    await addDoc(collection(db, 'healthRecommendations'), {
      patientId: selectedPatient.value.id,
      patientName: selectedPatient.value.name,
      category: selectedPatient.value.category,
      bmi: selectedPatient.value.bmi,
      recommendations: recommendations,
      sentBy: medStaffName,
      sentAt: new Date(),
      read: false
    })

    // Update patient document to indicate they have new recommendations
    const patientRef = doc(db, 'patientAccounts', selectedPatient.value.id)
    await updateDoc(patientRef, {
      hasNewRecommendations: true,
      lastRecommendationDate: new Date()
    })

    alert(`Health recommendations sent successfully to ${selectedPatient.value.name}!`)
  } catch (error) {
    console.error('Error sending recommendations:', error)
    alert('Failed to send recommendations. Please try again.')
  }
}

const getRecommendationsText = (category) => {
  const recommendations = {
    'Underweight': {
      dietary: [
        'Increase calorie intake with nutrient-dense foods',
        'Eat more frequently (5-6 small meals per day)',
        'Include healthy fats: nuts, avocados, olive oil',
        'Add protein-rich foods: lean meats, fish, eggs, legumes',
        'Drink smoothies and shakes with added calories'
      ],
      lifestyle: [
        'Strength training to build muscle mass',
        'Avoid skipping meals',
        'Get adequate sleep (7-9 hours)',
        'Manage stress levels',
        'Consult with a nutritionist for personalized meal plans'
      ]
    },
    'Normal weight': {
      dietary: [
        'Maintain balanced diet with variety of foods',
        'Include fruits and vegetables (5+ servings daily)',
        'Choose whole grains over refined grains',
        'Moderate portions of lean proteins',
        'Stay hydrated (8 glasses of water daily)'
      ],
      lifestyle: [
        'Regular physical activity (150 minutes/week)',
        'Mix cardio and strength training exercises',
        'Maintain consistent sleep schedule',
        'Regular health check-ups',
        'Practice stress management techniques'
      ]
    },
    'Overweight': {
      dietary: [
        'Reduce calorie intake by 500-750 calories/day',
        'Increase vegetable and fruit consumption',
        'Choose lean proteins and low-fat dairy',
        'Limit processed foods and added sugars',
        'Control portion sizes',
        'Avoid sugary drinks and excessive alcohol'
      ],
      lifestyle: [
        'Aim for 200-300 minutes of moderate exercise weekly',
        'Include both cardio and resistance training',
        'Track food intake and physical activity',
        'Set realistic weight loss goals (1-2 lbs/week)',
        'Consider working with a dietitian'
      ]
    },
    'Obese': {
      dietary: [
        'Consult with healthcare provider for personalized plan',
        'Focus on whole, unprocessed foods',
        'Significantly reduce sugar and refined carbs',
        'Increase fiber intake (vegetables, whole grains)',
        'Practice mindful eating and portion control',
        'Consider meal planning and preparation'
      ],
      lifestyle: [
        'Start with low-impact exercises (walking, swimming)',
        'Gradually increase activity duration and intensity',
        'Work with healthcare team (doctor, dietitian, trainer)',
        'Address underlying health conditions',
        'Consider behavioral therapy or support groups',
        'Monitor progress with regular check-ins'
      ]
    }
  }

  return recommendations[category] || { dietary: [], lifestyle: [] }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.health-suggestion-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: #f7fafc;
}

.suggestion-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  height: 4.5rem;
  width: auto;
  border-radius: 8px;
  padding: 0.4rem;
  background: white;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
  border: 2px solid #42b983;
  transition: all 0.3s ease;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.back-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: #42b983;
  border: 1px solid #42b983;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: #42b983;
  color: white;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.suggestion-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #4a5568;
}

.patient-selection {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.selection-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.patient-select {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
}

.patient-select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #cbd5e0;
  margin: 0 auto 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

.patient-info-card {
  background: white;
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.patient-icon {
  width: 3rem;
  height: 3rem;
  color: #42b983;
}

.patient-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.patient-details {
  font-size: 0.95rem;
  color: #6b7280;
}

.bmi-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: #f7fafc;
  border-radius: 8px;
}

.bmi-value-section {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.bmi-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.bmi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #42b983;
}

.bmi-category {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.bmi-category.healthy {
  background: #d1fae5;
  color: #065f46;
}

.bmi-category.warning {
  background: #fef3c7;
  color: #92400e;
}

.bmi-category.danger {
  background: #fee2e2;
  color: #991b1b;
}

.bmi-category.default {
  background: #e2e8f0;
  color: #4a5568;
}

.suggestions-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.send-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.send-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.4);
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}

.title-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #42b983;
}

.suggestion-card {
  padding: 1.75rem;
  border-radius: 10px;
  border-left: 4px solid;
}

.suggestion-card.underweight {
  background: #fef3c7;
  border-color: #f59e0b;
}

.suggestion-card.normal {
  background: #d1fae5;
  border-color: #10b981;
}

.suggestion-card.overweight {
  background: #fed7aa;
  border-color: #f97316;
}

.suggestion-card.obese {
  background: #fee2e2;
  border-color: #ef4444;
}

.suggestion-card.default {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.suggestion-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.25rem;
}

.suggestion-content-text h4 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3748;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}

.suggestion-content-text h4:first-child {
  margin-top: 0;
}

.suggestion-content-text ul {
  list-style-position: inside;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
}

.suggestion-content-text li {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.warning-note {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-note p {
  font-size: 0.95rem;
  color: #991b1b;
  line-height: 1.6;
}

.action-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
}

.resources-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.resources-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.resource-card {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.resource-card:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

.resource-icon {
  width: 2rem;
  height: 2rem;
  color: #42b983;
  margin-bottom: 0.75rem;
}

.resource-card h4 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.resource-card p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .suggestion-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
