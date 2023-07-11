<template>
  <PerItemReport
    v-if="!bApiErr"
    :props-title="'# 6 ' + sItemName"
    :props-pass-fail="bPassFail"
    :props-result-only="props.propsResultOnly"
  >
    <template #condition>
      <TableH :props-obj="oCondition1TableH.data" />
      <TableH :props-obj="oCondition2TableH.data" />
      <TableH :props-obj="oCondition3TableH.data" />
      <TableV :props-obj="oCondition4TableV.data" />
    </template>
    <template #measurement>
      <TableV :props-obj="oMeasure1TableV.data" />
      <!-- <TableV :props-obj="oMeasure2TableV.data" /> -->
    </template>
    <template #result>
      <TableV :props-obj="oResult1TableV.data" />
      <br />
      <!-- <h3>Catch Image:</h3> -->
      <!-- <img :src="sResultImage_1" /> -->
      <!-- <TableV :props-obj="oResult2TableV.data" /> -->
      <!-- <TableH :props-obj="oResult3TableH.data" /> -->
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 6 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'InrushCurrentTetst'
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
  }
});

watch(
  () => props.propsRunId,
  (newRunId) => {
    console.log('%cInrushCurrentTetst:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
            ['Phase', data.line_vectors[0].onphase]
          ]
        };

        oCondition2TableH.data = {
          unit: ['V', 'Hz', 'deg', 'ms'],
          val: [
            ['Vin', data.line_vectors[1].voltage],
            ['Fin', data.line_vectors[1].freq],
            ['Phase', data.line_vectors[1].onphase]
          ]
        };

        oCondition3TableH.data = {
          unit: ['V', 'Hz', 'deg', 'ms'],
          val: [
            ['Vin', data.line_vectors[2].voltage],
            ['Fin', data.line_vectors[2].freq],
            ['Phase', data.line_vectors[2].onphase]
          ]
        };

        // --
        const Von = data.load_vectors['InrushCurrentTetst20.init.response'].split(',');
        const mode = data.load_vectors['InrushCurrentTetst20.channel'].split(',');
        const value = data.load_vectors['InrushCurrentTetst20.cur.stat.l1'].split(',');

        oCondition4TableV.data = {
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

        oMeasure1TableV.data = {
          unit: ['', 'A', 'A'],
          val: [
            ['Input', 'I+pk', 'I-pk'],
            ['Iin', gpmp.IPP.val, gpmp.IMP.val]
          ]
        };

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const aResultPassfail1 = [''];
        aResultPassfail1.push(gpmp.IPP.passfail);
        aResultPassfail1.push(gpmp.IMP.passfail);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, false],
          unit: ['', 'A', 'A', 'A'],
          val: [
            ['Iin', 'Value', 'High Limit', 'Low Limit'],
            ['I+pk', fnRound3(gpmp.IPP.val), fnRound3(gpmp.IPP.max), fnRound3(gpmp.IPP.min)],
            ['I-pk', fnRound3(gpmp.IMP.val), fnRound3(gpmp.IPP.max), fnRound3(gpmp.IPP.min)]
          ]
        };

        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('InrushCurrentTest.vue errrrrrrrrrrrrrrrrrrr');
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
const oCondition3TableH = reactive({ data: {} });
const oCondition4TableV = reactive({ data: {} });

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
