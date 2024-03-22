<template>
  <div>
    <h1 class="h1 mb-5 text-white">Welcome to VMFast !</h1>
    <div class="border border-primary p-5 bg-dark text-white rounded">
      <h1 class="fs-2 mb-5">Please login</h1>
      <form @submit.prevent="submitLoginForm">
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp">
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('email');
const password = ref('password');
const router = useRouter();

async function submitLoginForm() {
  console.log("Submit" + email.value + password.value)
  try {
    const response = await axios.post('http://localhost:3001/auth/login', {
      email: email.value,
      password: password.value
    }, {
      withCredentials: true,
    });

    if (response.status === 201) {
      router.push('/home');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}
</script>

<style scoped>
</style>
