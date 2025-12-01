<template>
  <div class="patient-list-page">
    <!-- Navigation Bar -->
    <nav class="dashboard-nav">
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
    <div class="patient-list-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-text">
          <h1 class="page-title">All Patients</h1>
          <p class="page-subtitle">View and manage all registered patients</p>
        </div>
        <button @click="$router.push('/patient-info')" class="add-patient-btn">
          <UserPlusIcon class="btn-icon" />
          Add New Patient
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="search-section">
        <div class="search-box">
          <MagnifyingGlassIcon class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by name, email, or phone..."
            class="search-input"
          />
        </div>
        <div class="filter-box">
          <label>Filter by Category:</label>
          <select v-model="filterCategory" class="filter-select">
            <option value="">All Categories</option>
            <option value="Normal weight">Normal Weight</option>
            <option value="Underweight">Underweight</option>
            <option value="Overweight">Overweight</option>
            <option value="Obese">Obese</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading patients...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPatients.length === 0 && !searchQuery && !filterCategory" class="empty-state">
        <UsersIcon class="empty-icon" />
        <h3>No Patients Yet</h3>
        <p>Start by adding your first patient</p>
        <button @click="$router.push('/patient-info')" class="empty-action-btn">
          <UserPlusIcon class="btn-icon" />
          Add Patient
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredPatients.length === 0" class="empty-state">
        <MagnifyingGlassIcon class="empty-icon" />
        <h3>No Results Found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>

      <!-- Patients Table -->
      <div v-else class="patients-table-wrapper">
        <div class="results-count">
          Showing {{ filteredPatients.length }} of {{ patients.length }} patients
        </div>
        <table class="patients-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>BMI</th>
              <th>Category</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in filteredPatients" :key="patient.id" class="patient-row">
              <td class="patient-name">
                <UserCircleIcon class="patient-avatar" />
                <span>{{ patient.name }}</span>
              </td>
              <td>{{ patient.age }} years</td>
              <td>{{ patient.gender }}</td>
              <td class="contact-info">
                <div>{{ patient.email || 'N/A' }}</div>
                <div class="phone">{{ patient.phone || 'N/A' }}</div>
              </td>
              <td class="bmi-value">{{ patient.bmi ? patient.bmi.toFixed(1) : 'N/A' }}</td>
              <td>
                <span :class="['category-badge', getCategoryClass(patient.category)]">
                  {{ patient.category || 'N/A' }}
                </span>
              </td>
              <td>{{ formatDate(patient.timestamp) }}</td>
              <td>
                <button @click="$router.push(`/patients/${patient.id}`)" class="view-btn">
                  <EyeIcon class="btn-icon" />
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import {
  HeartIcon,
  ArrowLeftIcon,
  UserPlusIcon,
  UsersIcon,
  UserCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/solid'

const patients = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterCategory = ref('')

const fetchPatients = async () => {
  loading.value = true
  try {
    console.log('Fetching patients from patientAccounts collection...')
    const querySnapshot = await getDocs(collection(db, 'patientAccounts'))
    console.log('Found', querySnapshot.size, 'patient accounts')
    
    patients.value = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        age: data.age || 0,
        gender: data.gender || 'N/A',
        email: data.email || '',
        phone: data.phone || '',
        bmi: data.bmi || null,
        category: data.category || 'N/A',
        timestamp: data.createdAt || data.timestamp || new Date(),
        ...data
      }
    })
    
    // Sort by timestamp (most recent first)
    patients.value.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp)
      return dateB - dateA
    })
    
    console.log('Total patients loaded:', patients.value.length)
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

const filteredPatients = computed(() => {
  let result = patients.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.phone && p.phone.includes(query))
    )
  }

  // Filter by category
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }

  return result
})

const getCategoryClass = (category) => {
  const classes = {
    'Normal weight': 'healthy',
    'Underweight': 'warning',
    'Overweight': 'warning',
    'Obese': 'danger'
  }
  return classes[category] || 'default'
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

onMounted(fetchPatients)
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.patient-list-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
  background: #f7fafc;
}

/* Navigation */
.dashboard-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1400px;
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
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
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
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Main Container */
.patient-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
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

.add-patient-btn {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #42b983 0%, #369e73 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(66, 185, 131, 0.4);
}

.add-patient-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.5);
}

/* Search and Filter */
.search-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-box label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a5568;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #42b983;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem;
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem;
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
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
}

.empty-action-btn {
  padding: 0.875rem 1.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
}

/* Patients Table */
.patients-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.results-count {
  padding: 1rem 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.patient-row {
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s ease;
}

.patient-row:hover {
  background: #f7fafc;
}

td {
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: #2d3748;
}

.patient-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.patient-avatar {
  width: 2.5rem;
  height: 2.5rem;
  color: #42b983;
  flex-shrink: 0;
}

.contact-info {
  font-size: 0.875rem;
}

.contact-info .phone {
  color: #6b7280;
  margin-top: 0.25rem;
}

.bmi-value {
  font-weight: 600;
  color: #42b983;
  font-size: 1.125rem;
}

.category-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
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

.category-badge.default {
  background: #e2e8f0;
  color: #4a5568;
}

.view-btn {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.view-btn:hover {
  background: #369e73;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .patient-list-container {
    padding: 1.5rem;
  }

  .patients-table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-box {
    flex-direction: column;
    align-items: stretch;
  }

  .patients-table-wrapper {
    overflow-x: auto;
  }

  .patients-table {
    min-width: 800px;
  }
}
</style>