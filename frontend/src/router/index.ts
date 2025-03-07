import { createRouter, createWebHistory } from '@ionic/vue-router';
import Auth from "@/views/Auth.vue";
import HomePage from "@/views/Main.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth',name:"Auth", component: Auth },
    { path: '/home',name:"Home", component: HomePage},
    { path: '/', redirect:"/auth",},
    {
      path: '/:catchAll(.*)',redirect:"/auth",
    }
  ],
  strict:false,
});

export default router;