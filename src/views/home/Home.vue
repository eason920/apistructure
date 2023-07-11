<template>
  <div class="welcome">
    <span v-cloak>{{ sAccountName }}</span>
    , Welcome to GWInstek Auto Test System(GW ATS)
  </div>
  <div v-if="!bHasPermissions" class="no_pms">This account doesn`t belong to any groups</div>
  <div class="box">
    <div v-for="(item, i) in aList.data" :key="'title' + i" :class="'item item' + i">
      <h2 class="item_title">{{ item.title }}</h2>
      <div class="unit">
        <div
          v-for="(unit, j) in item.unit"
          :key="'unit' + j"
          class="unit_btn"
          :class="[{ empty: unit.name === '' }, { no_permission: !unit.havePermission }]"
          @click="fnPushPage(unit.name, unit.havePermission)"
        >
          <!--Basic-->
          <TestProgramIcon v-if="i === 0 && j === 0" />
          <ReportEditorIcon v-if="i === 0 && j === 1" />
          <ReportGeneratorIcon v-if="i === 0 && j === 2" />
          <GoNogoIcon v-if="i === 0 && j === 3" />
          <!--Advance-->
          <TestItemIcon v-if="i === 1 && j === 0" />
          <StatisticsIcon v-if="i === 1 && j === 1" />
          <ReportWizardIcon v-if="i === 1 && j === 2" />
          <OnlineControlIcon v-if="i === 1 && j === 3" />
          <!--System-->
          <HWConfigIcon v-if="i === 2 && j === 0" />
          <UserManagementIcon v-if="i === 2 && j === 1" />
          <AboutIcon v-if="i === 2 && j === 2" />
          {{ unit.showName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// icon for Basic
import { ListCheck as TestProgramIcon } from '@vicons/tabler';
import { NotepadEdit16Regular as ReportEditorIcon } from '@vicons/fluent';
import { Report as ReportGeneratorIcon } from '@vicons/carbon';
import { ArrowForwardCircleOutline as GoNogoIcon } from '@vicons/ionicons5';

// icon for Advance
import { CheckBoxOutlined as TestItemIcon } from '@vicons/material';
import { BrandGoogleAnalytics as StatisticsIcon } from '@vicons/tabler';
import { HatWizard as ReportWizardIcon } from '@vicons/fa';
import { ControlOutlined as OnlineControlIcon } from '@vicons/antd';

// icon for System
import { Settings as HWConfigIcon } from '@vicons/tabler';
import { ManageAccountsOutlined as UserManagementIcon } from '@vicons/material';
import { Enterprise as AboutIcon } from '@vicons/carbon';

// INIT API TOKEN *若沒再次給、會導致 token 遺失、API失效
// = 一進來 API error
// = 一進來沒畫面
// = 要刷畫面促成 API 取得 token 來讀值
import { fnInitApiToken } from '@/common/index.js';

// STORE
import { useHomeStore } from '@/stores/home/home.js';
const store = useHomeStore();

const router = useRouter();

const bHasPermissions = ref(false);

const sAccountName = ref('');

const aList = reactive({ data: [] });

const fnPushPage = (name, havePermission) => {
  if (name && havePermission) {
    router.push({ name });
    if (name === 'UserInfo') {
      window.localStorage.setItem('pageStatus', 0);
    }
  } else {
    console.log('No Permission');
  }
};

onMounted(() => {
  fnInitApiToken();
  localStorage.setItem('apiErred', 'false');

  // 1
  sAccountName.value = window.localStorage.getItem('name');

  // 2
  // fnApiGetUserInfo(sessionStorage.getItem('id'));
  // fnApiCheck('apiGetUserInfo', apiGetUserInfo, fnApiGetUserInfo, [sessionStorage.getItem('id')]);

  // 3
  store.fnApiSelfPms().then(() => {
    bHasPermissions.value = store.apiSelfPmsRes.data.hasPms;

    // aList.data = store.apiSelfPmsRes.ary;
    store.apiSelfPmsRes.data.ary.forEach((item) => {
      aList.data.push(item);
    });

    // console.log('aList.data ', aList.data);
  });
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/home.scss';
</style>
