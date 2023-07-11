import atsRequest from '@/api/axios/atsRequest.js';

// LOCAL
const style = 'color: red;font-style: italic;font-weight: bold; font-size: 18px';

const apiCheckStatus = (res) => {
  console.log('check status res', res);
  const errorCode = 503;
  return new Promise((resolve, reject) => {
    if (res.data.status_code[0] !== errorCode) {
      resolve(res);
    } else {
      reject(`status error ( status_code: ${errorCode} )`);
    }
  });
};

// EXPORT
export const initApiToken = () => {
  console.log('%cINIT API TOKEN', style);
  atsRequest.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
};

export const apiCall = async (
  apiName,
  axios,
  cbfnStatusSuccess,
  aAxiosParameter,
  cbfnApiErr,
  cbfnStatusErr
  // some
) => {
  let sErrFrom = 'called';
  await axios(aAxiosParameter)
    .then((res) => {
      console.log(apiName, 'then res', res);
      sErrFrom = 'status';
      return apiCheckStatus(res);
    })
    .then((res) => {
      console.log('status resolve res', res);
      cbfnStatusSuccess(res);
    })
    .catch((err) => {
      console.log(`%cAPI ${apiName} ${sErrFrom} Error`, style);
      if (sErrFrom === 'called') {
        console.log(apiName, 'app error', err);
        if (cbfnApiErr) {
          cbfnApiErr(err);
        }
      } else {
        console.log(`%c${apiName} ${err}`, style);
        if (cbfnStatusErr) {
          cbfnStatusErr(err);
        }
      }
    });
};
