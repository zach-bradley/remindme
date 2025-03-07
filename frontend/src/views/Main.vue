<template>
  <ion-page>
    <ion-content>
      <div class="min-h-screen p-8">
        <div class="max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl">Welcome, {{ username }}!</h1>
            <ion-button @click="handleLogout" color="danger">
              Logout
            </ion-button>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Dashboard</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <p>This is your protected home page.</p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useIonRouter } from '@ionic/vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },
  setup() {
    const store = useStore();
    const router = useIonRouter();
    
    // Fallback to 'Guest' if username is not available
    const username = computed(() => store.state.user?.username || 'Guest');
    
    const handleLogout = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          // Clear authentication state and user data in the store
          store.commit('setAuth', false);
          store.commit('setUser', null); // Reset user data
          
          // Redirect to the auth page (login/register)
          router.push('/auth');
        } else {
          console.error('Logout failed:', response.statusText);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return {
      username,
      handleLogout
    };
  }
});
</script>

<style scoped>
/* You can add any styles specific to the home page here */
</style>
