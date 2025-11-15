<template>
  <div class="patient-list-container">
    <h1>Patient List</h1>
    <ul>
      <li v-for="patient in patients" :key="patient.id">
        <router-link :to="`/patients/${patient.id}`" class="name-btn">
          {{ patient.name }}
        </router-link>
      </li>
    </ul>
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
</style>