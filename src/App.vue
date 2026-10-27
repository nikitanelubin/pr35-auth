<template>
  <header class="header">
    <!-- шапка меняется сама, когда меняется состояние в store -->
    <span v-if="authStore.isAuthenticated">
      Авторизован как <strong>{{ authStore.role }}</strong> |
      <RouterLink to="/profile" class="link">Профиль</RouterLink>
    </span>
    <span v-else>
      <RouterLink to="/login" class="link">Войти</RouterLink>
    </span>
  </header>
  <RouterView />
</template>

<script setup>
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.header {
  margin-bottom: 1.5rem;
  padding: 1rem 20px;
  border-bottom: 1px solid #eee;
}

.link {
  margin-left: 0.5rem;
  color: #42b983;
}
</style>
