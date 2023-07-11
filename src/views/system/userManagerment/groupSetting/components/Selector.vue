<template>
  <n-select v-model:value="bSelectedGroupID" :options="oOptions.data" @click="fnApiGetGroupList" />
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
  apiGetGroupList
  // some
} from '@/api/axios/system/userInfo/groupSetting.js';

// VARABLE
const bSelectedGroupID = ref(null);
const oOptions = reactive({ data: [] });
// const oSelectOtions = reactive({ data: [] });

onMounted(() => {
  fnApiGetGroupList();
  // console.log('props.propsChangeSelected', props.propsChangeSelected);
  // if (props.propsChangeSelected !== undefined) {
  //   bSelectedGroupID.value = props.propsChangeSelected;
  // }
});

const fnApiGetGroupList = () => {
  apiGetGroupList()
    .then((res) => {
      if (res.status === 200) {
        // console.log('fnApiGetGroupList res.data is ', res.data);
        let aryNaive = [
          {
            label: 'Please Select',
            value: '0',
            disabled: true
          }
        ];
        // let ary = [];
        res.data.groups.forEach((item) => {
          aryNaive.push({
            label: item.name,
            value: item.id
          });
          // ary.push({
          //   group_name: item.name,
          //   group_id: item.id,
          //   permission_id: item.permission_id
          // });
        });
        console.log('aryNaive is ', aryNaive);
        // console.log('ary is ', ary);
        console.log('props.propsChangeSelected', props.propsChangeSelected);
        bSelectedGroupID.value = props.propsChangeSelected;
        oOptions.data = aryNaive;
        // oSelectOtions.data = ary;
      } else {
        alert(res.status);
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

// PROPS
const props = defineProps({
  propsChangeSelected: {
    type: String
    // default: 'Default Title'
  }
});

// watch(
//   () => props.propsChangeDelected,
//   (newVal) => {

//   }
// );

// EMIT
const emit = defineEmits({
  emit_selected_option: null
});

watch(bSelectedGroupID, (newVal) => {
  oOptions.data.forEach((item) => {
    if (item.value === newVal) {
      // console.log(item);
      emit('emit_selected_option', item);
    }
  });
});
</script>

<style lang="sass" scoped></style>
