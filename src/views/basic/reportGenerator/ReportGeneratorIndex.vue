<template>
  <!-- UI LEFT -->
  <div class="leftBox">
    <div class="title">SEARCH Report Orders</div>
    <div class="tableBox">
      <div class="row">
        <div class="row_left">UUT</div>
        <div class="row_right">
          <n-input v-model:value="sUutName" size="tiny" class="selectbox_input" />
        </div>
      </div>
      <div class="row">
        <div class="row_left">Model No.</div>
        <div class="row_right">
          <n-input v-model:value="sModelNo" size="tiny" class="selectbox_input" />
        </div>
      </div>
      <div class="row">
        <div class="row_left">Serial No.</div>
        <div class="row_right">
          <n-input v-model:value="sSerialNo" size="tiny" class="selectbox_input" />
        </div>
      </div>
      <div class="row">
        <div class="row_left">Order No.</div>
        <div class="row_right">
          <n-input v-model:value="sOrderNo" size="tiny" class="selectbox_input" />
        </div>
      </div>
      <div class="row">
        <div class="row_left">Test Program</div>
        <div class="row_right">
          <n-select v-model:value="nCurrentTpId" class="uutbasic_select" size="tiny" :options="oOptionsTpList.data" />
        </div>
      </div>
      <div class="row">
        <div class="row_left">Filter Date</div>
        <div class="row_right">
          <n-checkbox v-model:checked="bFilterDate" />
        </div>
      </div>
      <div v-if="bFilterDate" class="row">
        <div class="row_left">Date Range</div>
        <div class="row_right">
          <n-date-picker v-model:value="aDateRange" type="daterange" clearable size="small" />
        </div>
      </div>
    </div>
    <div class="btnBox">
      <a class="btn is_small for_search" style="margin-right: 15px" @click="fnClean">
        <img src="@/assets/images/publicImages/icon_search.svg" />
        Clean
      </a>
      <a class="btn is_small for_search" @click="fnSearch">
        <img src="@/assets/images/publicImages/icon_search.svg" />
        Search
      </a>
    </div>
  </div>
  <!-- UI RIGHT -->
  <div class="rightBox">
    <div class="title">Searched Reports List</div>
    <ul class="labelbox">
      <li v-for="(item, i) in aLabelRoot" :key="i + item" @click="fnChangeLabelCurrentRoot(i)">
        {{ item }}
      </li>
    </ul>
    <div v-if="oSearchedReportsList.data.length" class="listbox">
      <div v-for="(item, i) in oSearchedReportsList.data" :key="item.serialNo">
        <div class="listbox_item_title">
          <span class="is_3" :title="item.model_no + ' / ' + item.serial_no">
            <span class="title">M/S/O No. :</span>
            {{ item.model_no }} / {{ item.serial_no }} / {{ item.order_no }}
          </span>
          <span class="is_1"><span class="title">UUT :</span>{{ item.uut_name }} ({{ item.uut_id }})</span>
          <span class="is_2"><span class="title">program :</span>{{ item.program_name }}</span>
        </div>
        <div class="listbox_item_card">
          <div class="listbox_item_card_title">
            <span class="is_21">No.</span>
            <span class="is_22">Run Times</span>
            <span class="is_23">Total / Pass / Fail</span>
            <span class="is_24">Date</span>
            <span class="is_25">Export</span>
          </div>
          <ul class="listbox_item_card_list">
            <li v-for="(jtem, j) in item.run_list" :key="jtem.run_number" class="listbox_item_card_list_item">
              <span class="is_21">{{ fnCountNo(i, j) }}</span>
              <!-- <span class="is_21">{{ j + 1 }}</span> -->
              <span class="is_22">{{ jtem.run_number }}</span>
              <span class="is_23">
                ({{ fnAddZero(jtem.runs_total) }}) {{ fnAddZero(jtem.runs_pass) }} / {{ fnAddZero(jtem.runs_fail) }}
                <!-- / {{ jtem.runs_pending }} / {{ jtem.runs_abort }} -->
              </span>
              <span class="is_24">{{ jtem.runs_end_at !== null ? jtem.runs_end_at : '(data is empty)' }}</span>
              <span class="is_25"><n-checkbox v-model:checked="jtem.export" /></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="listbox">{{ sDefEmptyResultText }}</div>
    <div class="groupBox">
      <div class="tableBox">
        <div class="row">
          <div class="row_left">Report Formate</div>
          <div class="row_right">
            <n-select v-model:value="nCurrentFormat" class="uutbasic_select" size="tiny" :options="oOptionsFormat" />
          </div>
        </div>
      </div>
      <a class="btn is_small for_report" @click="fnGoPage">
        <img src="@/assets/images/publicImages/icon_search.svg" />
        Show Report
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportGeneratorIndex'
};
</script>

<script setup>
import {
  ref,
  reactive,
  onMounted
  // computed
  //some
} from 'vue';

// ROUTER
import { useRouter } from 'vue-router';

// STORE
import { useRgStore } from '@/stores/basic/reportGenerator/reportGeneratorIndex.js';

// API Common
import { fnInitApiToken } from '@/common/index.js';

const router = useRouter();
const store = useRgStore();

onMounted(() => {
  fnInitApiToken();
  store.fnApiTpList().then(() => {
    oOptionsTpList.data = [];
    store.apiTpListRes.data.forEach((item) => {
      oOptionsTpList.data.push(item);
    });
  });
});

const fnGoPage = () => {
  let count = 0;
  let ary = [];

  oSearchedReportsList.data.forEach((item) => {
    let obj = { run_list: [] };

    // 先有 run_list
    item.run_list.forEach((jtem) => {
      if (jtem.export) {
        count++;
        obj.run_list.push({
          runs_total: jtem.runs_total,
          run_number: jtem.run_number,
          runs_start_at: jtem.runs_start_at,
          runs_end_at: jtem.runs_end_at
        });
      }
    });

    // 再返回 "補" 第一層資訊
    if (obj.run_list.length > 0) {
      obj.uut_name = item.uut_name;
      obj.serial_no = item.serial_no;
      obj.model_no = item.model_no;
      obj.order_no = item.order_no;
      obj.program_name = item.program_name;
      obj.uut_id = item.uut_id;
      ary.push(obj);
    }
  });

  if (count > 0) {
    window.localStorage.setItem('reprtDetail', JSON.stringify(ary));
    console.log('JSON.parse.localstorage ary is', JSON.parse(window.localStorage.getItem('reprtDetail')));
    // FOR DEV
    router.push({ name: 'ReportGeneratorDetail' });
  } else {
    alert('pleash checked any one report');
  }
};

// ==========================================
// == LEFT
// ==========================================
const sUutName = ref('');
const sModelNo = ref('');
const sSerialNo = ref('');
const sOrderNo = ref('');
const nCurrentTpId = ref();
// FOR DEV
// sSerialNo.value = 'try_fail';
// nCurrentTpId.value = 2;
// ----
// const oOptionsTpList = computed(() => {
//   return store.dataTpList;
// });
const oOptionsTpList = reactive({ data: [] });

const aDateRange = ref([Date.now() - 86400000, Date.now()]);
// const aDateRange = [Date.now(), Date.now()];
const bFilterDate = ref(false);

// --------------------------------
// -- SUBMIT SEARCH BTN
// --------------------------------
const fnSearchActive = () => {
  const obj = {
    all_run_number: 1
  };

  // UUT NAME
  console.log('sUutName.value is', sUutName.value);
  if (sUutName.value !== '') {
    obj['uut_name'] = '%' + sUutName.value + '%';
  }

  // MODEL
  if (sModelNo.value !== '') {
    obj['uut_model'] = '%' + sModelNo.value + '%';
  }

  // SERIAL
  if (sSerialNo.value !== '') {
    obj['serial_number'] = '%' + sSerialNo.value + '%';
  }

  // ORDER
  if (sOrderNo.value !== '') {
    obj['batch_number'] = '%' + sOrderNo.value + '%';
  }

  // TP
  if (nCurrentTpId.value !== 0) {
    obj['program_id'] = nCurrentTpId.value;
  }

  // DATE RANGE
  if (bFilterDate.value) {
    console.log('aDateRange.value is', aDateRange.value);
    const fnLength = (n) => {
      const l = String(n).length;
      return l === 1 ? '0' + n : n;
    };
    const dateStart = new Date(aDateRange.value[0]);
    const start =
      dateStart.getFullYear() + '-' + fnLength(dateStart.getMonth() + 1) + '-' + fnLength(dateStart.getDate());
    const dateEnd = new Date(aDateRange.value[1]);
    const end = dateEnd.getFullYear() + '-' + fnLength(dateEnd.getMonth() + 1) + '-' + fnLength(dateEnd.getDate());
    // const start = new Date(aDateRange.value[0]).toISOString().slice(0, 10);
    // const end = new Date(aDateRange.value[1]).toISOString().slice(0, 10);
    console.log('start is', start, '/end is', end);

    obj['run_at_date_start'] = start;
    obj['run_at_date_end'] = end;
  }

  store.fnApiSearch(obj).then(() => {
    oSearchedReportsList.data = [];
    store.apiSearchRes.data.forEach((item) => {
      oSearchedReportsList.data.push(item);
    });
  });

  if (oSearchedReportsList.data.length === 0) {
    sDefEmptyResultText.value = '搜尋無結果';
  }

  console.log('oSearchedReportsList.data is', oSearchedReportsList.data);
};

const fnSearch = () => {
  if (fnCheckEmpty()) {
    alert('Do not empty all');
    return false;
  }
  fnSearchActive();
};

// FOR DEV
// setTimeout(() => {
//   fnSearch();
// }, 100);

const fnCheckEmpty = () => {
  return (
    sUutName.value === '' &&
    sModelNo.value === '' &&
    sSerialNo.value === '' &&
    sOrderNo.value === '' &&
    nCurrentTpId.value === 0 &&
    bFilterDate.value === false
  );
};

const fnClean = () => {
  sUutName.value = '';
  sModelNo.value = '';
  sSerialNo.value = '';
  sOrderNo.value = '';
  nCurrentTpId.value = 0;
  bFilterDate.value = false;
  aDateRange.value = [Date.now() - 86400000, Date.now()];
};

// 給 No. 跨 block 排序
let no = 1;
const fnCountNo = (i, j) => {
  if (i === 0 && j === 0) {
    no = 1;
  } else {
    no++;
  }
  return no;
};

// ==========================================
// == RIGHT
// ==========================================
// --------------------------------
// -- init
// --------------------------------
const sDefEmptyResultText = ref('請先於左列輸入搜尋條件');

// --------------------------------
// -- LABEL
// -- SEARCHED REPORT LIST
// --------------------------------
const oSearchedReportsList = reactive({ data: [] });
const aLabelRoot = ref(['Pass Only', 'Fail Only', 'Select All', 'UnSelect All']);
const fnChangeLabelCurrentRoot = (i) => {
  const fnClean = () => {
    oSearchedReportsList.data.forEach((item) => {
      item.run_list.forEach((jtem) => {
        jtem.export = false;
      });
    });
  };
  switch (i) {
    case 0:
      fnClean();
      oSearchedReportsList.data.forEach((item) => {
        item.run_list.forEach((jtem) => {
          if (Number(jtem.runs_total) === Number(jtem.runs_pass)) {
            jtem.export = true;
          }
        });
      });
      break;
    case 1:
      fnClean();
      oSearchedReportsList.data.forEach((item) => {
        item.run_list.forEach((jtem) => {
          if (Number(jtem.runs_pass) === 0) {
            jtem.export = true;
          }
        });
      });
      break;
    case 2:
      oSearchedReportsList.data.forEach((item) => {
        item.run_list.forEach((jtem) => {
          jtem.export = true;
        });
      });
      break;
    case 3:
      fnClean();
      break;
    default:
  }
  // console.log('now is active ' + i);
};

// --------------------------------
// -- FORMATE
// --------------------------------
const nCurrentFormat = ref(1);
const oOptionsFormat = reactive([
  {
    label: 'please select',
    value: 0,
    disabled: true
  },
  {
    label: 'GW classic',
    value: 1
  }
]);

// --------------------------------
// --
// --------------------------------
const fnAddZero = (n) => {
  const length = String(n).length;
  let show = n;
  if (length < 2) {
    show = '0' + show;
  }
  return show;
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorPublic.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorIndex.scss';
</style>

<style lang="scss">
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/basic/reportGenerator/reportGenerator_naive.scss';
</style>
