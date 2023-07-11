<template>
  <PerItemReport v-if="!bApiErr" :props-title="'# 9 ' + sItemName" :props-pass-fail="bPassFail">
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
      <TableV :props-obj="oResult2TableV.data" />
      <TableV :props-obj="oResult3TableV.data" />
      <TableV :props-obj="oResult4TableV.data" />
      <h3>Catch Image:</h3>
      <img :src="sResultImage_1" :class="[{ is_print_bw: props.propsPrintBW }]" />
    </template>
  </PerItemReport>
  <div v-else v-show="!bApiErr" style="background: #fff; padding: 20px"># 9 未執行、非 fail 結果 , no report</div>
</template>

<script>
export default {
  name: 'DynamicTest1'
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
    console.log('%cDynamicTest1:uutid ' + props.propsUutId + '/runid ' + newRunId, 'color:greenyellow');

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
            // ['Turn On Delay', sNoData]
          ]
        };

        // --
        const Von = data.load_vectors[0]['DynamicTest120.init.response'].split(',');
        const mode = data.load_vectors[0]['DynamicTest120.channel'].split(',');
        const value = data.load_vectors[0]['DynamicTest120.cur.stat.l1'].split(',');
        const Time1 = data.load_vectors[0]['DynamicTest120.cur.dyna.t1'].split(',');
        const Time2 = data.load_vectors[0]['DynamicTest120.cur.dyna.t2'].split(',');
        const srRise = data.load_vectors[0]['DynamicTest120.cur.stat.rise'].split(',');
        const srFall = data.load_vectors[0]['DynamicTest120.cur.stat.fall'].split(',');

        oCondition2TableV.data = {
          unit: ['', 'V', '', 'A', 'ms', 'ms', 'A/us', 'A/us'],
          val: [
            ['Load CH', 'Von', 'Mode', 'Value', 'T1', 'T2', 'SR Rise', 'SR Fall'],
            ['+5V', Von[0], mode[0].replace('H', ''), fnRound3(value[0]), Time1[0], Time2[0], srRise[0], srFall[0]],
            [
              '+12V',
              Von[1],
              mode[1].replace('H', ''),
              fnRound3(value[1]),
              Time1[1],
              Time2[1],
              srRise[1] / 1000,
              srFall[1] / 1000
            ],
            ['-12V', Von[2], mode[2].replace('H', ''), fnRound3(value[2]), Time1[2], Time2[2], srRise[2], srFall[2]],
            ['+3.3V', Von[3], mode[3].replace('H', ''), fnRound3(value[3]), Time1[3], Time2[3], srRise[3], srFall[3]]
            // ['+5VSB', Von[4], mode[4].replace('H', ''), fnRound3(value[4])]
          ]
        };

        // --------------------------------
        // -- MESSAUREMENT
        // --------------------------------

        const result = data.result;
        const max = data.result.max;
        const min = data.result.min;

        oMeasure1TableV.data = {
          unit: ['', 'V', 'V', 'V', 'V', 'V'],
          val: [
            ['Output', 'Vpk-pk', 'Vs1', 'Vs2', 'V+pk', 'V-pk'],
            [
              '+5V',
              result.pk2pk.value[0],
              data.scope_records['RAW_CH1'].high.val,
              data.scope_records['RAW_CH1'].low.val,
              max.value[0],
              min.value[0]
            ],
            [
              '+12V',
              result.pk2pk.value[1],
              data.scope_records['RAW_CH2'].high.val,
              data.scope_records['RAW_CH2'].low.val,
              max.value[1],
              min.value[1]
            ],
            [
              '-12V',
              result.pk2pk.value[2],
              data.scope_records['RAW_CH3'].high.val,
              data.scope_records['RAW_CH3'].low.val,
              max.value[2],
              min.value[2]
            ],
            [
              '+3.3V',
              result.pk2pk.value[3],
              data.scope_records['RAW_CH4'].high.val,
              data.scope_records['RAW_CH4'].low.val,
              max.value[3],
              min.value[3]
            ]
          ]
        };

        // --

        // --------------------------------
        // -- RESULT
        // --------------------------------
        const pk2pk = result.pk2pk;
        const aResultPassfail1 = [''];
        pk2pk.passfail.forEach((item) => {
          aResultPassfail1.push(item);
        });
        console.log('aResultPassfail1', aResultPassfail1);

        oResult1TableV.data = {
          passFail: aResultPassfail1,
          // passFail: ['', false, true, false, false],
          unit: ['', 'V', 'V', 'V'],
          val: [
            ['Vpk-pk', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', pk2pk.value[0], pk2pk.maximum[0], pk2pk.minimum[0]],
            ['+12V', pk2pk.value[1], pk2pk.maximum[1], pk2pk.minimum[1]],
            ['-12V', pk2pk.value[2], pk2pk.maximum[2], pk2pk.minimum[2]],
            ['+3.3V', pk2pk.value[3], pk2pk.maximum[3], result.pk2pk.minimum[3]]
          ]
        };
        // --
        const delta = result.delta;
        const aResultPassfail2 = [''];
        delta.passfail.forEach((item) => {
          aResultPassfail2.push(item);
        });
        console.log('aResultPassfail2', aResultPassfail2);

        oResult2TableV.data = {
          passFail: aResultPassfail2,
          // passFail: ['', false, true, false, false],
          unit: ['', 'V', 'V', 'V'],
          val: [
            ['|Vs1-Vs2|', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', fnRound3(delta.value[0]), fnRound3(delta.maximum[0]), fnRound3(delta.minimum[0])],
            ['+12V', fnRound3(delta.value[1]), fnRound3(delta.maximum[1]), fnRound3(delta.minimum[1])],
            ['-12V', fnRound3(delta.value[2]), fnRound3(delta.maximum[2]), fnRound3(delta.minimum[2])],
            ['+3.3V', fnRound3(delta.value[3]), fnRound3(delta.maximum[3]), fnRound3(delta.minimum[3])]
          ]
        };
        // --
        const aResultPassfail3 = [''];
        max.passfail.forEach((item) => {
          aResultPassfail3.push(item);
        });
        console.log('aResultPassfail3', aResultPassfail3);

        oResult3TableV.data = {
          passFail: aResultPassfail3,
          // passFail: ['', false, true, false, false],
          unit: ['', 'V', 'V', 'V'],
          val: [
            ['V+pk', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', max.value[0], max.maximum[0], max.minimum[0]],
            ['+12V', max.value[1], max.maximum[1], max.minimum[1]],
            ['-12V', max.value[2], max.maximum[2], max.minimum[2]],
            ['+3.3V', max.value[3], max.maximum[3], max.minimum[3]]
          ]
        };
        // --
        const aResultPassfail4 = [''];
        min.passfail.forEach((item) => {
          aResultPassfail4.push(item);
        });
        console.log('aResultPassfail4', aResultPassfail4);

        oResult4TableV.data = {
          passFail: aResultPassfail4,
          // passFail: ['', false, true, false, false],
          unit: ['', 'V', 'V', 'V'],
          val: [
            ['V-pk', 'Value', 'High Limit', 'Low Limit'],
            ['+5V', min.value[0], min.maximum[0], min.minimum[0]],
            ['+12V', min.value[1], min.maximum[1], min.minimum[1]],
            ['-12V', min.value[2], min.maximum[2], min.minimum[2]],
            ['+3.3V', min.value[3], min.maximum[3], min.minimum[3]]
          ]
        };
        sResultImage_1.value = data.scope_picture[0]['data'];
      })
      .catch(() => {
        console.log('DynamicTest1.vue errrrrrrrrrrrrrrrrrrr');
        bApiErr.value = true;
      });
  }
);

// GLOBAL

// eslint-disable-next-line no-unused-vars
const sNoData = '(no data)';
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
const oResult2TableV = reactive({ data: {} });
const oResult3TableV = reactive({ data: {} });
const oResult4TableV = reactive({ data: {} });
const sResultImage_1 = ref('');

const bApiErr = ref(false);
</script>

<style lang="scss" scoped>
@import '@/assets/style/basic/reportGenerator/reportGeneratorReport.scss';
</style>
