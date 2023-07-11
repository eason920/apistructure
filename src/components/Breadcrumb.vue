<template>
  <div v-if="bShow" class="breadCrumb">
    <div class="breadCrumb_tree">
      <div @click="fnPushPage">Home</div>
      <span v-if="pathName">></span>
      {{ pathName }}
    </div>
    <p class="breadCrumb_btn is_small" @click="fnPushPage"><Icon />Home</p>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb'
};
</script>

<script setup>
import { useRouter } from 'vue-router';
import { watch, ref } from 'vue';
//icon
import { Home as Icon } from '@vicons/tabler';

const bShow = ref(true);
const router = useRouter();
const pathName = ref('');
const fnPushPage = () => {
  router.push({ name: 'Home' });
};
watch(
  () => router.currentRoute.value.name,
  (newCurrentRouteName) => {
    if (newCurrentRouteName === 'Home') {
      pathName.value = '';
      bShow.value = false;
    } else {
      pathName.value = newCurrentRouteName;
      bShow.value = true;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
$gutter: 10px;
.breadCrumb {
  display: flex;
  width: 100%;
  padding: 0;
  height: $breadCrumb_height;
  align-items: center;
  justify-content: space-between;
  div {
    cursor: pointer;
    margin-right: $gutter;
  }
  span {
    margin-right: $gutter;
  }
}
.breadCrumb_tree {
  @extend %flex_center;
}
.breadCrumb_btn {
  @extend %btn;
  margin: 0;
  height: 24px;
  padding: 0 10px;
  svg {
    width: 17px;
    margin-right: 2px;
  }
}
@media screen and (max-width: $breakpoint_nb) {
  .breadCrumb {
    padding: 0 2vw;
    // margin: 1vw 0;
  }
}
</style>
