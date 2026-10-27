import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../pages/LoginPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import AdminPage from '../pages/AdminPage.vue'

const routes = [
  // главная сразу перекидывает в профиль (а если не вошёл - guard отправит на вход)
  { path: '/', redirect: '/profile' },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { guestOnly: true } // только для тех, кто ещё не вошёл
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    // requiresAuth - нужен вход, roles - каким ролям можно
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Глобальный guard - срабатывает перед каждым переходом: to - куда идём, from - откуда
router.beforeEach((to, from, next) => {
  // store берём внутри guard'а, а не в начале файла:
  // к моменту перехода Pinia уже подключена в main.js
  const authStore = useAuthStore()

  // 1. Страница только для вошедших, а токена нет (или он не прошёл проверку) - на вход.
  // В redirect запоминаем, куда хотел попасть пользователь, чтобы вернуть его туда после входа
  if (to.meta.requiresAuth && !authStore.validateToken()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 2. Роль не подходит (например, user открывает /admin) - отправляем в профиль.
  // includes проверяет, есть ли роль пользователя в списке разрешённых
  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    next({ name: 'Profile' })
    return
  }

  // 3. Уже вошёл и открывает /login - отправляем в профиль
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Profile' })
    return
  }

  // во всех остальных случаях пропускаем
  next()
})

export default router
