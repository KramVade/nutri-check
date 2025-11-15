<template>
  <div class="suggestion-container">
    <h1>Health Suggestions</h1>
    <div v-if="category">
      <h2>Based on your BMI: {{ bmi.toFixed(1) }} ({{ category }})</h2>
      <div v-if="category === 'Underweight'">
        <h3>Food Recommendations:</h3>
        <ul>
          <li>Nut butters</li>
          <li>Avocados</li>
          <li>Whole grain bread</li>
          <li>Full-fat dairy products</li>
          <li>Protein shakes</li>
        </ul>
        <h3>Activity Recommendations:</h3>
        <p>Focus on strength training exercises to build muscle mass.</p>
      </div>
      <div v-else-if="category === 'Normal weight'">
        <h3>Food Recommendations:</h3>
        <ul>
          <li>Fruits and vegetables</li>
          <li>Lean proteins</li>
          <li>Whole grains</li>
          <li>Healthy fats</li>
        </ul>
        <h3>Activity Recommendations:</h3>
        <p>Maintain a balanced exercise routine with both cardio and strength training.</p>
      </div>
      <div v-else-if="category === 'Overweight'">
        <h3>Food Recommendations:</h3>
        <ul>
          <li>Leafy greens</li>
          <li>Lean meats</li>
          <li>Whole grains</li>
          <li>Low-fat dairy</li>
        </ul>
        <h3>Activity Recommendations:</h3>
        <p>Incorporate regular aerobic exercises and strength training.</p>
      </div>
      <div v-else>
        <h3>Food Recommendations:</h3>
        <ul>
          <li>Fruits and vegetables</li>
          <li>Lean proteins</li>
          <li>Whole grains</li>
          <li>Healthy fats</li>
        </ul>
        <h3>Activity Recommendations:</h3>
        <p>Engage in regular physical activity and consider consulting a healthcare provider.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  bmi: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.suggestion-container {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
h1, h2, h3 {
  margin-bottom: 1rem;
}
ul {
  margin: 0;
  padding-left: 20px;
}
</style>