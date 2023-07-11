<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 1 ' + sItemName"
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
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 1 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'InputOutputTest'
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

// COMPONENTS
import PerItemReport from '../PerItemReport.vue';
import TableV from '../TableVertical.vue';
import TableH from '../TableHorizontal.vue';

// Common
import { fnRound3, fnNegativeToPostive, fnInitApiToken } from '@/common/index.js';

// STORE
import { useRgDetailStore } from '@/stores/basic/reportGenerator/reportGeneratorDetail.js';
const store = useRgDetailStore();

console.log('InputOutputTest InputOutputTest', props.propsUutId, props.propsRunId);

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

onMounted(() => {
  fnInitApiToken();
});

watch(
  () => props.propsRunId,
  (newRunId) => {
    console.log('%cInputOutputTest:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

    store
      .fnApiResult({ uut_id: props.propsUutId, runs_id: newRunId })
      .then(() => {
        bApiErr.value = false;
        // console.log('%cNOT 503', 'color:green;font-size:20px');
        const res = store.fnResultRes;
        console.log('InputOutputTest.vue store.fnResultRes >>', res);
        const data = res.data.results;
        sItemName.value = data.name;
        bPassFail.value = data.passfail.isPass;

        // --------------------------------
        // CONDITION
        // --------------------------------
        oCondition1TableH.data = {
          unit: ['V', 'Hz', 'deg'],
          val: [
            ['Vin', data.line_vectors[0].voltage],
            ['Fin', data.line_vectors[0].freq],
            ['Phase', '0']
            // ['Turn On Delay', data.delay[0].value * 1000]
          ]
        };

        // --
        const mode = data.load_vectors['InputOutputtest20.channel'].split(',');
        const value = data.load_vectors['InputOutputtest20.cur.stat.l1'].split(',');
        const Von = data.load_vectors['InputOutputtest20.init.response'].split(',');

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
            ['Value', fnRound3(gpmp.U.val), fnRound3(gpmp.I.val), fnRound3(gpmp.P.val), fnRound3(gpmp.LAMB.val)]
          ]
        };

        // --
        const gdmv = data.gdmv;
        // console.log('gdmv is', gdmv);
        const loads = data.loads;
        // console.log('load is', loads);
        const valRow2 = ['Pout'];
        let ci = 0;
        for (let a in gdmv) {
          const Iout = loads.c.val[ci];
          const Vout = fnNegativeToPostive(gdmv[a].val);
          const count = fnRound3(Vout * Iout, 3);
          valRow2.push(count);
          ci++;
        }
        valRow2.push(fnRound3(result.value));

        oMeasure2TableV.data = {
          unit: ['', 'W', 'W', 'W', 'W', 'W', 'W'],
          val: [['Output', '+5V', '+12V', '-12V', '+3.3V', '+5VSB', 'Total']]
        };
        oMeasure2TableV.data.val.push(valRow2);

        // --------------------------------
        // -- RESULT
        // --------------------------------
        // console.log('loads.c.val[0] is', loads.c.val[0]);
        const aResultPassfail1 = [''];
        // for (let a in data.gpmp) {
        //   aResultPassfail1.push(data.gpmp[a].passfail);
        // }
        loads.c.passfail.forEach((item) => {
          aResultPassfail1.push(item);
        });
        console.log('aResultPassfail1', aResultPassfail1);
        const ary1 = [
          ['Iout', 'Value', 'High Limit', 'Low Limit'],
          ['+5V', fnRound3(loads.c.val[0]), fnRound3(loads.c.max[0]), fnRound3(loads.c.min[0])],
          ['+12V', fnRound3(loads.c.val[1]), fnRound3(loads.c.max[1]), fnRound3(loads.c.min[1])],
          ['-12V', fnRound3(loads.c.val[2]), fnRound3(loads.c.max[2]), fnRound3(loads.c.min[2])],
          ['+3.3V', fnRound3(loads.c.val[3]), fnRound3(loads.c.max[3]), fnRound3(loads.c.min[3])],
          ['+5VSB', fnRound3(loads.c.val[4]), fnRound3(loads.c.max[4]), fnRound3(loads.c.min[4])]
        ];
        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false, true, false, false],
          unit: ['', 'A', 'A', 'A'],
          val: []
        };
        for (let i = 1; i <= 1; i++) {
          ary1.forEach((item) => {
            oResult1TableV.data.val.push(item);
          });
        }
        //--
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
          const val = gdmv[a].val;
          const max = gdmv[a].max;
          const min = fnRound3(fnNegativeToPostive(gdmv[a].min));
          oResult2TableV.data.val.push([a, val, max, min]);
        }
        // --
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
        console.log('InputOutputTest.vue errrrrrrrrrrrrrrrrrrr');
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
