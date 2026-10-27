import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
// Pinia подключаем раньше роутера: guard в роутере пользуется store авторизации
app.use(pinia)
app.use(router)
app.mount('#app')
