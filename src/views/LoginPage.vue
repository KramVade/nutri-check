<template>
  <div class="login-container">
    <h1>Nutri-Check Login</h1>

    <div class="form-group">
      <label>Email:</label>
      <input type="email" v-model="email" placeholder="Enter your email" />
    </div>

    <div class="form-group">
      <label>Password:</label>
      <input type="password" v-model="password" placeholder="Enter your password" />
    </div>

    <button @click="handleLogin">Login</button>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = () => {
  // Basic mock authentication
  const validEmail = 'admin@nutricheck.com'
  const validPassword = '12345'

  if (email.value === validEmail && password.value === validPassword) {
    localStorage.setItem('user', JSON.stringify({ email: email.value }))
    router.push('/bmi')
  } else {
    error.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
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
.error {
  color: red;
  margin-top: 10px;
}
</style>
