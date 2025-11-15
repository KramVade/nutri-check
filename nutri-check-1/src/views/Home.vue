<template>
  <div class="home-container">
    <h1>Welcome to Nutri-Check</h1>
    <p>Your personal health and nutrition assistant.</p>
    
    <div class="navigation">
      <router-link to="/bmi-calculator" class="nav-button">BMI Calculator</router-link>
      <router-link to="/health-suggestion" class="nav-button">Health Suggestions</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 60px auto;
  text-align: center;
}
.navigation {
  margin-top: 20px;
}
.nav-button {
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
.nav-button:hover {
  background-color: #369e73;
}
</style>