
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(store);

router.isReady().then(() => {
    app.mount('#app');
});
