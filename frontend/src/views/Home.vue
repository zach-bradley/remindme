
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
  import { useRouter } from 'vue-router';
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
      const router = useRouter();
      
      const username = computed(() => store.state.user?.username);
      
      const handleLogout = async () => {
        try {
          const response = await fetch('/api/logout', {
            method: 'POST'
          });
          if (response.ok) {
            store.commit('setAuth', false);
            router.push('/auth');
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
  