import { defineStore } from 'pinia';
import {
  reactive
  // some
} from 'vue';

// AXIOS
import atsRequest from '@/api/axios/atsRequest.js';

// API COMMON
import { fnApiCall } from '@/common/index.js';

// API LIST
const apiTpList = () => atsRequest.get('api/uut/program');
const apiSearch = (data) => atsRequest.post('/api/uut/search', data);

export const useRgStore = defineStore('userListStore', () => {
  // --------------------------------
  // -- STATE & GETTERS
  // --------------------------------
  const apiTpListRes = reactive({ data: [] });
  const apiSearchRes = reactive({ data: [] });

  // --------------------------------
  // -- ACTION + MUTATIONS
  // --------------------------------
  // TP LIST
  const fnStatusSuccessTplist = (res) => {
    let ary = [
      {
        label: 'please select',
        value: 0,
        disabled: true
      }
    ];

    res.data.programs.forEach((item) => {
      ary.push({
        label: item.name,
        value: item.id
      });
    });

    apiTpListRes.data = ary;
    console.log('apiTpListRes.data is', apiTpListRes.data);
  };

  const fnApiTpList = () => {
    return new Promise((resolve) => {
      resolve(fnApiCall('apiTpList', apiTpList, fnStatusSuccessTplist));
    });
  };

  // SEARCH
  const fnStatusSuccessSearch = (res) => {
    const ary = [];
    res.data.uuts.forEach((item) => {
      const obj = {
        uut_id: item.id,
        uut_name: item.program.uut_name,
        program_name: item.program.name,
        model_no: item.program.uut_model,
        serial_no: item.serial_number,
        order_no: item.batch_number,
        runs_total: item.runs_total,
        run_list: item.runs
      };
      item.runs.forEach((item, i) => {
        obj.run_list[i].export = false;
      });
      ary.push(obj);
    });
    console.log('store > ary is', ary);
    console.log('%c======================', 'color: gray');
    apiSearchRes.data = ary;
  };

  const fnApiSearch = (data) => {
    return new Promise((resolve) => {
      resolve(fnApiCall('apiSearch', apiSearch, fnStatusSuccessSearch, data));
    });
  };

  return {
    fnApiTpList,
    apiTpListRes,
    //
    fnApiSearch,
    apiSearchRes
  };
});
