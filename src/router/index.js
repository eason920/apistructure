// import { createRouter, createWebHistory } from 'vue-router'; // history
import {
  createRouter,
  createWebHistory // history
  // createWebHashHistory // hash
} from 'vue-router';

import Login from '../views/login/Login.vue';
import Home from '../views/home/Home.vue';
import ReportGeneratorParents from '../views/basic/reportGenerator/ReportGeneratorParents.vue';
import ReportGeneratorIndex from '../views/basic/reportGenerator/ReportGeneratorIndex.vue';
import ReportGeneratorDetail from '../views/basic/reportGenerator/ReportGeneratorDetail.vue';
import UserManagementParent from '../views/system/userManagerment/UserManagementParent.vue';
import GroupSetting from '../views/system/userManagerment/groupSetting/GroupSetting.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  // Basic
  {
    path: '/basic/reportgenerator',
    component: ReportGeneratorParents,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ReportGeneratorIndex',
        component: ReportGeneratorIndex,
        meta: { requiresAuth: true }
      },
      {
        path: 'detail',
        name: 'ReportGeneratorDetail',
        component: ReportGeneratorDetail,
        meta: { requiresAuth: true }
      }
    ]
  },
  // Advance
  // (none)
  // System
  {
    path: '/system/usermanagement',
    component: UserManagementParent,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'groupsetting',
        name: 'GroupSetting',
        component: GroupSetting,
        meta: { requiresAuth: true }
      }
    ]
  },
  // catchAll 要放最後面
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(), // history
  // history: createWebHashHistory(), // hash
  routes
});

router.beforeEach(async (to) => {
  const token = sessionStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    alert('請登入！');
    return { name: 'Login' };
  }
});

export default router;
