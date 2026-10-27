<template>
  <div class="page">
    <h1>Панель администратора</h1>
    <p>Здесь только администраторы.</p>

    <!-- Пример: запрос с проверкой токена -->
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="data" class="admin-data">
      <h3>Данные, доступные только админу</h3>
      <pre>{{ data }}</pre>
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <button @click="fetchProtectedData" class="btn-primary" :disabled="loading">
      Запросить защищённые данные
    </button>

    <!-- $router в шаблоне - тот же роутер, что useRouter() в script -->
    <button @click="$router.push('/profile')" class="btn-back">Назад в профиль</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const data = ref(null)
const error = ref(null)

const fetchProtectedData = async () => {
  loading.value = true
  error.value = null

  // Проверка валидности токена перед запросом
  if (!authStore.validateToken()) {
    error.value = 'Сессия истекла. Пожалуйста, войдите снова.'
    loading.value = false
    return
  }

  try {
    // токен отправляем в заголовке Authorization - так сервер понимает, кто делает запрос
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // 401 - сервер не принял токен: выходим, нужна повторная авторизация
      if (response.status === 401) {
        authStore.logout()
        error.value = 'Требуется повторная авторизация.'
      } else {
        error.value = `Ошибка сервера: ${response.status}`
      }
      loading.value = false
      return
    }

    data.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка сети'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-data { background: #f3f4f6; padding: 1rem; border-radius: 6px; margin-top: 1rem; }
pre { margin: 0; font-size: 0.9rem; white-space: pre-wrap; }
.btn-primary { margin-top: 1rem; padding: 0.7rem 1rem; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn-back { margin-top: 1rem; margin-left: 0.5rem; padding: 0.7rem 1rem; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; }
.error-message { color: #c62828; margin-top: 1rem; }
</style>
