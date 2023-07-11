<template>
  <div class="itembox">
    <h2 class="unittitle">
      <span>
        {{ props.propsTitle }}
        <span class="unittitle_passfail" :class="[{ is_fail: !props.propsPassFail }]">
          {{ props.propsPassFail ? 'pass' : 'fail' }}
        </span>
      </span>
    </h2>
    <!-- Condition -->
    <h4 v-if="!props.propsResultOnly" class="structitle">Condition :</h4>
    <slot v-if="!props.propsResultOnly" name="condition" />
    <!-- Measurement -->
    <h4 v-if="!props.propsResultOnly" v-show="props.propsMeasureeShow" class="structitle">Measurement :</h4>
    <slot v-if="!props.propsResultOnly" name="measurement" />
    <!-- Result -->
    <h4 v-if="!props.propsResultOnly" class="structitle">Result :</h4>
    <slot name="result" />
  </div>
</template>

<script>
export default {
  name: 'PerItemReport'
};
</script>

<script setup>
// VUE
// import {
//   ref,
//   reactive,
//   some
// } from 'vue';

// PROPS
const props = defineProps({
  propsTitle: {
    type: String,
    default: 'Default Title'
  },
  propsPassFail: {
    type: Boolean,
    default: false
  },
  propsMeasureeShow: {
    type: Boolean,
    default: true
  },
  // 給 Gnogo item running 時噴錯 LB 顯示用 (只顯示 result ) v
  propsResultOnly: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/basic/reportGenerator/reportGeneratorDetail.scss';
</style>
