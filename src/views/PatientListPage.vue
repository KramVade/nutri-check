<template>
  <div class="patient-list-container">
    <h1>Patient List</h1>
    <p v-if="patients.length === 0" class="no-patients">No patients found. Add a patient to get started!</p>
    <ul v-else>
      <li v-for="patient in patients" :key="patient.id">
        <router-link :to="`/patients/${patient.id}`" class="name-btn">
          {{ patient.name }} - BMI: {{ patient.bmi ? patient.bmi.toFixed(1) : 'N/A' }}
        </router-link>
      </li>
    </ul>
    <div class="actions">
      <button @click="$router.push('/patient-info')" class="action-btn">Add New Patient</button>
      <button @click="$router.push('/dashboard')" class="action-btn secondary">Back to Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const patients = ref([])

const fetchPatients = async () => {
  const querySnapshot = await getDocs(collection(db, 'patients'))
  patients.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(fetchPatients)
</script>

<style scoped>
.patient-list-container {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
.name-btn {
  color: #42b983;
  font-size: 1.1rem;
  cursor: pointer;
  text-align: left;
  padding: 8px 0;
  text-decoration: none;
  display: block;
}
.name-btn:hover {
  text-decoration: underline;
}
.no-patients {
  color: #666;
  font-style: italic;
  margin: 20px 0;
}
.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  justify-content: center;
}
.action-btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.action-btn:hover {
  background-color: #369e73;
}
.action-btn.secondary {
  background-color: #6c757d;
}
.action-btn.secondary:hover {
  background-color: #5a6268;
}
</style>