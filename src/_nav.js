export default [
  {
    component: 'CNavTitle',
    name: 'Participant',
    role: 'participant',
    auth: false,
  },
  {
    component: 'CNavItem',
    name: 'Eligible Studies',
    to: '/participant/eligible_studies',
    icon: 'cil-check',
    auth: true,
  },
  {
    component: 'CNavItem',
    name: 'Past Studies',
    to: '/participant/past_studies',
    icon: 'cil-dollar',
    auth: true,
  },
]
