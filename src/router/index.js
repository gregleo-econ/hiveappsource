import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/welcome',
    children: [
            {
        path: '/welcome',
        name: 'Welcome',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/everyone/welcome.vue'),
        meta:      {
          requiresAuth: false,
        },
  
      },
      {
        path: '/participant',
        name: 'Participant',
        redirect: '/participant/eligible_studies',
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/participant/eligible_studies',
        name: 'Eligible Studies',
        component: () => import('@/views/participant/eligible_studies.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/participant/past_studies',
        name: 'Past Studies',
        component: () => import('@/views/participant/past_studies.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/participant/profile',
        name: 'Profile',
        component: () => import('@/views/participant/profile.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/my_studies',
        name: 'My Studies',
        component: () => import('@/views/researcher/my_studies.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/new_project',
        name: 'New Project',
        component: () => import('@/views/researcher/new_project.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/new_study',
        name: 'New Study',
        component: () => import('@/views/researcher/new_study.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/manage_funds',
        name: 'Research Funds',
        component: () => import('@/views/researcher/manage_funds.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/new_user/new_researcher',
        name: 'New Researcher',
        component: () => import('@/views/new_user/new_researcher.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/new_user/new_participant',
        name: 'New Participant',
        component: () => import('@/views/new_user/new_participant.vue'),
        meta:      {
          requiresAuth: true,
        },
      }

    ]
}]


const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
