import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  // при запуске берём данные из localStorage - так вход не слетает после перезагрузки страницы
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
    role: localStorage.getItem('auth_role') || null, // 'user' | 'admin'
    user: localStorage.getItem('auth_user') || null // логин пользователя
  }),

  getters: {
    // !! превращает значение в true/false: есть токен - true, null - false
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user'
  },

  actions: {
    login(credentials) {
      // В демо: «валидируем» логин/пароль и назначаем роль.
      // Запись { username, password } = credentials достаёт два поля из объекта в переменные
      const { username, password } = credentials

      if (username === 'admin' && password === 'admin123') {
        this.token = 'fake-admin-token'
        this.role = 'admin'
      } else if (username === 'user' && password === 'user123') {
        this.token = 'fake-user-token'
        this.role = 'user'
      } else {
        // throw "выбрасывает" ошибку - её поймает catch на странице входа
        throw new Error('Неверный логин или пароль')
      }
      this.user = username

      localStorage.setItem('auth_token', this.token)
      localStorage.setItem('auth_role', this.role)
      localStorage.setItem('auth_user', this.user)
    },

    logout() {
      this.token = null
      this.role = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_role')
      localStorage.removeItem('auth_user')
    },

    validateToken() {
      // Имитация проверки токена: если токена нет - не авторизован.
      // В реальности: запрос к /auth/me, проверка статуса 200/401
      if (!this.token) {
        return false
      }
      return true
    }
  }
})
