<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 7 ' + sItemName"
    :props-pass-fail="bPassFail"
    :props-result-only="props.propsResultOnly"
  >
    <template #condition>
      <TableH :props-obj="oCondition1TableH.data" />
      <TableH :props-obj="oCondition2TableH.data" />
      <TableV :props-obj="oCondition3TableV.data" />
    </template>
    <template #measurement>
      <TableV :props-obj="oMeasure1TableV.data" />
      <TableV :props-obj="oMeasure2TableV.data" />
    </template>
    <template #result>
      <TableV :props-obj="oResult1TableV.data" />
      <!-- <TableV :props-obj="oResult2TableV.data" /> -->
      <!-- <TableH :props-obj="oResult3TableH.data" /> -->
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 7 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'VoltageRegulationTest'
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
  }
});

watch(
  () => props.propsRunId,
  (newRunId) => {
    console.log('%cVoltageRegulationTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
            ['Vin', data.line_vectors[0].voltage],
            ['Fin', data.line_vectors[0].freq],
            ['Phase', '0'],
            ['Turn On Delay', data.delay[0].value * 1000]
          ]
        };
        oCondition2TableH.data = {
          unit: ['V', 'Hz', 'deg', 'ms'],
          val: [
            ['Vin', data.line_vectors[1].voltage],
            ['Fin', data.line_vectors[1].freq],
            ['Phase', '0'],
            ['Turn On Delay', data.delay[1].value * 1000]
          ]
        };

        // --
        const Von = data.load_vectors[0]['VoltageRegulationTest20.init.response'].split(',');
        const mode = data.load_vectors[0]['VoltageRegulationTest20.channel'].split(',');
        const value = data.load_vectors[0]['VoltageRegulationTest20.cur.stat.l1'].split(',');

        oCondition3TableV.data = {
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
        const gdmv = data.gdmv;

        oMeasure1TableV.data = {
          unit: ['', 'V', 'V', 'V', 'V', 'V'],
          val: [
            ['', '+5V', '+12V', '-12V', '+3.3V', '+5VSB'],
            [
              'Vout1(90V)',
              fnRound3(gdmv['+5V'][0].val),
              fnRound3(gdmv['+12V'][0].val),
              fnRound3(gdmv['-12V'][0].val),
              fnRound3(gdmv['+3.3V'][0].val),
              fnRound3(gdmv['+5VSB'][0].val)
            ],
            [
              'Vout2(115V)',
              fnRound3(gdmv['+5V'][1].val),
              fnRound3(gdmv['+12V'][1].val),
              fnRound3(gdmv['-12V'][1].val),
              fnRound3(gdmv['+3.3V'][1].val),
              fnRound3(gdmv['+5VSB'][1].val)
            ]
          ]
        };

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const result = data.result;
        const aResultPassfail1 = [''];
        result.passfail.forEach((item) => {
          aResultPassfail1.push(item);
        });
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 'mV', 'mV', 'mV'],
          val: [
            ['|Vout1 - Vout2|', 'Value', 'High Limit', 'Low Limit'],
            [
              '+5V',
              fnRound3(result.difference[0] * 1000, 14),
              fnRound3(result.maximum[0]),
              fnRound3(result.minimum[0])
            ],
            [
              '+12V',
              fnRound3(result.difference[1] * 1000, 14),
              fnRound3(result.maximum[1]),
              fnRound3(result.minimum[1])
            ],
            [
              '-12V',
              fnRound3(result.difference[2] * 1000, 14),
              fnRound3(result.maximum[2]),
              fnRound3(result.minimum[2])
            ],
            [
              '+3.3V',
              fnRound3(result.difference[3] * 1000, 14),
              fnRound3(result.maximum[3]),
              fnRound3(result.minimum[3])
            ],
            [
              '+5VSB',
              fnRound3(result.difference[4] * 1000, 14),
              fnRound3(result.maximum[4]),
              fnRound3(result.minimum[4])
            ]
          ]
        };
      })
      .catch(() => {
        console.log('VoltageRegulationTest.vue errrrrrrrrrrrrrrrrrrr');
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
const oCondition2TableH = reactive({ data: {} });
const oCondition3TableV = reactive({ data: {} });

// MEASUREMENT
const oMeasure1TableV = reactive({ data: {} });
const oMeasure2TableV = reactive({ data: {} });

// RESULT
const oResult1TableV = reactive({ data: {} });
// const oResult2TableV = reactive({ data: {} });
// const oResult3TableH = reactive({ data: {} });

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
