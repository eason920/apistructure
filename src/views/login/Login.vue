<template>
  <div class="loginBox">
    <div class="loginBox_title">GWInstek Auto Test System</div>
    <n-form
      ref="formRef"
      :model="loginData"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      :label-width="100"
      :size="size"
    >
      <div class="msgBox">
        <n-form-item class="item" label="Account" path="account">
          <n-input v-model:value="loginData.account" placeholder="Input your account" />
        </n-form-item>
        <n-form-item class="item" label="Password" path="password">
          <n-input v-model:value="loginData.password" placeholder="Input your password" type="password" />
        </n-form-item>
        <n-form-item class="item" label="Application" path="selectValue">
          <n-select v-model:value="selectValue.value" :options="selectValue.options" />
        </n-form-item>
        <!-- <button class="btn" @click.prevent="loginStore.loginAPI(loginData)">Login</button> -->
        <button class="btn" @click.prevent="fnApiLogin(loginData)">Login</button>
      </div>
    </n-form>
    <span class="memo"
      >最高權限帳密 > 帳號：admin 密碼：admin<br />
      Mode: {{ sEnvMode }}<br />
      Domain: {{ sEnvDomain }}<br />
      Port: {{ sEnvPort }}<br />
      WebSocketKey: {{ sEnvWebSocketKey }}
    </span>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  defineComponent,
  onMounted
  // some
} from 'vue';

// Naive
import { useMessage } from 'naive-ui';

// Router
import {
  useRouter
  // some
} from 'vue-router';

// Store
import { useAccountLogStore } from '@/stores/publicStore/accountLog.js';

// Api Set Token
import { fnInitApiToken } from '@/common/index.js';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useAccountLogStore();

    let loginData = ref({
      account: null,
      password: null
    });

    const fnApiLogin = (data) => {
      store.fnApiLogin(data).then(() => {
        if (store.apiLoginResSuccess) {
          fnInitApiToken();
          //
          store.fnApiSelfInfo().then(() => {
            router.push({ name: 'Home' });
          });
          //
        } else {
          if (store.apoLoginResClean) {
            loginData.value = {
              account: '',
              password: ''
            };
          }
        }
      });
    };

    const sEnvDomain = ref('');
    const sEnvWebSocketKey = ref('');
    const sEnvMode = ref('');
    const sEnvPort = ref('');

    onMounted(() => {
      sEnvDomain.value = import.meta.env.VITE_DOMAIN;
      sEnvWebSocketKey.value = import.meta.env.VITE_WEB_SOCKET_KEY;
      sEnvMode.value = import.meta.env.VITE_MODE;
      sEnvPort.value = import.meta.env.VITE_PORT;

      console.log("onM:sessionStorage.getItem('token')", sessionStorage.getItem('token'));
      if (sessionStorage.getItem('token') !== null) {
        router.push({ name: 'Home' });
      }
    });
    const formRef = ref(null);
    const message = useMessage();
    // const loginStore = useLoginStore();

    const selectValue = reactive({
      value: ref(1),
      options: [
        {
          label: 'PSU-Test',
          value: 1
        }
      ]
    });

    const validateSelect = () => {
      return selectValue.value !== null;
    };

    const rules = {
      account: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: 'Please input account'
        }
      ],
      password: [
        {
          required: true,
          trigger: ['blur', 'input'],
          message: 'Please input password'
        }
      ],
      selectValue: [
        {
          validator: validateSelect,
          required: true,
          trigger: ['blur', 'input'],
          message: 'Please Select platform'
        }
      ]
    };
    return {
      fnApiLogin,
      formRef,
      selectValue,
      message,
      loginData,
      rules,
      validateSelect,
      sEnvMode,
      sEnvDomain,
      sEnvWebSocketKey,
      sEnvPort
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/style/publicStyle.scss';
@import '@/assets/style/publicStyle/login.scss';
</style>
