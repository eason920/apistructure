const style = 'color: #00756b;font-style: italic;font-weight: bold';

export const apiStatusCheck = (res) => {
  return res.data.status_code[0] !== 503;
};

export const apiCheck = async (
  apiName,
  axiosApi,
  callBackFunctionSuccess,
  aParameterFroApi,
  callBackFunctionStatusError,
  callBackFunctionError
) => {
  await axiosApi(aParameterFroApi)
    .then((res) => {
      if (res.data.status_code[0] !== 503) {
        if (callBackFunctionSuccess) {
          callBackFunctionSuccess(res, apiName);
        } else {
          console.log('%cvvv ' + apiName + ' success START vvv', style);
          console.log(res);
          console.log('%c^^^ ' + apiName + ' success END ^^^', style);
        }
      } else {
        if (callBackFunctionStatusError) {
          callBackFunctionStatusError(res, apiName);
        } else {
          console.log('%cvvv ' + apiName + ' status error START vvv', style);
          console.log(res);
          console.log('%c^^^ ' + apiName + ' status error END ^^^', style);
        }
      }
    })
    .catch((err) => {
      if (callBackFunctionError) {
        callBackFunctionError(err, apiName);
      } else {
        console.log('%cvvv ' + apiName + ' ERROR START vvv', style);
        console.log(err.response);
        console.log('%c^^^ ' + apiName + ' ERROR END ^^^', style);
      }
    });
};
