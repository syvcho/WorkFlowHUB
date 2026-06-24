import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const RoutePlaceholder = {
  render() {
    return h('span', { style: 'display: none;' })
  },
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/auth',
      name: 'auth',
      component: RoutePlaceholder,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: RoutePlaceholder,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: RoutePlaceholder,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})
