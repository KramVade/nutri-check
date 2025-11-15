<template>
  <div class="health-suggestion-page">
    <h1>Health Suggestions</h1>
    <HealthSuggestion :bmi="bmi" :category="category" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import HealthSuggestion from '../components/HealthSuggestion.vue'

const route = useRoute()
const bmi = ref(route.params.bmi)
const category = ref(route.params.category)
</script>

<style scoped>
.health-suggestion-page {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>