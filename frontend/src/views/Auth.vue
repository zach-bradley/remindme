<template>
  <ion-page>
    <ion-content class="auth-container">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ isLogin ? 'Login' : 'Register' }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Username</ion-label>
            <ion-input v-model="username" required></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" v-model="password" required></ion-input>
          </ion-item>

          <!-- Email, First Name, and Last Name only for Register -->
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

          <!-- Submit Button -->
          <ion-button expand="full" :disabled="isSubmitting" @click="handleSubmit">
            {{ isLogin ? 'Login' : 'Register' }}
          </ion-button>

          <!-- Switch between Login/Register -->
          <ion-button expand="full" color="light" @click="toggleAuth">
            {{ isLogin ? 'Switch to Register' : 'Switch to Login' }}
          </ion-button>

          <!-- Display error message -->
          <ion-text color="danger" v-if="error">{{ error }}</ion-text>          
        </ion-card-content>
      </ion-card>
    </ion-content>  
  </ion-page>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useIonRouter } from '@ionic/vue'; // Import the useIonRouter hook
import { IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonButton, IonText,IonPage, IonCard,IonCardContent } from '@ionic/vue';
import { LoginRequest, RegisterRequest, model as authModel } from '../services/auth/auth.model';

export default defineComponent({
  name: 'Auth',
  components:{IonContent, IonHeader, IonToolbar, IonTitle, IonItem, IonLabel, IonInput, IonButton, IonText,IonPage,IonCard,IonCardContent},
  setup() {
    const store = useStore();
    const router = useIonRouter(); // Use the useIonRouter hook for navigation

    const username = ref('');
    const password = ref('');
    const email = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const isLogin = ref(true);
    const error = ref('');
    const isSubmitting = ref(false); // Used to disable button during form submission

    // Handle form submission (login or register)
    const handleSubmit = async () => {
      error.value = '';
      isSubmitting.value = true; // Disable submit button during submission

      try {
        let response;
        if (isLogin.value) {
          const loginData: LoginRequest = { username: username.value, password: password.value };
          response = await authModel.api.login(loginData);
        } else {
          const registerData: RegisterRequest = {
            username: username.value,
            password: password.value,
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value
          };
          response = await authModel.api.register(registerData);
        }

        store.commit('setAuth', true);
        store.commit('setUser', response.user);

        // Navigate to a new page after login/register is successful
        router.push('/home'); // You can change '/home' to whatever route you want

      } catch (e) {
        error.value = e instanceof Error ? e.message : 'An error occurred';
      } finally {
        isSubmitting.value = false; // Re-enable button after submission
      }
    };

    // Toggle between login and register forms
    const toggleAuth = () => {
      isLogin.value = !isLogin.value;
      username.value = '';
      password.value = '';
      email.value = '';
      firstName.value = '';
      lastName.value = '';
      error.value = '';
    };

    return { 
      username, password, email, firstName, lastName, isLogin, isSubmitting, handleSubmit, toggleAuth, error 
    };
  }
});
</script>

<style scoped>
.auth-container {
  padding: 16px;
}

ion-button[disabled] {
  opacity: 0.5;
}

ion-page {
  width:100%;
  height:100%;
}
</style>
