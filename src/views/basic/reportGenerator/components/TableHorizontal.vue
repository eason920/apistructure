<template>
  <div class="table">
    <div v-for="(item, i) in props.propsObj.val" :key="item + i" class="col">
      <div class="col_item">{{ item[0] }}</div>
      <div class="col_item">{{ item[1] }} {{ fnUnit(i) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableHorizontal'
};
</script>

<script setup>
const props = defineProps({
  propsObj: {
    type: Object,
    default: new Object()
  }
});

const fnUnit = (i) => {
  return props.propsObj.unit[i];
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
.table {
  background-color: $color_gray;
  display: flex;
  flex-wrap: wrap;
}
.col {
  display: inline-flex;
  border-bottom: solid 1px #fff;
  width: 50%;
}
$w: 160px;
.col_item {
  display: inline-flex;
  padding: 0 15px;
  font-size: 12px;
  &:nth-child(odd) {
    width: $w;
    background-color: #999;
    color: #fff;
    font-weight: bold;
    justify-content: center;
    align-items: center;
  }
  &:nth-child(even) {
    width: calc(100% - #{$w});
  }

  // border
  .table,
  .col_item {
    border-style: solid;
    border-color: #fff;
  }
  .table {
    border-width: 1px 0 0 1px;
  }
  .col_item {
    border-width: 0 1px 1px 0;
  }
}

// // ====================================
// // == Print
// // ====================================
.table {
  break-inside: avoid;
}
</style>
