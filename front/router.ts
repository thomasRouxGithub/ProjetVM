import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './src/components/HomePage.vue';
import LoginPage from './src/components/LoginForm.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
