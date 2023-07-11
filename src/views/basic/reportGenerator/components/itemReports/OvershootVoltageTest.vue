<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 11 ' + sItemName"
    :props-pass-fail="bPassFail"
    :props-result-only="props.propsResultOnly"
  >
    <template #condition>
      <TableH :props-obj="oCondition1TableH.data" />
      <TableV :props-obj="oCondition2TableV.data" />
    </template>
    <template #measurement>
      <TableV :props-obj="oMeasure1TableV.data" />
      <!-- <TableV :props-obj="oMeasure2TableV.data" /> -->
    </template>
    <template #result>
      <TableV :props-obj="oResult1TableV.data" />
      <h3>Catch Image:</h3>
      <img :src="sResultImage_1" :class="[{ is_print_bw: props.propsPrintBW }]" />
      <!-- <TableV :props-obj="oResult2TableV.data" /> -->
      <!-- <TableH :props-obj="oResult3TableH.data" /> -->
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 12 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'OvershootVoltageTest'
};
</script>

<script setup>
import {
  ref,
  reactive,
  watch
  // some
} from 'vue';

// COMPONENTS
import PerItemReport from '../PerItemReport.vue';
import TableV from '../TableVertical.vue';
import TableH from '../TableHorizontal.vue';

// Common
import {
  fnRound3
  // fnNegativeToPostive
} from '@/common/index.js';

// STORE
import { useRgDetailStore } from '@/stores/basic/reportGenerator/reportGeneratorDetail.js';
const store = useRgDetailStore();

// PROPS
const props = defineProps({
  propsUutId: {
    type: Number,
    default: 2
  },
  propsRunId: {
    type: Number,
    default: 2
  },
  propsResultOnly: {
    type: Boolean,
    default: false
  },
  // RG(d) 黑白列印用
  propsPrintBW: {
    type: Boolean,
    default: true
  }
});

watch(
  () => props.propsRunId,
  (newRunId) => {
    console.log('%cOvershootVoltageTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

    store
      .fnApiResult({ uut_id: props.propsUutId, runs_id: newRunId })
      .then(() => {
        bApiErr.value = false;
        const data = store.fnResultRes.data.results;
        sItemName.value = data.name;
        bPassFail.value = data.passfail.isPass;
        // bPassFail.value = false;

        // --------------------------------
        // CONDITION
        // --------------------------------
        oCondition1TableH.data = {
          unit: ['V', 'Hz', 'deg', 'ms'],
          val: [
            ['Vin', data.line_vectors[1].voltage],
            ['Fin', data.line_vectors[1].freq],
            ['Phase', data.line_vectors[1].onphase]
          ]
        };

        // --
        const Von = data.load_vectors['OvershootVoltageTest20.init.response'].split(',');
        const mode = data.load_vectors['OvershootVoltageTest20.channel'].split(',');
        const value = data.load_vectors['OvershootVoltageTest20.cur.stat.l1'].split(',');

        oCondition2TableV.data = {
          unit: ['', 'V', '', 'A'],
          val: [
            ['Load CH', 'Von', 'Mode', 'Value'],
            ['+5V', fnRound3(Von[0]), mode[0].replace('H', ''), fnRound3(value[0])],
            ['+12V', fnRound3(Von[1]), mode[1].replace('H', ''), fnRound3(value[1])]
            // ['-12V', Von[2], mode[2].replace('H', ''), fnRound3(value[2])],
            // ['+3.3V', Von[3], mode[3].replace('H', ''), fnRound3(value[3])],
            // ['+5VSB', Von[4], mode[4].replace('H', ''), fnRound3(value[4])]
          ]
        };

        // --------------------------------
        // -- MESSAUREMENT
        // --------------------------------

        oMeasure1TableV.data = {
          unit: ['', 'V', 'V'],
          val: [
            ['Load CH', 'V+pk', 'Vhigh'],
            ['+5V', data.scope_records.RAW_CH1['max'], data.scope_records.RAW_CH1['high']],
            ['+12V', data.scope_records.RAW_CH2['max'], data.scope_records.RAW_CH2['high']]
          ]
        };

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        for (let a in data.result) {
          if (a !== 'name') {
            aResultPassfail1.push(data.result[a].passfail);
          }
        }
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', true, false],
          unit: ['', 'V', 'V', 'V'],
          val: [
            ['Vpk-Vhigh', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', data.result['+5V'].diff, data.result['+5V'].max, data.result['+5V'].min],
            ['+12V', data.result['+12V'].diff, data.result['+12V'].max, data.result['+12V'].min]
          ]
        };
        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('OvershootVoltageTest.vue errrrrrrrrrrrrrrrrrrr');
        bApiErr.value = true;
      });
  }
);

// GLOBAL
// eslint-disable-next-line no-unused-vars
const sItemName = ref('');
const bPassFail = ref(null);

// CONDITION
const oCondition1TableH = reactive({ data: {} });
const oCondition2TableV = reactive({ data: {} });

// MEASUREMENT
const oMeasure1TableV = reactive({ data: {} });
// const oMeasure2TableV = reactive({ data: {} });

// RESULT
const oResult1TableV = reactive({ data: {} });
const sResultImage_1 = ref('');
// const oResult2TableV = reactive({ data: {} });
// const oResult3TableH = reactive({ data: {} });

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
