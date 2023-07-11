<template>
  <div class="float_box">
    <div class="btn is_small is_back" @click="fnGoPage('back')">
      <img src="@/assets/images/publicImages/icon_back.svg" />
      Back
    </div>
    <div
      v-print="{ id: '#list_print', popTitle: sPrintTitle }"
      type="primary"
      class="btn is_small is_back"
      @click="fnChangePrintBW(true)"
    >
      <img src="@/assets/images/publicImages/icon_print.svg" />
      Print
    </div>
    <!-- <div
      v-print="{ id: '#list_print', popTitle: sPrintTitle }"
      type="primary"
      class="btn is_small is_back"
      @click="fnChangePrintBW(true)"
    >
      <img src="@/assets/images/publicImages/icon_print.svg" />
      Print for B/W
    </div> -->
    <!-- <btnPdf /> -->
  </div>
  <div class="outbox">
    <!-- <Download-excel :data="json_data"> Download Excel</Download-excel> -->
    <div class="rootbox">
      <div class="uutlistbox">
        <div class="title">SEARCH Report Orders</div>
        <div>
          <div class="title">UUT List</div>
          <ul class="labelbox">
            <li
              v-for="(id, seq) in aLabelUut.data"
              :key="seq + id"
              :class="[{ active: nLabelUutCurrent === seq }]"
              @click="fnChangeUutId(id, seq)"
            >
              UUT {{ id }}
            </li>
          </ul>
        </div>
      </div>
      <div class="uuttitlebox">
        <div class="title">UUT1 Run List</div>
        <ul class="labelbox">
          <li
            v-for="(id, seq) in aLabelRun"
            :key="seq + seq + id"
            :class="[{ active: nLabelRunCurrent === seq }]"
            @click="fnChangeRunId(id, seq)"
          >
            run {{ id }}
          </li>
        </ul>
      </div>
    </div>
    <div id="list_print">
      <img src="@/assets/images/publicImages/logo_black.svg" class="p_logo" />
      <span class="sysmsg">{{ sPrintTitle }}</span>
      <div class="itembox">
        <h2 class="unittitle is_uut_basic"><span>UUT Base Info</span></h2>
        <TableH :props-obj="oUutBasicinfoTableH" />
      </div>
      <!-- v InputOutputTest id=23 -->
      <InputOutputTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemInputOutputTestRunId" />
      <!-- v HoldUpTest id=24 -->
      <HoldUpTest
        :props-uut-id="nCurrentUutId"
        :props-run-id="oItemRunId.data.nItemHoldUpTestRunId"
        :props-print-b-w="bPrintBW"
      />
      <!-- v InputCurrentTest id=25 -->
      <InputCurrentTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemInputCurrentTestRunId" />
      <!-- v PowerEfficiencyTest id=27 -->
      <PowerEfficiencyTest
        :props-uut-id="nCurrentUutId"
        :props-run-id="oItemRunId.data.nItemPowerEfficiencyTestRunId"
      />
      <!-- v StaticTest id=28 -->
      <StaticTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemStaticTestTestRunId" />
      <!-- v InrushCurrentTest id=29 -->
      <InrushCurrentTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemInrushCurrentTestRunId" />
      <!-- v VoltageRegulationTest id=30 -->
      <VoltageRegulationTest
        :props-uut-id="nCurrentUutId"
        :props-run-id="oItemRunId.data.nItemVoltageRegulationTestRunId"
      />
      <!-- v NoiseTest id=31 -->
      <NoiseTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemNoiseTestRunId" />
      <!-- v DynamicTest1 id=32 -->
      <DynamicTest1 :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemDynamicTest1RunId" />
      <!-- v TurnOnTest id=34 -->
      <TurnOnTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemTurnOnTestRunId" />
      <!-- v OvershootVoltageTest id=35 -->
      <OvershootVoltageTest
        :props-uut-id="nCurrentUutId"
        :props-run-id="oItemRunId.data.nItemOvershootVoltageTestRunId"
      />
      <!-- v ShortCircuitTest id=36 -->
      <ShortCircuitTest :props-uut-id="nCurrentUutId" :props-run-id="oItemRunId.data.nItemShortCircuitTestTestRunId" />
      <!-- v END -->
      <div class="report_end">( end of report )</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportGeneratorDetail'
};
</script>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch
  // some
} from 'vue';
import {
  useRouter
  // some
} from 'vue-router';

import TableH from './components/TableHorizontal.vue';

import InputOutputTest from './components/itemReports/InputOutputTest.vue'; //1
import HoldUpTest from './components/itemReports/HoldUpTest.vue'; //2
import InputCurrentTest from './components/itemReports/InputCurrentTest.vue'; //3
import PowerEfficiencyTest from './components/itemReports/PowerEfficiencyTest.vue'; //4
import StaticTest from './components/itemReports/StaticTest.vue'; //5
import InrushCurrentTest from './components/itemReports/InrushCurrentTest.vue'; //6
import VoltageRegulationTest from './components/itemReports/VoltageRegulationTest.vue'; //7
import NoiseTest from './components/itemReports/NoiseTest.vue'; //8
import DynamicTest1 from './components/itemReports/DynamicTest1.vue'; //9
//import DynamicTest2 from './components/itemReports/DynamicTest2.vue'; //10
import TurnOnTest from './components/itemReports/TurnOnTest.vue'; //11
import OvershootVoltageTest from './components/itemReports/OvershootVoltageTest.vue'; //12
import ShortCircuitTest from './components/itemReports/ShortCircuitTest.vue'; //13
//import ShortCurrentTest from './components/itemReports/ShortCurrentTest.vue'; //14

// import DemoItem from './components/itemReports/DemoItem.vue';
// import DemoItem2 from './components/itemReports/DemoItem2.vue';

// Component
// import btnPdf from './components/PrintPdf.vue';

// Store
// import { useRgStore } from '@/stores/basic/reportGenerator/reportGeneratorIndex.js';
// const store = useRgStore();

// Common
import { fnInitApiToken, fnDateFormate } from '@/common/index.js';

// STORE
import { useRgDetailStore } from '@/stores/basic/reportGenerator/reportGeneratorDetail.js';
const store = useRgDetailStore();

const oResult1TableV = reactive({ data: {} });
oResult1TableV.data = {
  passFail: 'pass',
  // passFail: ['', false, false, true, false, false],
  unit: ['', 'A', 'A', 'A'],
  val: []
};
const ary1 = [
  ['Iout', 'Value', 'High Limit', 'Low Limit'],
  ['+5V', 'AAAAA', 'AAAAA', 'AAAAA'],
  ['+12V', 'AAAAA', 'AAAAA', 'AAAAA'],
  ['-12V', 'AAAAA', 'AAAAA', 'AAAAA'],
  ['+3.3V', 'AAAAA', 'AAAAA', 'AAAAA'],
  ['+5VSB', 'AAAAA', 'AAAAA', 'AAAAA']
];

for (let i = 1; i <= 8; i++) {
  ary1.forEach((item) => {
    oResult1TableV.data.val.push(item);
  });
}

//
const oUutDetail = reactive({ data: [] });

// 渲染 btn 用
// const aLabelUut = ref(['UUT 1', 'UUT 2', 'UUT 3']);
const aLabelUut = reactive({ data: [] });
const aLabelRun = ref([]);

// label li 加 .active 用
const nLabelUutCurrent = ref(0);
const nLabelRunCurrent = ref(0);

// label 點擊實際取得的 uut/run id
const nCurrentUutId = ref(0);
const nCurrentRunId = ref(0);

const bUrlProperty = ref(false);

// RG(d) 黑白列印用 (here -> itemsCpn x->x perItem)
const bPrintBW = ref(false);
const sPrintTitle = ref('GWInstek Auto Test System');
const fnChangePrintBW = (boolean) => {
  console.log('before ref from vue', bPrintBW.value);
  console.log('before ref from stor', store.bPrintBW);
  store.fnChangePrintBW(boolean);
  bPrintBW.value = boolean;
  console.log('afterr ref from stor', store.bPrintBW);
};

onMounted(() => {
  fnInitApiToken();
  const url = location.href;
  // http://127.0.0.1:5173/basic/reportgenerator/detail?uut_id=5&run_number=1
  if (/uut_id=/.test(url)) {
    bUrlProperty.value = true;
    const ary = url.split('uut_id=')[1].split('&run_number=');
    // 渲染 label
    aLabelUut.data.push(ary[0]);
    aLabelRun.value.push(ary[1]);
    // 觸發 watch 取 Uut Base Info 值
    nCurrentUutId.value = ary[0];
    nCurrentRunId.value = ary[1];
    // 渲染報告
    fnApiItemListAction(nCurrentUutId.value, nCurrentRunId.value, bUrlProperty.value);
  } else {
    oUutDetail.data = JSON.parse(window.localStorage.getItem('reprtDetail'));
    console.log('JSON.parse.localstorage(oUutDetail) is', oUutDetail);
    oUutDetail.data.forEach((item, i) => {
      aLabelUut.data.push(item.uut_id);
      if (i === 0) {
        item.run_list.forEach((jtem) => {
          aLabelRun.value.push(jtem.run_number);
        });
      }
    });

    // INIT
    nCurrentUutId.value = oUutDetail.data[0].uut_id;
    nCurrentRunId.value = oUutDetail.data[0].run_list[0].run_number;
    console.log('%cuutid ' + nCurrentUutId.value + '/runnumber ' + nCurrentRunId.value, 'color:yellow');
    fnApiItemListAction(nCurrentUutId.value, nCurrentRunId.value);
  }
});

const fnApiItemListAction = (uut_id, run_number, bUrlProperty) => {
  store
    .fnApiItemList({ uut_id, run_number }, bUrlProperty)
    .then(() => {
      const res = store.fnApiItemListRes.data;
      console.log('store.fnApiItemListRes is', res);
      //
      oUutBasicinfoTableH.val[10][1] = res.uutBaseInfo.user_account;
      //
      // aItemRunsList.value = [];
      // aItemRunsList.value = res.itemRunsList;
      console.log('vueStroe aItemRunsList is', aItemRunsList.value);
      oItemRunId.data = res.itemId;
    })
    .catch(() => {});
};

const aItemRunsList = ref([]);

watch(
  () => nCurrentUutId.value,
  (newVal) => {
    if (!bUrlProperty.value) {
      const uutIndex = oUutDetail.data.findIndex((item) => {
        return item.uut_id === newVal;
      });
      const data = oUutDetail.data[uutIndex];
      oUutBasicinfoTableH.val[1][1] = data.uut_name;
      oUutBasicinfoTableH.val[2][1] = data.serial_no;
      oUutBasicinfoTableH.val[3][1] = data.model_no;
      oUutBasicinfoTableH.val[4][1] = data.order_no;
      oUutBasicinfoTableH.val[5][1] = data.program_name;
    } else {
      console.log('bUrlProperty true UutId');
    }
  }
);

watch(
  () => nCurrentRunId.value,
  (newVal) => {
    if (!bUrlProperty.value) {
      const uutIndex = oUutDetail.data.findIndex((item) => {
        return item.uut_id === nCurrentUutId.value;
      });
      const runIndex = oUutDetail.data[uutIndex].run_list.findIndex((item) => item.run_number == newVal);
      const data = oUutDetail.data[uutIndex].run_list[runIndex];
      oUutBasicinfoTableH.val[6][1] = data.runs_total;
      oUutBasicinfoTableH.val[7][1] = nCurrentRunId.value;
      oUutBasicinfoTableH.val[8][1] = fnDateFormate(data.runs_start_at);
      oUutBasicinfoTableH.val[9][1] = fnDateFormate(data.runs_end_at);
    } else {
      console.log('bUrlProperty true RunId');
    }
  }
);

const fnChangeUutId = (id, seq) => {
  nCurrentUutId.value = id;
  nLabelUutCurrent.value = seq;
  console.log('%cnCurrentUutId.value is' + nCurrentUutId.value, 'color:pink');
  nLabelRunCurrent.value = 0;
  const index = oUutDetail.data.findIndex((item) => {
    console.log('index item', item);
    if (item.uut_id === id) {
      nCurrentRunId.value = item.run_list[0].run_number;
    }
    return item.uut_id === id;
  });
  aLabelRun.value = [];
  oUutDetail.data[index].run_list.forEach((item) => {
    aLabelRun.value.push(item.run_number);
  });
  console.log('%cuutid ' + nCurrentUutId.value + '/runnumber ' + aLabelRun.value[0], 'color:yellow');

  fnApiItemListAction(nCurrentUutId.value, aLabelRun.value[0]);
};

const oItemRunId = reactive({
  data: {
    nItemInputOutputTestRunId: null,
    nItemHoldUpTestRunId: null,
    nItemInputCurrentTestRunId: null,
    nItemPowerEfficiencyTestRunId: null,
    nItemStaticTestTestRunId: null,
    nItemInrushCurrentTestRunId: null,
    nItemVoltageRegulationTestRunId: null,
    nItemNoiseTestRunId: null,
    nItemDynamicTest1RunId: null,
    nItemTurnOnTestRunId: null,
    nItemOvershootVoltageTestRunId: null,
    nItemShortCircuitTestTestRunId: null
  }
});

const fnChangeRunId = (id, seq) => {
  nCurrentRunId.value = id;
  nLabelRunCurrent.value = seq;
  console.log('%cuutid ' + nCurrentUutId.value + '/runnumber ' + nCurrentRunId.value, 'color:yellow');
  fnApiItemListAction(nCurrentUutId.value, nCurrentRunId.value);
};

const oUutBasicinfoTableH = reactive({
  unit: [''],
  val: [
    ['Station', 'GWInstek Auto Test System'],
    // from uut
    ['UUT Name', ''], //1
    ['Serial No.', ''], //2
    ['Model No.', ''], //3
    ['Order No.', ''], //4
    ['Program', ''], //5
    // from Runs
    ['Items Run Total', null], //6
    ['Run Times', null], //7
    ['Start Time', ''], //8
    ['End Time', ''], //9
    ['User', ''], //10 在 api 取得 run item list 中 ***

    ['', '']
  ]
});

const router = useRouter();
const fnGoPage = () => {
  // router.push({ name: 'ReportGeneratorIndex' });
  router.go(-1);
};

// EXCEL DEMO
// const json_data = ref([
//   {
//     Output: 'Pout',
//     '+5v': '59.500 W',
//     '+12v': '525.310 W',
//     '-12v': '3.100 W',
//     '+5VSB': '9.740 W',
//     Total: '634.880 W'
//   },
//   {
//     Output: 'Pin',
//     '+5v': '59.500 W',
//     '+12v': '525.310 W',
//     '-12v': '3.100 W',
//     '+5VSB': '9.740 W',
//     Total: '634.880 W'
//   }
// ]);
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorPublic.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorDetail.scss';
</style>

<style lang="scss">
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/basic/reportGenerator/reportGenerator_naive.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorPrint.scss';
</style>
