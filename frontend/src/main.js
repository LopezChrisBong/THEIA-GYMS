import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import store from './store'
import mixins from './mixins'
import FadeAwayMessage from './components/Alerts/FadeAwayMessage.vue';

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './assets/css/global.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.component('fade-away-message-component', FadeAwayMessage);
app.use(vuetify)
app.use(router)
app.use(store)
app.mixin(mixins)

app.mount('#app')
