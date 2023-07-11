<template>
  <div class="label">
    <div
      v-for="(item, i) in list"
      :key="item + i"
      :class="[{ active: nActive === i }]"
      class="label_tab"
      @click="fnChangePage(i)"
    >
      {{ item }}
    </div>
  </div>
  <router-view />
</template>

<script>
export default {
  name: 'UserManagementParent'
};
</script>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const nActive = ref(0);
const list = reactive([
  'User Info',
  'Group setting'
  // 'Activity Log'
  // some
]);
onMounted(() => {
  const pageStatus = localStorage.getItem('pageStatus');
  if (pageStatus) {
    nActive.value = Number(pageStatus);
  }
});
const fnChangePage = (i) => {
  nActive.value = i;
  let name = '';
  switch (i) {
    case 0:
      name = 'GroupSetting';
      break;
    case 1:
      name = 'GroupSetting';
      break;
    default:
      name = 'Home';
  }
  window.localStorage.setItem('pageStatus', nActive.value);
  router.push({ name });
};
</script>

<style lang="scss" scoped>
.label {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: flex-start;
}
.label_tab {
  background-color: #bbb;
  border-radius: 2px 2px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font: {
    size: 18px;
    weight: bold;
  }
  margin-right: 3px;
  padding: 0 20px;
  user-select: none;
  cursor: pointer;
  &.active {
    background-color: #fff;
    cursor: default;
  }
}
</style>
