<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <HeaderLogo />
            <div class="router_wrapper">
              <Breadcrumb v-if="isShow" />
              <router-view></router-view>
            </div>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script>
import HeaderLogo from './components/Header.vue';
import { NConfigProvider } from 'naive-ui';
import Breadcrumb from './components/Breadcrumb.vue';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';

export default {
  name: 'App',
  components: { HeaderLogo, NConfigProvider, Breadcrumb },
  setup() {
    const router = useRouter();
    const isShow = ref(false);

    watch(
      () => router.currentRoute.value.path,
      (newCurrentRoutePath) => {
        // console.log(newCurrentRoutePath);
        if (newCurrentRoutePath === '/' || newCurrentRoutePath === '/login') {
          isShow.value = false;
        } else {
          isShow.value = true;
        }
      },
      { immediate: true, deep: true }
    );

    const themeOverrides = {
      common: {
        primaryColor: '#2080f0',
        primaryColorHover: '#2080f0',
        primaryColorPressed: '#2080f0',
        primaryColorSuppl: '#2080f0',
        primaryColorFocus: '#2080f0'
      },
      Tabs: {
        colorSegment: '#d2d6e7',
        tabBorderRadius: '10pt',
        tabTextColorActiveLine: '#d2d6e7',
        tabTextColorActiveSegment: '#2080f0',
        tabTextColorHoverSegment: '#2080f0'
      },
      Form: {
        feedbackPadding: '3pt',
        feedbackHeightSmall: '3pt',
        feedbackHeightMedium: '3pt',
        feedbackFontSizeSmall: '3pt',
        feedbackFontSizeMedium: '3pt',
        feedbackHeightLarge: '3pt'
      },
      Table: {
        tdPaddingSmall: '5pt',
        tdPaddingMedium: '5pt',
        tdPaddingLarge: '5pt'
      }
    };
    return {
      themeOverrides,
      isShow
    };
  }
};
</script>

<style scoped>
.n-layout {
  font-size: 16pt;
}
.n-layout-header {
  height: 8vh;
  background-color: rgb(29, 25, 24);
}
.n-layout-content {
  display: flex;
  justify-content: center;
  height: 92vh;
}
</style>

<style lang="scss">
@import './assets/style/publicStyle.scss';
@import './assets/style/reset.scss';

#app,
.n-config-provider {
  height: calc(100vh - #{$header_height});
}
.router_wrapper {
  width: 90%;
  height: calc(100vh - #{$header_height} - 25px);
  display: flex;
  margin: #{$header_height} auto 0;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

@media screen and (max-width: $breakpoint_nb) {
  .router_wrapper {
    width: calc(100% - 20px);
    height: calc(100vh - #{$header_height} - 10px);
  }
}
</style>
