<template>
  <div class="header">
    <div v-cloak class="header_wrapper">
      <a href="/home" class="logo"><img src="@/assets/images/publicImages/logo_black.svg" /></a>
      <div class="msgBox">
        <div v-if="bShowLogout" class="msgBox_doMain">
          current testing :
          <div class="msgBox_doMain_name">{{ sfName }}</div>
        </div>
        <div v-if="bShowLogout" class="msgBox_log" @click="fnLogout">
          <span class="msgBox_log_name">{{ sName }}</span>
          <div class="msgBox_log_btn">Log out</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useAccountLogStore } from '@/stores/publicStore/accountLog.js';

import { fnInitApiToken } from '@/common/index.js';

const store = useAccountLogStore();

const router = useRouter();

const bShowLogout = ref(true);
const sName = ref('');
const sfName = ref('');

onMounted(() => {
  fnInitApiToken();
});

watch(
  () => router.currentRoute.value.name,
  (val) => {
    bShowLogout.value = val === 'Login' ? false : true;
    sName.value = window.localStorage.getItem('name');
    // Login watch 不寫死時再改動態
    sfName.value = 'PSU-Test';
  },
  { deep: true }
);

const fnLogout = () => {
  window.localStorage.clear();
  window.sessionStorage.clear();

  store.fnApiLogOut();

  router.push({ name: 'Login' });
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/publicStyle/header.scss';
</style>
