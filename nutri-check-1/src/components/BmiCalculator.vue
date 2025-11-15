<template>
  <div class="bmi-container">
    <h1>BMI Calculator</h1>

    <div class="form-group">
      <label for="weight">Weight (kg):</label>
      <input type="number" id="weight" v-model.number="weight" placeholder="Enter weight" />
    </div>

    <div class="form-group">
      <label for="height">Height (cm):</label>
      <input type="number" id="height" v-model.number="height" placeholder="Enter height" />
    </div>

    <button @click="calculateBMI">Calculate</button>

    <div v-if="bmi">
      <h2>Your BMI: {{ bmi.toFixed(1) }}</h2>
      <p>Category: {{ category }}</p>
      <router-link :to="{ name: 'HealthSuggestionPage', query: { bmi: bmi, category: category } }">Get Health Suggestions</router-link>
    </div>

    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const weight = ref(null)
const height = ref(null)
const bmi = ref(null)
const category = ref('')

const calculateBMI = () => {
  if (!weight.value || !height.value || weight.value <= 0 || height.value <= 0) {
    alert('Please enter valid values!')
    return
  }

  bmi.value = weight.value / ((height.value / 100) ** 2)

  if (bmi.value < 18.5) category.value = 'Underweight'
  else if (bmi.value < 24.9) category.value = 'Normal weight'
  else if (bmi.value < 29.9) category.value = 'Overweight'
  else category.value = 'Obese'
}

function logout() {
  localStorage.removeItem('user')
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.bmi-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 1rem;
}
input {
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
}
button:hover {
  background-color: #369e73;
}
</style>