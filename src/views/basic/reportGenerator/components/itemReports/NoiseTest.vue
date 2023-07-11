<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 8 ' + sItemName"
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
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 8 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'NoiseTest'
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
    console.log('%cNoiseTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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

        // --
        const Von = data.load_vectors['NoiseTestDQ20.init.response'].split(',');
        const mode = data.load_vectors['NoiseTestDQ20.channel'].split(',');
        const value = data.load_vectors['NoiseTestDQ20.cur.stat.l1'].split(',');

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
        // const gpmp = data.gpmp;
        const result = data.result;

        oMeasure1TableV.data = {
          unit: ['', 'V', 'V', 'V', 'V'],
          val: [
            ['', '+5V', '+12V', '-12V', '+3.3V'],
            [
              'Vpk-pk',
              fnRound3(result['+5V'].value),
              fnRound3(result['+12V'].value),
              fnRound3(result['-12V'].value),
              fnRound3(result['+3.3V'].value)
            ]
          ]
        };

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        for (let a in result) {
          aResultPassfail1.push(result[a].passfail);
        }
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 'V', 'V', 'V', 'V'],
          val: [
            ['Vpk-pk', 'value', 'Hight Limit', 'Low Limit'],
            ['+5V', fnRound3(result['+5V'].value), fnRound3(result['+5V'].maximum), fnRound3(result['+5V'].minimum)],
            [
              '+12V',
              fnRound3(result['+12V'].value),
              fnRound3(result['+12V'].maximum),
              fnRound3(result['+12V'].minimum)
            ],
            [
              '-12V',
              fnRound3(result['-12V'].value),
              fnRound3(result['-12V'].maximum),
              fnRound3(result['-12V'].minimum)
            ],
            [
              '-3.3V',
              fnRound3(result['+3.3V'].value),
              fnRound3(result['+3.3V'].maximum),
              fnRound3(result['+3.3V'].minimum)
            ]
          ]
        };
        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('NoiseTest.vue errrrrrrrrrrrrrrrrrrr');
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
