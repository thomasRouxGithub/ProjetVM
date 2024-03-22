<template>
    <div>
      <h1 class="h1 mb-5 text-white">Hello</h1>
      <div v-if="isLoggedIn" class="text-white">Bonjour {{ username }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  // import { useRouter } from 'vue-router';
  
  const isLoggedIn = ref(false);
  const username = ref('');
  // const router = useRouter();
  console.log(document.cookie);
  
  onMounted(() => {
    if (document.cookie.includes('accessToken')) {
      isLoggedIn.value = true;
      username.value = getUsernameFromCookie(); 
    } else {
    }
  });
  
  function getUsernameFromCookie(): string {
    return "to do";
  }
  </script>
  
  <style scoped>
  </style>
  