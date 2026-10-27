<template>
  <div class="page">
    <h1>Смена пароля</h1>
    <form @submit="handleSubmit">
      <div class="form-group">
        <label>Текущий пароль</label>
        <input v-model="form.oldPassword" type="password" class="form-input" />
      </div>
      <div class="form-group">
        <label>Новый пароль</label>
        <input v-model="form.newPassword" type="password" class="form-input" />
      </div>
      <div class="form-group">
        <label>Повторите новый пароль</label>
        <input v-model="form.confirmPassword" type="password" class="form-input" />
      </div>
      <button type="submit" class="btn-submit">Сменить пароль</button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>

    <!-- $router в шаблоне - тот же роутер, что useRouter() в script -->
    <button @click="$router.push('/profile')" class="btn-back">Назад в профиль</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const error = ref(null)
const success = ref('')

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = (e) => {
  e.preventDefault() // форма не перезагружает страницу
  error.value = null
  success.value = ''

  // простые проверки полей прямо на странице
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    error.value = 'Заполните все поля.'
    return
  }
  if (form.newPassword.length < 6) {
    error.value = 'Новый пароль должен быть не короче 6 символов.'
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    error.value = 'Новые пароли не совпадают.'
    return
  }

  try {
    // store проверит текущий пароль. Если что-то не так - он выбросит ошибку и мы попадём в catch
    authStore.changePassword(form.oldPassword, form.newPassword)
    success.value = 'Пароль изменён'

    // очищаем поля формы
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (err) {
    error.value = err.message
  }
}
</script>

<style scoped>
.page { max-width: 400px; margin: 2rem auto; }
.form-group { margin-bottom: 0.8rem; }
.form-group label { display: block; margin-bottom: 0.3rem; }
.form-input { width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.btn-submit { margin-top: 0.5rem; padding: 0.7rem 1rem; background: #42b983; color: white; border: none; border-radius: 4px; cursor: pointer; }
.btn-back { margin-top: 1rem; padding: 0.7rem 1rem; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; }
.error-message { color: #c62828; margin-top: 0.5rem; }
.success-message { padding: 0.6rem; margin-top: 0.8rem; border-radius: 4px; background: #e8f5e9; color: #2e7d32; }
</style>
