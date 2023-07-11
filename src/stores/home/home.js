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
const apiSelfPms = () => atsRequest.get('/api/user/permission');

export const useHomeStore = defineStore('useHomeStore', () => {
  // --------------------------------
  // -- STATE & GETTERS
  // --------------------------------
  const apiSelfPmsRes = reactive({ data: {} });

  // --------------------------------
  // -- ACTION + MUTATIONS
  // --------------------------------
  const fnApiSelfPms = async () => {
    return new Promise((resolve) => {
      // (sApiName, oAXiosApi, fnWhenSuccess)
      resolve(fnApiCall('apiSelfPms', apiSelfPms, fnStatusSuccessSelfPms));
    });
  };

  const fnStatusSuccessSelfPms = (res) => {
    // success
    let bHasPms = false;
    console.log('res.data.permission.GoNogo is', res.data.permission.GoNogo);
    console.log(res.data.permission, typeof res.data.permission, typeof res.data.permission === 'object');
    const ary = [
      {
        title: 'Basic',
        unit: [
          { showName: 'Test Program', name: 'TestProgramList', havePermission: false },
          { showName: 'Report Editor', name: 'Home', havePermission: false },
          { showName: 'Report Generator', name: 'ReportGeneratorIndex', havePermission: false },
          { showName: 'Go/Nogo', name: 'GoNogo', havePermission: false }
        ]
      },
      {
        title: 'Advance',
        unit: [
          { showName: 'Test Item', name: 'Home', havePermission: false },
          { showName: 'Statistics', name: 'Home', havePermission: false },
          { showName: 'Report Wizard', name: 'Home', havePermission: false },
          { showName: 'Online Control', name: 'Home', havePermission: false }
        ]
      },
      {
        title: 'System',
        unit: [
          { showName: 'H/W Configuration', name: 'HWCDevice', havePermission: false },
          { showName: 'User Management', name: 'GroupSetting', havePermission: false },
          { showName: 'About', name: 'Home', havePermission: false }
        ]
      }
    ];

    if (res.data.permission.GoNogo !== undefined) {
      const data = res.data.permission;
      for (let a in data) {
        if (data[a] === 1) {
          switch (a) {
            // 0 basic
            case 'TestProgram':
              ary[0].unit[0].havePermission = true;
              break;
            case 'ReportGenerate':
              ary[0].unit[2].havePermission = true;
              break;
            case 'GoNogo':
              ary[0].unit[3].havePermission = true;
              break;
            // 2 system
            case 'HWConfigFile':
              ary[2].unit[0].havePermission = true;
              break;
            case 'User':
              ary[2].unit[1].havePermission = true;
              break;
            default:
          }
        }
      }
      // ary[0].unit.push({ showName: 'Report Editor', name: 'Home' });
      // ary[2].unit.push({ showName: 'About', name: 'Home' });
      ary.forEach((item, i) => {
        if (ary[i].unit.length < 4) {
          const n = 4 - ary[i].unit.length;
          for (let a = 1; a <= n; a++) {
            ary[i].unit.push({ show: '', name: '', havePermission: false });
          }
        }
      });
      bHasPms = true;
    }

    apiSelfPmsRes.data.ary = ary;
    apiSelfPmsRes.data.hasPms = bHasPms;
    // console.log('>>>apiSelfPmsRes is', apiSelfPmsRes);
  };

  return {
    fnApiSelfPms,
    apiSelfPmsRes
  };
});
