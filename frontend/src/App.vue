
<template>
  <ion-app>
    <ion-router-outlet id="mainContent"/>

    <ion-menu v-if="isAuthenticated" content-id="mainContent">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">This is the menu content.</ion-content>
    </ion-menu>

    
  </ion-app>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { IonApp, IonRouterOutlet, IonMenu,IonHeader,IonToolbar,IonContent,IonTitle,IonButtons,IonMenuButton } from "@ionic/vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButtons,
    IonMenuButton
  },
  setup() {
    const store = useStore();

    const isAuthenticated = computed(() => store.state.isAuthenticated);

    return {
      isAuthenticated,
    };
  },
});
</script>

<style>

  #app {
    width: 100%;
    height: 100%;
  }

  ion-button {
    text-transform: none;
  }

  ion-card {
    border-radius: 10px;
  }

</style>
