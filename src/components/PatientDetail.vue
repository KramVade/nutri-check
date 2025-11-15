<template>
  <div class="detail-container">
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
  </div>
</template>

<script setup>
defineProps({
  patient: Object
})
</script>

<style scoped>
.detail-container {
  margin-top: 30px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
th {
  background: #f5f5f5;
}
</style>