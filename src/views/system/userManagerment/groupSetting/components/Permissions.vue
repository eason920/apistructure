<!-- eslint-disable vue/valid-v-for -->
<template>
  <h6 class="title">Permission</h6>
  <!-- TEST -->
  <div class="permission_group">
    <h6 class="title">Test</h6>
    <n-checkbox-group v-model:value="aCheckedTest" @update:value="fnSandObj">
      <n-space item-style="display: flex;">
        <n-checkbox
          v-for="item in oPMSTest"
          key="item.db"
          :value="item.db"
          :label="item.show"
          :disabled="props.propsCheckboxEditable"
        />
      </n-space>
    </n-checkbox-group>
  </div>
  <!-- OPERATION -->
  <div class="permission_group">
    <h6 class="title">Operation</h6>
    <n-checkbox-group v-model:value="aCheckedOperation" @update:value="fnSandObj">
      <n-space item-style="display: flex;">
        <n-checkbox
          v-for="item in oPMSOperation"
          key="item.db"
          :value="item.db"
          :label="item.show"
          :disabled="props.propsCheckboxEditable"
        />
      </n-space>
    </n-checkbox-group>
  </div>
  <!-- MANAGEMENT -->
  <div class="permission_group">
    <h6 class="title">Management</h6>
    <n-checkbox-group v-model:value="aCheckedManagement" @update:value="fnSandObj">
      <n-space item-style="display: flex;">
        <n-checkbox
          :value="oPMSManagement1[0].db"
          :label="oPMSManagement1[0].show"
          :disabled="props.propsCheckboxEditable"
        />
        <div class="is_floor2">
          <span>Authority</span>
          <div class="is_floor3">
            <n-checkbox
              v-for="item in oPMSManagement2"
              key="item.db"
              :value="item.db"
              :label="item.show"
              :disabled="props.propsCheckboxEditable"
            />
          </div>
        </div>
        <n-checkbox
          v-for="item in oPMSManagement3"
          key="item.db"
          :value="item.db"
          :label="item.show"
          :disabled="props.propsCheckboxEditable"
        />
      </n-space>
    </n-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'GroupSettingPermissions'
};
</script>

<script setup>
// VUE
import {
  ref,
  reactive,
  onMounted,
  watch
  //some
} from 'vue';

// API
import {
  apiGetGroupList
  // some
} from '@/api/axios/system/userInfo/groupSetting.js';

// for 換 page 時用
onMounted(() => {
  console.log('%c(from cpn pms onMtd) props.propsGroupId is ' + props.propsGroupId, 'color:yellow');
  if (props.propsGroupId !== null) {
    fnApiGetGroupList(props.propsGroupId);
  }
});

// PROPS
const props = defineProps({
  propsCheckboxEditable: {
    type: Boolean,
    default: true
  },
  propsGroupId: {
    type: Number,
    default: 1
  }
});

// for 同頁換 select 時用 (特別是 visit 頁)
watch(
  () => props.propsGroupId,
  (newVal) => {
    console.log('%c(from cpn pms onWh) props.propsGroupId is ' + props.propsGroupId, 'color:yellow');
    fnApiGetGroupList(newVal);
  }
);

// EMIT
const emit = defineEmits({
  emit_pms_update_obj: null
});

const fnSandObj = () => {
  let obj = {
    TestProgram: 0,
    ReportEdit: 0,
    ReportGenerate: 0,
    GoNogo: 0,
    TestItem: 0,
    Statics: 0,
    ReportWizard: 0,
    OnlineControl: 0,
    HWConfigure: 0,
    User: 0,
    ActivityLog: 0,
    ReleaseTestProg: 0,
    UserDefineTestItem: 0,
    Instrument: 0,
    HWConfigFile: 0,
    LogData: 0,
    FixtureId: 0,
    NextExtension: 0
  };
  for (let i in obj) {
    aCheckedTest.value.forEach((j) => {
      if (i === j) obj[i] = 1;
    });
    aCheckedOperation.value.forEach((j) => {
      if (i === j) obj[i] = 1;
    });
    aCheckedManagement.value.forEach((j) => {
      if (i === j) obj[i] = 1;
    });
  }
  emit('emit_pms_update_obj', obj);
};

// GET PERMISSION LIST BY GROUP
const aCheckedTest = ref([]);
const aCheckedOperation = ref([]);
const aCheckedManagement = ref([]);

// FOR UI
const oPMSTest = reactive([
  {
    db: 'TestProgram',
    show: 'Test Program'
  },
  {
    db: 'TestItem',
    show: 'TestItem'
  },
  {
    db: 'ReportEdit',
    show: 'Report Edit'
  }
]);
const oPMSOperation = reactive([
  {
    db: 'GoNogo',
    show: 'Go/Nogo'
  },
  {
    db: 'ReportGenerate',
    show: 'Report Generate'
  },
  {
    db: 'Statics',
    show: 'Statics'
  },
  {
    db: 'OnlineControl',
    show: 'On-line Control'
  }
]);
const oPMSManagement1 = reactive([
  {
    // db: 'UserInfo',
    db: 'User',
    show: 'User Info'
  }
]);
const oPMSManagement2 = reactive([
  {
    // db: 'GroupSetting',
    db: 'User',
    show: 'Group Setting'
  },
  {
    // db: 'UserSetting',
    db: 'User',
    show: 'User Setting'
  }
]);
const oPMSManagement3 = reactive([
  {
    db: 'HWConfigFile',
    show: 'H/W ConfigFile'
  },
  {
    db: 'LogData',
    show: 'Log Data'
  }
]);

// API
const fnApiGetGroupList = (gid) => {
  if (gid == 'add') {
    aCheckedTest.value = [];
    aCheckedOperation.value = [];
    aCheckedManagement.value = [];
  } else {
    apiGetGroupList()
      .then((res) => {
        // console.log('res.status is ', res.status);
        if (res.status === 200) {
          const index = res.data.groups.findIndex((item) => {
            return item.id === gid;
          });
          const obj = res.data.groups[index].permission;

          // AFRESH
          aCheckedTest.value = [];
          aCheckedOperation.value = [];
          aCheckedManagement.value = [];

          // TASK
          for (let item in obj) {
            // console.log(obj[item]);
            if (obj[item] === 1) {
              switch (true) {
                // TEST
                case item === 'TestProgram' || item === 'TestItem' || item === 'ReportEdit':
                  aCheckedTest.value.push(item);
                  break;
                // OPERATION
                case item === 'GoNogo' || item === 'ReportGenerate' || item === 'Statics' || item === 'OnlineControl':
                  aCheckedOperation.value.push(item);
                  break;
                // MANAGEMENT1
                case item === 'User':
                  aCheckedManagement.value.push(item);
                  break;
                // MANAGEMENT2
                // MANAGEMENT3
                case item === 'HWConfigFile' || item === 'LogData':
                  aCheckedManagement.value.push(item);
                  break;
                default:
              }
            }
          }
        } else {
          console.log('status not 200');
        }
      })
      .catch(() => {
        if (props.propsGroupId !== 1) {
          alert('fnApiGetGroupList error');
        } else {
          console.log('propsGroupId is 1');
        }
        // alert(err.response);
      });
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle';
@import '@/assets/style/userManagerment/groupSetting/groupSetting.scss';
</style>
