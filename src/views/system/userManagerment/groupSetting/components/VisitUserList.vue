<template>
  <ul v-if="oGroupUserList.data.length !== 0" class="listBox">
    <li v-for="item in oGroupUserList.data" :key="item.user_id">
      <span class="is_id">{{ item.user_id }}</span>
      <span class="is_name">{{ item.user_name }}</span>
      <span class="is_status">{{ item.user_status }}</span>
    </li>
  </ul>
  <span v-else>{{ sDefEmptyText }}</span>
</template>

<script>
export default {
  name: 'GroupSettingSelector'
};
</script>

<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted
  // some
} from 'vue';

// API
import {
  apiGetGroupUsers
  // some
} from '@/api/axios/system/userInfo/groupSetting.js';

// Common
import { fnApiErred } from '@/common/index.js';

// PROPS
const props = defineProps({
  propsGroupId: {
    type: Number,
    default: 0
  }
});

const sDefEmptyText = ref('Please select a group from the menu above');

// 進頁(visit)、換回 visit 時
onMounted(() => {
  console.log('%c(from cpn uls onMtd) props.propsGroupId is ' + props.propsGroupId, 'color:#3092ca');
  if (props.propsGroupId !== null) {
    fnApiGetGroupUsers(props.propsGroupId);
  }
});

// for 同頁換 select 時用 (特別是 visit 頁)
watch(
  () => props.propsGroupId,
  (newVal) => {
    console.log('%c(from cpn uls onWh) props.propsGroupId is ' + props.propsGroupId, 'color:#3092ca');
    fnApiGetGroupUsers(newVal);
  }
);

// METHODS
const oGroupUserList = reactive({ data: [] });
const fnApiGetGroupUsers = (gid) => {
  console.log(gid, gid !== 'add');
  if (gid !== 'add') {
    apiGetGroupUsers(gid)
      .then((res) => {
        if (res.status === 200) {
          oGroupUserList.data = [];
          // console.log('is 200', res.data.users);
          const ary = [];
          res.data.users.forEach((item) => {
            // console.log('item is ', item);
            ary.push({
              user_id: filterId(item.id),
              user_name: item.name,
              user_status: filterStatus(item.status)
            });
          });
          // // console.log(`apiGetGroupUsers(${gid}) res.data is`, data);
          oGroupUserList.data = ary;
          if (oGroupUserList.data.length === 0) {
            sDefEmptyText.value = 'This group has no members yet.';
          }
          // console.log('oGroupUserList.data is ', oGroupUserList.data);
        }
      })
      .catch((err) => {
        console.log('%cfnApiGetGroupUsers err ', 'color: red');
        console.log(err.response);
        fnApiErred();
      });
  } else {
    // oGroupUserList
    console.log('is add');
  }
};
const filterId = (id) => {
  const length = String(id).length;
  switch (length) {
    case 1:
      return '00' + id;
    case 2:
      return '0' + id;
    default:
  }
};
const filterStatus = (num) => {
  switch (num) {
    case 2:
      return 'Non-approved';
    case 0:
      return 'Expired';
    default:
      return 'Active';
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle';
@import '@/assets/style/userManagerment/groupSetting/groupSetting.scss';
</style>
