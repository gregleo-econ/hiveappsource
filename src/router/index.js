import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'
import store from '@/store/index.js';
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
        redirect: '/participant/eligible_sessions',
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/participant/eligible_sessions',
        name: 'Eligible Sessions',
        component: () => import('@/views/participant/eligible_sessions.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/participant/past_sessions',
        name: 'Past Sessions',
        component: () => import('@/views/participant/past_sessions.vue'),
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
        path: '/community/projects',
        name: 'Project Database',
        component: () => import('@/views/community/projects.vue'),
        meta:      {
          requiresAuth: false,
        },
      },
      {
        path: '/researcher/profile',
        name: 'Researcher Profile',
        component: () => import('@/views/researcher/profile.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/my_sessions',
        name: 'My Sessions',
        component: () => import('@/views/researcher/my_sessions.vue'),
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
        path: '/researcher/my_projects',
        name: 'My Projects',
        component: () => import('@/views/researcher/my_projects.vue'),
        meta:      {
          requiresAuth: true,
        },
      },
      {
        path: '/researcher/new_session',
        name: 'New Session',
        component: () => import('@/views/researcher/new_session.vue'),
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
      },
      {
        path: '/new_user/new',
        name: 'New User',
        component: () => import('@/views/new_user/new.vue'),
        meta:      {
          requiresAuth: true,
        },
      }
    ]
}]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})
router.afterEach(to => {
  if(to.path != "/welcome"){
  // store.commit('route',to.path)
  }
  
})
export default router
