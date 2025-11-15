<template>
  <div class="patient-info-container">
    <h1>Patient Information</h1>
    <form @submit.prevent="submitInfo">
      <div class="form-group">
        <label for="name">Full Name:</label>
        <input id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" type="number" v-model.number="age" required min="0" />
      </div>
      <div class="form-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender" required>
          <option disabled value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="contact">Contact Number:</label>
        <input id="contact" v-model="contact" required />
      </div>
      <button type="submit">Submit</button>
    </form>
    <div v-if="successMessage" class="success">
      {{ successMessage }}
      <button @click="goToBMICalculator" class="bmi-link">Calculate BMI</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'

const router = useRouter()
const name = ref('')
const age = ref(null)
const gender = ref('')
const contact = ref('')
const successMessage = ref('')

const submitInfo = () => {
  const patient = {
    name: name.value,
    age: age.value,
    gender: gender.value,
    contact: contact.value
  }
  localStorage.setItem('patientInfo', JSON.stringify(patient))
  successMessage.value = 'Patient information saved! Click "Calculate BMI" to continue.'
}

const goToBMICalculator = () => {
  router.push({
    name: 'BmiCalculator',
    state: {
      patient: {
        name: name.value,
        age: age.value,
        gender: gender.value,
        contact: contact.value
      }
    }
  })
}
</script>

<style scoped>
.patient-info-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 1rem;
}
input, select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background-color: #369e73;
}
.success {
  margin-top: 1rem;
  color: #42b983;
  font-weight: bold;
}
.bmi-link {
  background-color: #2196f3;
  margin-top: 10px;
}
.bmi-link:hover {
  background-color: #1769aa;
}
</style>