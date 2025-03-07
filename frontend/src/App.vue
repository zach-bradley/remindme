
<template>
  <ion-app>
    <ion-router-outlet id="mainContent"/>
    <ion-menu content-id="mainContent">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">This is the menu content.</ion-content>
    </ion-menu>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonApp, IonRouterOutlet, IonMenu,IonHeader,IonToolbar,IonContent,IonTitle,IonButtons,IonMenuButton } from "@ionic/vue";

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
});
</script>
<style>
  #app {
    width: 100%;
    height: 100%;    
  }

</style>
