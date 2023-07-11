<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 10 ' + sItemName"
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
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 11 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'TurnOnTest'
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
  //  fnNegativeToPostive
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
    console.log('%cTurnOnTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
            // ['Turn On Delay', sNoData]
          ]
        };

        // --
        const Von = data.load_vectors['TurnOnTest20.init.response'].split(',');
        const mode = data.load_vectors['TurnOnTest20.channel'].split(',');
        const value = data.load_vectors['TurnOnTest20.cur.stat.l1'].split(',');

        oCondition2TableV.data = {
          unit: ['', 'V', '', 'A'],
          val: [
            ['Load CH', 'Von', 'Mode', 'Value'],
            ['+5V', Von[0], mode[0].replace('H', ''), fnRound3(value[0])],
            ['+12V', Von[1], mode[1].replace('H', ''), fnRound3(value[1])],
            ['-12V', Von[2], mode[2].replace('H', ''), fnRound3(value[2])],
            ['+3.3V', Von[3], mode[3].replace('H', ''), fnRound3(value[3])]
            // ['+5VSB', Von[4], mode[4].replace('H', ''), fnRound3(value[4])]
          ]
        };

        // --------------------------------
        // -- MESSAUREMENT
        // --------------------------------
        const result = data.result;

        oMeasure1TableV.data = {
          unit: ['', 's', 's', 's', 's'],
          val: [
            ['', '+5V', '+12V', '-12V', '+3.3V'],
            [
              'Time',
              fnRound3(result.value['+5V']),
              fnRound3(result.value['+12V']),
              fnRound3(result.value['-12V']),
              fnRound3(result.value['+3.3V'])
            ]
          ]
        };

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        for (let a in result.passfail) {
          aResultPassfail1.push(result.passfail[a]);
        }
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 's', 's', 's'],
          val: [
            ['Time', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', fnRound3(result.value['+5V']), fnRound3(result.maximum['+5V']), fnRound3(result.minimum['+5V'])],
            [
              '+12V',
              fnRound3(result.value['+12V']),
              fnRound3(result.maximum['+12V']),
              fnRound3(result.minimum['+12V'])
            ],
            [
              '-12V',
              fnRound3(result.value['-12V']),
              fnRound3(result.maximum['-12V']),
              fnRound3(result.minimum['-12V'])
            ],
            [
              '+3.3V',
              fnRound3(result.value['+3.3V']),
              fnRound3(result.maximum['+3.3V']),
              fnRound3(result.minimum['+3.3V'])
            ]
          ]
        };
        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('TurnOnTest.vue errrrrrrrrrrrrrrrrrrr');
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
const oMeasure1TableV = reactive({ data: {} });
const sResultImage_1 = ref('');
// const oMeasure2TableV = reactive({ data: {} });

// RESULT
const oResult1TableV = reactive({ data: {} });
// const oResult2TableV = reactive({ data: {} });
// const oResult3TableH = reactive({ data: {} });

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
