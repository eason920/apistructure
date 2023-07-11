<template>
  <div class="table">
    <div
      v-for="(item, i) in props.propsObj.val"
      :key="item + i"
      class="row"
      :class="[{ is_title: i === 0 }, { is_fail: fnPassFail(i) }]"
    >
      <div v-for="(jtem, j) in item" :key="jtem + j" class="col" :class="[{ is_title: j === 0 }]">
        {{ jtem }} {{ fnUnit(i, j) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableVertical'
};
</script>

<script setup>
const props = defineProps({
  propsObj: {
    type: Object,
    default: new Object()
  }
});

const fnPassFail = (i) => {
  if (props.propsObj.passFail !== undefined) {
    // console.log('fnPassFail', i, props.propsObj.passFail[i] === false);
    return props.propsObj.passFail[i] === false;
  }
};

const fnUnit = (i, j) => {
  if (i !== 0) {
    return props.propsObj.unit[j];
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
.table {
  width: 100%;
}

.row {
  display: flex;
  align-items: stretch;
}

.col {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  background-color: $color_gray;
  padding: 0 15px;
  font-size: 12px;
}

.table,
.row,
.col {
  border-style: solid;
  border-color: #fff;
}

.table {
  border-width: 1px 0 0 1px;
}

.row {
  border-width: 0 0 1px;
}

.col {
  border-width: 0 1px 0 0;
}

.is_title,
.is_title .col {
  font-weight: bold;
  background-color: #999;
  // justify-content: center;
  color: #fff;
}

.is_title .col {
  align-items: flex-end;
}

.is_title .col:first-child,
.col.is_title {
  align-items: center;
}

.is_fail {
  .col {
    background-color: #ffbebe;
    &.is_title {
      background-color: #bb3e3e;
      display: flex;
      flex-direction: row;
      justify-content: center;
      &:before {
        content: '*';
        font-size: 30px;
        font-weight: normal;
        padding-right: 5px;
        line-height: 1;
        height: 0;
        transform: translateY(-7px);
      }
    }
  }
}

$w: 160px;
.col:first-child:nth-last-child(1) ~ .col {
  width: calc((100% - #{$w}) / (1 - 1));
}
.col:first-child:nth-last-child(2) ~ .col {
  width: calc((100% - #{$w}) / (2 - 1));
}

.col:first-child:nth-last-child(3) ~ .col {
  width: calc((100% - #{$w}) / (3 - 1));
}

.col:first-child:nth-last-child(4) ~ .col {
  width: calc((100% - #{$w}) / (4 - 1));
}

.col:first-child:nth-last-child(5) ~ .col {
  width: calc((100% - #{$w}) / (5 - 1));
}

.col:first-child:nth-last-child(6) ~ .col {
  width: calc((100% - #{$w}) / (6 - 1));
}

.col:first-child:nth-last-child(7) ~ .col {
  width: calc((100% - #{$w}) / (7 - 1));
}

.col:first-child:nth-last-child(8) ~ .col {
  width: calc((100% - #{$w}) / (8 - 1));
}

.col:first-child:nth-last-child(9) ~ .col {
  width: calc((100% - #{$w}) / (9 - 1));
}

.col:first-child:nth-last-child(10) ~ .col {
  width: calc((100% - #{$w}) / (10 - 1));
}

.col:first-child {
  width: $w;
  /* line-height: 1.4; */
  /* text-align: center; */
}

// ====================================
// == Print
// ====================================
@media print {
  .table {
    break-inside: avoid;
  }
}
</style>
