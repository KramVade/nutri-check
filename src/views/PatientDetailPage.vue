<template>
  <div class="detail-container" v-if="patient">
    <h2>Patient Details</h2>
    <table>
      <tr><th>Name</th><td>{{ patient.name }}</td></tr>
      <tr><th>Age</th><td>{{ patient.age }}</td></tr>
      <tr><th>Gender</th><td>{{ patient.gender }}</td></tr>
      <tr><th>Contact</th><td>{{ patient.contact }}</td></tr>
      <tr><th>Weight (kg)</th><td>{{ patient.weight }}</td></tr>
      <tr><th>Height (cm)</th><td>{{ patient.height }}</td></tr>
      <tr><th>BMI</th><td>{{ patient.bmi ? patient.bmi.toFixed(1) : '' }}</td></tr>
      <tr><th>Category</th><td>{{ patient.category }}</td></tr>
      <tr><th>Date</th><td>{{ patient.timestamp ? new Date(patient.timestamp.seconds * 1000).toLocaleString() : '' }}</td></tr>
    </table>
    <div class="actions">
      <button @click="$router.push('/patients')" class="back-btn">Back to Patient List</button>
      <button @click="$router.push('/dashboard')" class="home-btn">Dashboard</button>
    </div>
  </div>
  <div v-else class="detail-container">
    <p>Loading patient details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const patient = ref(null)

onMounted(async () => {
  const docRef = doc(db, 'patients', route.params.id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    patient.value = docSnap.data()
  }
})
</script>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
th {
  background: #f5f5f5;
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
.back-btn, .home-btn {
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.back-btn {
  background-color: #42b983;
}
.back-btn:hover {
  background-color: #369e73;
}
.home-btn {
  background-color: #6c757d;
}
.home-btn:hover {
  background-color: #5a6268;
}
</style>