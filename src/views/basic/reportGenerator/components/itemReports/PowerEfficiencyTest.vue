<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 4 ' + sItemName"
    :props-pass-fail="bPassFail"
    :props-result-only="props.propsResultOnly"
  >
    <template #condition>
      <TableH :props-obj="oCondition1TableH.data" />
      <TableV :props-obj="oCondition2TableV.data" />
    </template>
    <template #measurement>
      <TableV :props-obj="oMeasure1TableV.data" />
      <TableV :props-obj="oMeasure2TableV.data" />
      <TableV :props-obj="oMeasure3TableV.data" />
      <TableV :props-obj="oMeasure4TableV.data" />
    </template>
    <template #result>
      <!-- <TableV :props-obj="oResult1TableV.data" /> -->
      <!-- <TableV :props-obj="oResult2TableV.data" /> -->
      <TableV :props-obj="oResult3TableV.data" />
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 4 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'PowerEfficiencyTest'
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
import { fnRound3, fnNegativeToPostive } from '@/common/index.js';

// STORE
import { useRgDetailStore } from '@/stores/basic/reportGenerator/reportGeneratorDetail.js';
const store = useRgDetailStore();

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
    console.log('%cPowerEfficiencyTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
          unit: ['V', 'Hz', 'deg'],
          val: [
            ['Vin', data.line_vectors[0].voltage],
            ['Fin', data.line_vectors[0].freq],
            ['Phase', '0']
          ]
        };

        // --
        const mode = data.load_vectors['PowerEfficiency20.channel'].split(',');
        const value = data.load_vectors['PowerEfficiency20.cur.stat.l1'].split(',');
        const Von = data.load_vectors['PowerEfficiency20.init.response'].split(',');

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
        const gpmp = data.gpmp;
        const result = data.result;
        // console.log('gpmp is', gpmp);
        // console.log('result is', result);

        oMeasure1TableV.data = {
          unit: ['', 'V', 'A', 'W', '%'],
          val: [
            ['Input', 'Vin', 'Iin', 'Pin', 'PF'],
            ['', fnRound3(gpmp.U.val), fnRound3(gpmp.I.val), fnRound3(gpmp.P.val), fnRound3(gpmp.LAMB.val)]
          ]
        };

        // --
        const gdmv = data.gdmv;
        // console.log('gdmv is', gdmv);
        const loads = data.loads;
        // console.log('load is', loads);
        const valRow2 = ['Vout'];
        const valRow3 = ['Iout'];
        const valRow4 = ['Pout'];
        let ci = 0;
        for (let a in gdmv) {
          const Vout = fnNegativeToPostive(gdmv[a].val);
          const Iout = loads.c.val[ci];
          const count = fnRound3(Vout * Iout);
          // const string = `(I)${Iout} * (v) ${Vout} = ${count}`;
          valRow2.push(Vout);
          valRow3.push(Iout);
          valRow4.push(count);
          ci++;
        }
        valRow4.push(fnRound3(result.value));
        // console.log('total is ', total);
        // console.log('valRow2 is', valRow2);

        oMeasure2TableV.data = {
          unit: ['', 'V', 'V', 'V', 'V', 'V', 'V'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB']]
        };
        oMeasure2TableV.data.val.push(valRow2);

        oMeasure3TableV.data = {
          unit: ['', 'A', 'A', 'A', 'A', 'A', 'A'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB']]
        };
        oMeasure3TableV.data.val.push(valRow3);

        oMeasure4TableV.data = {
          unit: ['', 'W', 'W', 'W', 'W', 'W', 'W'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB', 'Total']]
        };
        oMeasure4TableV.data.val.push(valRow4);

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail3 = [''];
        aResultPassfail3.push(result.passfail);
        console.log('aResultPassfail3 is', aResultPassfail3);

        oResult3TableV.data = {
          passFail: aResultPassfail3,
          // passFail: ['', true],
          unit: ['', '%', '%', '%'],
          val: [
            ['Efficiency', 'Value', 'High Limit', 'Low Limit'],
            ['', fnRound3(result.percent), fnRound3(result.maximum), fnRound3(result.minimum)]
          ]
        };
      })
      .catch(() => {
        console.log('PowerEfficiencyTest.vue errrrrrrrrrrrrrrrrrrr');
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
const oMeasure2TableV = reactive({ data: {} });
const oMeasure3TableV = reactive({ data: {} });
const oMeasure4TableV = reactive({ data: {} });

// RESULT
// const oResult1TableV = reactive({ data: {} });
// const oResult2TableV = reactive({ data: {} });
const oResult3TableV = reactive({ data: {} });

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
