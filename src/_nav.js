export default [
  {
    component: 'CNavTitle',
    name: 'Participant',
    role: 'participant',
    auth: false,
  },
  {
    component: 'CNavItem',
    name: 'Eligible Sessions',
    to: '/participant/eligible_sessions',
    icon: 'cil-check',
    auth: true,
  },
  {
    component: 'CNavItem',
    name: 'Past Sessions',
    to: '/participant/past_sessions',
    icon: 'cil-dollar',
    auth: true,
  },
]
