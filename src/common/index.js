import { apiErred } from './apiErred.js';
import { round3, negativeToPostive } from './numberFormater.js';
import { dateFormate } from './dateFormate.js';
import { apiStatusCheck, apiCheck } from './apiCheck.js';
import { initApiToken, apiCall } from './apiCheckPromise.js';

// v api 錯誤刷新設限(搭配localstorage 'appErrored'導回 home)
export const fnApiErred = apiErred;

// v 取小數點三位數 + 補零
export const fnRound3 = round3;

// v 將負數(voltage)轉正數
export const fnNegativeToPostive = negativeToPostive;

// v 去除國際時間的 "T" 與 "8:00"
export const fnDateFormate = dateFormate;

// v INIT API TOKEN *若沒再次給、會導致 token 遺失、API失效
// = 一進來 API error
// = 一進來沒畫面
// = 要刷畫面促成 API 取得 token 來讀值
export const fnInitApiToken = initApiToken;
export const fnApiStatusCheck = apiStatusCheck;

export const fnApiCheck = apiCheck;
export const fnApiCall = apiCall;
