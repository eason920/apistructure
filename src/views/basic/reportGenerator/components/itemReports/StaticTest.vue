<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 5 ' + sItemName"
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
    </template>
    <template #result>
      <TableV :props-obj="oResult1TableV.data" />
      <TableV :props-obj="oResult2TableV.data" />
      <TableV :props-obj="oResult3TableV.data" />
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 5 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'StaticTest'
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
    console.log('%cStaticTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
            ['Phase', '0']
          ]
        };

        // --
        const mode = data.load_vectors['StaticTest20.channel'].split(',');
        const value = data.load_vectors['StaticTest20.cur.stat.l1'].split(',');
        const Von = data.load_vectors['StaticTest20.init.response'].split(',');

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
        const gdmv = data.gdmv;
        const loads = data.loads;

        const valRow1 = ['Vout'];
        const valRow2 = ['Iout'];
        let ci = 0;
        for (let a in gdmv) {
          const Vout = fnNegativeToPostive(gdmv[a].val);
          const Iout = loads.c.val[ci];

          valRow1.push(fnRound3(Vout));
          valRow2.push(fnRound3(Iout));

          ci++;
        }
        oMeasure1TableV.data = {
          unit: ['', 'V', 'V', 'V', 'V', 'V', 'V'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB']]
        };
        oMeasure1TableV.data.val.push(valRow1);

        oMeasure2TableV.data = {
          unit: ['', 'A', 'A', 'A', 'A', 'A', 'A'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB']]
        };

        oMeasure2TableV.data.val.push(valRow2);

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        loads.c.passfail.forEach((item) => {
          aResultPassfail1.push(item);
        });
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 'A', 'A', 'A'],
          val: [
            ['Iout', 'Value', 'High Limit', 'Low Limit'],
            // ['+5V', loads.c.val[0], loads.c.max[0], loads.c.min[0]],
            // ['+12V', loads.c.val[1], loads.c.max[1], loads.c.min[1]],
            // ['-12V', loads.c.val[2], loads.c.max[2], loads.c.min[2]],
            // ['+3.3V', loads.c.val[3], loads.c.max[3], loads.c.min[3]],
            // ['+5VSB', loads.c.val[4], loads.c.max[4], loads.c.min[4]]
            ['+5V', fnRound3(loads.c.val[0]), fnRound3(loads.c.max[0]), fnRound3(loads.c.min[0])],
            ['+12V', fnRound3(loads.c.val[1]), fnRound3(loads.c.max[1]), fnRound3(loads.c.min[1])],
            ['-12V', fnRound3(loads.c.val[2]), fnRound3(loads.c.max[2]), fnRound3(loads.c.min[2])],
            ['+3.3V', fnRound3(loads.c.val[3]), fnRound3(loads.c.max[3]), fnRound3(loads.c.min[3])],
            ['+5VSB', fnRound3(loads.c.val[4]), fnRound3(loads.c.max[4]), fnRound3(loads.c.min[4])]
          ]
        };
        // --
        const aResultPassfail2 = [''];
        for (let a in gdmv) {
          console.log(a, gdmv[a].passfail);
          aResultPassfail2.push(gdmv[a].passfail);
        }
        console.log('aResultPassfail2 is', aResultPassfail2);

        oResult2TableV.data = {
          passFail: aResultPassfail2,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 'V', 'V', 'V'],
          val: [['Vout', 'Value', 'High Limit', 'Low Limit']]
        };
        for (let a in gdmv) {
          const val = fnRound3(fnNegativeToPostive(gdmv[a].val));
          const max = fnRound3(fnNegativeToPostive(gdmv[a].max));
          const min = fnRound3(fnNegativeToPostive(gdmv[a].min));
          oResult2TableV.data.val.push([a, val, max, min]);
        }
        // --
        const aResultPassfail3 = [''];
        aResultPassfail3.push(data.result.passfail);
        console.log('aResultPassfail3 is', aResultPassfail3);

        oResult3TableV.data = {
          passFail: aResultPassfail3,
          // passFail: ['', true],
          unit: ['', 'W', 'W', 'W', 'W'],
          val: [
            ['', 'Value', 'Hight Limit', 'Low Limit'],
            ['Pout', fnRound3(data.result.value), fnRound3(data.result.maximum), fnRound3(data.result.minimum)]
          ]
        };
      })
      .catch(() => {
        console.log('StaticTest.vue errrrrrrrrrrrrrrrrrrr');
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

// RESULT
const oResult1TableV = reactive({ data: {} });
const oResult2TableV = reactive({ data: {} });
const oResult3TableV = reactive({ data: {} });

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
