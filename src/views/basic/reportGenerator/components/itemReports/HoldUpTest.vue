<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 2 ' + sItemName"
    :props-pass-fail="bPassFail"
    :props-measuree-show="false"
  >
    <template #condition>
      <TableH :props-obj="oCondition1TableH.data" />
      <TableV :props-obj="oCondition2TableV.data" />
    </template>
    <template #measurement></template>
    <template #result>
      <TableV :props-obj="oResult1TableV.data" />
      <h3>Catch Image:</h3>
      <img :src="sResultImage_1" :class="[{ is_print_bw: props.propsPrintBW }]" />
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 2 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'HoldUpTest'
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
import { fnRound3 } from '@/common/index.js';

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
    console.log('%cHoldUpTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

    store
      .fnApiResult({ uut_id: props.propsUutId, runs_id: newRunId })
      .then(() => {
        bApiErr.value = false;

        const data = store.fnResultRes.data.results;
        sItemName.value = data.name;
        bPassFail.value = data.passfail.isPass;

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
        const Von = data.load_vectors['HoldUptest20.init.response'].split(',');
        const mode = data.load_vectors['HoldUptest20.channel'].split(',');
        const value = data.load_vectors['HoldUptest20.cur.stat.l1'].split(',');

        oCondition2TableV.data = {
          unit: ['', 'V', '', 'A'],
          val: [
            ['Load CH', 'Von', 'Mode', 'Value'],
            ['+5V', Von[0], mode[0].replace('H', ''), fnRound3(value[0])],
            ['+12V', Von[1], mode[1].replace('H', ''), fnRound3(value[1])],
            ['-12V', Von[2], mode[2].replace('H', ''), fnRound3(value[2])],
            ['+3.3V', Von[3], mode[3].replace('H', ''), fnRound3(value[3])],
            ['+5VSB', Von[4], mode[4].replace('H', ''), fnRound3(value[4])]
          ]
        };

        // --------------------------------
        // -- MESSAUREMENT
        // --------------------------------

        // -- Hold Up Test 特殊，沒有 MESSAUREMENT

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        for (let a in data.result.passfail) {
          aResultPassfail1.push(data.result.passfail[a]);
        }
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', true, false, false, true],
          unit: ['', 'ms', 'ms', 'ms'],
          val: [
            ['Time', 'Value', 'High Limit', 'Low Limit'],
            [
              '+5V',
              fnRound3(data.result.value['+5V'] * 1000),
              fnRound3(data.result.maximum['+5V']),
              fnRound3(data.result.minimum['+5V'])
            ],
            [
              '12V',
              fnRound3(data.result.value['+12V'] * 1000),
              fnRound3(data.result.maximum['+12V']),
              fnRound3(data.result.minimum['+12V'])
            ],
            [
              '-12V',
              fnRound3(data.result.value['-12V'] * 1000),
              fnRound3(data.result.maximum['-12V']),
              fnRound3(data.result.minimum['-12V'])
            ],
            [
              '3.3V',
              fnRound3(data.result.value['+3.3V'] * 1000),
              fnRound3(data.result.maximum['+3.3V']),
              fnRound3(data.result.minimum['+3.3V'])
            ]
          ]
        };

        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('HoldUpTest.vue errrrrrrrrrrrrrrrrrrr');
        bApiErr.value = true;
      });
  }
);

// GLOBAL
const sItemName = ref('');
const bPassFail = ref(null);

// CONDITION
const oCondition1TableH = reactive({ data: {} });
const oCondition2TableV = reactive({ data: {} });

// MEASUREMENT
// (hold up test 沒 measurement)

// RESULT
const oResult1TableV = reactive({ data: {} });
const sResultImage_1 = ref('');

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
