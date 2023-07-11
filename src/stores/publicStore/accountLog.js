import { defineStore } from 'pinia';

import { ref, reactive } from 'vue';

// AXIOS
import atsRequest from '@/api/axios/atsRequest.js';

// API COMMON
import { fnApiCall } from '@/common/index.js';
import { fnApiStatusCheck } from '@/common/index.js';

// API LIST
const apiLogin = (data) => atsRequest.post('/api/auth/login', data);
const apiLogOut = () => atsRequest.post('/api/auth/logout');
const apiSelfInfo = () => atsRequest.get('/api/user/info');

export const useAccountLogStore = defineStore('useAccountLogStore', () => {
  // --------------------------------
  // -- STATE & GETTERS
  // --------------------------------
  // LOGIN
  const loginData = reactive({
    account: null,
    password: null
  });
  const apiLoginResSuccess = ref(false);
  const apoLoginResClean = ref(false);

  // --------------------------------
  // -- ACTION + MUTATIONS
  // --------------------------------
  // LOGIN
  const fnApiLogin = (data) => {
    loginData.account = data.account;
    loginData.password = data.password;
    apiLoginResSuccess.value = false;
    apoLoginResClean.value = false;

    return new Promise((resolve) => {
      resolve(
        fnApiCall(
          'apiLogin',
          apiLogin,
          fnStatusSuccessLogin,
          data,
          fnApiErrLogin,
          fnStatusErrLogin
          //some
        )
      );
    });
  };

  const fnStatusSuccessLogin = (res) => {
    console.log('STORE.JS>> fnStatusSuccessLogin!');
    apiLoginResSuccess.value = true;
    //
    const { id, token } = res.data;
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('token', token);
  };

  const fnApiErrLogin = (err) => {
    console.log('STORE.JS>> fnApiErrLogin');
    console.log(err.response);
    // errorCallback(err);

    const res = err.response;
    const { message } = res.data;
    console.log(`${res.status}:${message}`);
    switch (true) {
      // 空項次
      case loginData.account === '' && loginData.password === '':
        alert('account & password is empty');
        break;
      case loginData.account === '':
        alert('account is empty');
        break;
      case loginData.password === '':
        alert('password is empty');
        break;
      // 填寫錯誤
      default:
        alert(`account and password did not match our recrod!`);
        loginData.account = '';
        loginData.password = '';
        apoLoginResClean.value = true;
    }

    //
    sessionStorage.clear();
  };

  const fnStatusErrLogin = () => {
    console.log('STORE.JS>> fnStatusErrLogin');
    return false;
  };

  // LOGOUT
  const fnApiLogOut = async () => {
    const apiName = 'apiLogOut';
    await apiLogOut()
      .then((res) => {
        if (fnApiStatusCheck(res)) {
          // success
          console.log(apiName + 'res is', res);
          localStorage.clear();
          sessionStorage.clear();
        } else {
          // status error
          console.log(apiName + ' 503 error');
        }
      })
      .catch((err) => {
        // api error
        console.log('%c' + apiName + ' error', 'color:red;font-size: 20px');
        console.log(err.response);
      });
  };

  // SELF-INFO
  const fnApiSelfInfo = () => {
    return new Promise((resolve) => {
      resolve(
        fnApiCall(
          'apiSelfInfo',
          apiSelfInfo,
          fnStatusSuccessSelfInfo
          //some
        )
      );
    });
  };

  const fnStatusSuccessSelfInfo = (res) => {
    const data = res.data.user;
    localStorage.setItem('name', data.name);
    localStorage.setItem('account', data.account);
  };

  return {
    fnApiLogin,
    apiLoginResSuccess,
    apoLoginResClean,
    //
    fnApiLogOut,
    //
    fnApiSelfInfo
  };
});
