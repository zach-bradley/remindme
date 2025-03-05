<template>
    <ion-content class="auth-container">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ isLogin ? 'Login' : 'Register' }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-item>
        <ion-label position="floating">Username</ion-label>
        <ion-input v-model="username" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Password</ion-label>
        <ion-input type="password" v-model="password" required></ion-input>
      </ion-item>
      <ion-item v-if="!isLogin">
        <ion-label position="floating">Email</ion-label>
        <ion-input v-model="email" type="email" required></ion-input>
      </ion-item>
      <ion-item v-if="!isLogin">
        <ion-label position="floating">First Name</ion-label>
        <ion-input v-model="firstName" required></ion-input>
      </ion-item>
      <ion-item v-if="!isLogin">
        <ion-label position="floating">Last Name</ion-label>
        <ion-input v-model="lastName" required></ion-input>
      </ion-item>
      <ion-button expand="full" @click="handleSubmit">{{ isLogin ? 'Login' : 'Register' }}</ion-button>
      <ion-button expand="full" color="light" @click="toggleAuth">{{ isLogin ? 'Switch to Register' : 'Switch to Login' }}</ion-button>
      <ion-text color="danger" v-if="error">{{ error }}</ion-text>
    </ion-content>
  </template>
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useStore } from 'vuex';
  import { LoginRequest, RegisterRequest, model as authModel } from '../services/auth/auth.model';
  export default defineComponent({
    name: 'Auth',
    setup() {
      const store = useStore();
      const username = ref('');
      const password = ref('');
      const email = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const isLogin = ref(true);
      const error = ref('');
      const handleSubmit = async () => {
        error.value = '';
        try {
          if (isLogin.value) {
            const loginData: LoginRequest = { username: username.value, password: password.value };
            const response = await authModel.api.login(loginData);
            store.commit('setAuth', true);
            store.commit('setUser', response.user);
          } else {
            const registerData: RegisterRequest = {
              username: username.value,
              password: password.value,
              email: email.value,
              firstName: firstName.value,
              lastName: lastName.value
            };
            const response = await authModel.api.register(registerData);
            store.commit('setAuth', true);
            store.commit('setUser', response.user);
          }
        } catch (e) {
          error.value = e instanceof Error ? e.message : 'An error occurred';
        }
      };
      const toggleAuth = () => {
        isLogin.value = !isLogin.value;
        username.value = '';
        password.value = '';
        email.value = '';
        firstName.value = '';
        lastName.value = '';
        error.value = '';
      };
      return { username, password, email, firstName, lastName, isLogin, handleSubmit, toggleAuth, error };
    }
  });
  </script>
  <style scoped>
  .auth-container {
    padding: 16px;
  }
  </style>