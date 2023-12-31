import axios from 'axios';

const atsRequest = axios.create({
  baseURL: 'http://' + import.meta.env.VITE_DOMAIN + import.meta.env.VITE_PORT,
  headers: { 'Content-Type': 'application/json' }
});

// 攔截 API request 的請求
atsRequest.interceptors.request.use(
  (request) => {
    // API送出前可以做最後的處理
    // console.log('%cBEFORE API', 'color: greenyellow');
    // console.log('request', request);
    return request;
  },
  (error) => {
    // 如果送出前失敗了，這邊就可以做一些處理
    return Promise.reject(error);
  }
);

// 攔截 API response 的回傳
atsRequest.interceptors.response.use(
  (response) => {
    // 這邊可以對回來的資料先進行驗證處理，再來決定要不要把資料給吐出去
    return response;
  },
  (error) => {
    // 這邊當API發生錯誤的時候就可以處理 Error handling
    return Promise.reject(error);
  }
);

export default atsRequest;
