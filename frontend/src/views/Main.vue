<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Lists</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleLogout" color="danger">
            <ion-icon :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="ion-padding">
        <!-- Add List Button -->
        <ion-button expand="block" @click="openCreateModal" class="ion-margin-bottom">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
          Create New List
        </ion-button>

        <!-- Lists Section -->
        <ion-card v-if="lists.length > 0">
          <ion-card-header>
            <ion-card-title>Your Lists</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="list in lists" :key="list.id" button @click="openList(list)">
                <ion-label>
                  <h2>{{ list.name }}</h2>
                  <p>{{ list.store }}</p>
                </ion-label>
                <ion-icon :icon="chevronForward" slot="end"></ion-icon>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Empty State -->
        <div v-else class="ion-text-center ion-padding">
          <ion-icon :icon="listOutline" style="font-size: 48px; color: var(--ion-color-medium)"></ion-icon>
          <p class="ion-text-center ion-padding-top">No lists yet. Create your first list above!</p>
        </div>

        <!-- Error State -->
        <ion-card v-if="error" color="danger">
          <ion-card-content>
            <ion-text color="light">{{ error }}</ion-text>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <!-- Create List Modal -->
    <ion-modal :is-open="isCreateModalOpen" @didDismiss="closeCreateModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Create New List</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeCreateModal">
              <ion-icon :icon="closeOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input
            v-model="newList.name"
            label="Name"
            label-placement="floating"
            shape="round"
            fill="outline"
            placeholder="Enter list name"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            v-model="newList.store"
            label="Store"
            label-placement="floating"
            shape="round"
            fill="outline"
            placeholder="Enter store name"
          ></ion-input>
        </ion-item>
        <ion-button
          expand="block"
          class="ion-margin-top"
          :disabled="!newList.name || !newList.store || isLoading"
          @click="createList"
        >
          <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
          <span v-else>Create List</span>
        </ion-button>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useIonRouter } from '@ionic/vue';
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonText,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonList,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonModal
} from '@ionic/vue';
import { ListInput } from '../services/lists/list.model';
import {
  chevronForward,
  logOutOutline,
  listOutline,
  addOutline,
  closeOutline
} from 'ionicons/icons';
import { useMainStore } from '../store';

export default defineComponent({
  name: 'HomePage',
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonCard,
    IonText,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonList,
    IonLabel,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonModal
  },
  setup() {
    const store = useMainStore();
    const router = useIonRouter();
    
    const lists = computed(() => store.lists);
    const isLoading = computed(() => store.isLoading);
    const error = computed(() => store.error);
    const username = computed(() => store.username);
    
    const isCreateModalOpen = ref(false);
    const newList = ref<Partial<ListInput>>({
      name: '',
      store: ''
    });
    
    const fetchLists = async () => {
      await store.fetchLists();
    };

    const openCreateModal = () => {
      isCreateModalOpen.value = true;
    };

    const closeCreateModal = () => {
      isCreateModalOpen.value = false;
      newList.value = { name: '', store: '' };
    };

    const createList = async () => {
      try {
        await store.createList(newList.value as ListInput);
        closeCreateModal();
      } catch (error) {
        console.error('Error creating list:', error);
      }
    };

    const openList = (list: any) => {
      router.push(`/list/${list.id}`);
    };

    const handleRefresh = async (event: any) => {
      await fetchLists();
      event.target.complete();
    };
    
    const handleLogout = async () => {
      try {
        const response = await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          store.logout();
          router.push('/auth');
        } else {
          console.error('Logout failed:', response.statusText);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    onMounted(() => {
      fetchLists();
    });

    return {
      username,
      lists,
      newList,
      isLoading,
      error,
      isCreateModalOpen,
      handleLogout,
      createList,
      openList,
      handleRefresh,
      openCreateModal,
      closeCreateModal,
      chevronForward,
      logOutOutline,
      listOutline,
      addOutline,
      closeOutline
    };
  }
});
</script>

<style scoped>
.align-items {
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  margin: 0;
  font-size: 36px;
}
.full-height {
  height: 100%;
}
ion-card {
  background-color: var(--ion-card-background-color); 
  padding: 10px;
}
ion-col {
 margin: auto;
}
ion-card-title , ion-card-subtitle {
  text-align: center;
}
</style>
