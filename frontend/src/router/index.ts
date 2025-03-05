import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/Home.vue';
import AuthPage from '../views/Auth.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  }
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !router.app.$store.state.isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});
export default router;