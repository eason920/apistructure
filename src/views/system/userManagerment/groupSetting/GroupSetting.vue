<template>
  <div class="groupSetting">
    <div v-if="sCurrentPage === 'visit'" class="titleBox">
      <div class="titleBox_selectBox">
        <span>Group</span>
        <Selector :props-change-selected="nSelectedGroupID" @emit_selected_option="fnGetEmitSelectedOption" />
        <div class="btn is_into_edit" @click="fnGoPageEdit"><EditIcon />Edit</div>
      </div>
      <div>
        <div class="btn" @click="fnGoPageAdd"><AddIcon />Add New Group</div>
      </div>
    </div>
    <!-- Visit Group -->
    <div v-if="sCurrentPage === 'visit'" class="groupBox">
      <div class="mainBox">
        <div class="leftBox">
          <h6 class="title">Group Member List</h6>
          <ul class="listBox">
            <VisitUserList :props-group-id="nSelectedGroupID" />
          </ul>
        </div>
        <div class="rightBox" :class="[{ is_visit_checkbox: sCurrentPage === 'visit' }]">
          <PermissionList :props-checkbox-editable="true" :props-group-id="nSelectedGroupID" />
        </div>
      </div>
    </div>
    <!-- Edit Group -->
    <div v-if="sCurrentPage === 'edit'" class="groupBox">
      <div class="mainBox">
        <div class="leftBox">
          <h6 class="title">
            Editing Group :
            <n-input v-model:value="sEditingSelectdGroupName" class="edit_add_ipt" />
          </h6>
          <div class="transfer_title">
            <h6 class="title">All User</h6>
            <h6 class="title">Group Member</h6>
          </div>
          <div class="transfer_outer_edit">
            <div class="transfer_arrow">
              <span>新增</span>
              <span>移除</span>
            </div>
            <n-transfer
              ref="transfer"
              v-model:value="aGroupUsers.data"
              :options="oAllUserList.data"
              :render-source-list="fnChangeTransferUiTextRight()"
            />
          </div>
        </div>
        <div class="rightBox">
          <!-- has emit Permisssion cpn v -->
          <PermissionList
            :props-checkbox-editable="false"
            :props-group-id="nSelectedGroupID"
            @emit_pms_update_obj="fnGetEmitPmsUpdateObj"
          />
        </div>
      </div>
      <div class="footerBox">
        <!-- Back(in edit) -->
        <div class="btn" @click="fnEditBack"><img src="@/assets/images/publicImages/icon_delete.svg" />Back</div>
        <!-- Delete(in edit) -->
        <div class="btn" @click="fnshowModalEdit('刪除')">
          <img src="@/assets/images/publicImages/icon_delete.svg" />Delete
        </div>
        <!-- Confirm(in edit) -->
        <div class="btn" @click="fnshowModalEdit('修改')">
          <img src="@/assets/images/publicImages/icon_confirm.svg" />Confirm
        </div>
      </div>
    </div>
    <!-- Add Group -->
    <div v-if="sCurrentPage === 'add'" class="groupBox">
      <div class="mainBox">
        <div class="leftBox">
          <h6 class="title">Add New Group</h6>
          <div class="row">
            <div class="left">New Group Name</div>
            <n-input v-model:value="sNewGroupName" class="edit_add_ipt" />
            <!-- <div v-if="!bNewGroupNameAdded" class="right">
            </div>
            <div v-else>
              {{ sNewGroupName }}
            </div> -->
          </div>
          <div class="transfer_title">
            <h6 class="title">All User</h6>
            <h6 class="title">Group Member</h6>
          </div>
          <div class="transfer_outer_add">
            <!-- <div class="row">
              <div class="left">Copy Group</div>
              <Selector @emit_selected_option="fnGetEmitSelectedOption" />
            </div> -->
            <div class="transfer_arrow">
              <span>新增</span>
              <span>移除</span>
            </div>
            <n-transfer
              ref="transfer"
              v-model:value="aGroupUsers.data"
              :options="oAllUserList.data"
              :render-source-list="fnChangeTransferUiTextRight()"
            />
          </div>
        </div>
        <div class="rightBox">
          <PermissionList
            :props-checkbox-editable="false"
            :props-group-id="nSelectedGroupID"
            @emit_pms_update_obj="fnGetEmitPmsUpdateObj"
          />
        </div>
      </div>
      <div class="footerBox">
        <!-- Back(add) -->
        <div class="btn" @click="fnAddBack"><img src="@/assets/images/publicImages/icon_confirm.svg" />Back</div>
        <!-- Confirm(add) -->
        <div class="btn" @click="fnShowModalAdd">
          <img src="@/assets/images/publicImages/icon_confirm.svg" />Confirm
        </div>
      </div>
    </div>
  </div>
  <n-modal
    v-model:show="showModalEdit"
    :mask-closable="false"
    preset="dialog"
    title=""
    :content="'確認' + sModalEditWhere + ' group ' + sInitSelectdGroupName + ' ?'"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="fnPositiveClickEdit"
    @negative-click="fnNegativeClickEdit"
  />

  <n-modal
    v-model:show="showModalAdd"
    :mask-closable="false"
    preset="dialog"
    title=""
    :content="'確認新增 group ' + sNewGroupName + ' ?'"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="fnPositiveClickAdd"
    @negative-click="fnNegativeClickAdd"
  />
</template>

<script setup>
import {
  ref,
  reactive
  // onMounted,
  // watch
  // computed,
} from 'vue';
import { useMessage } from 'naive-ui';
// icon
import { AddCircle32Regular as AddIcon } from '@vicons/fluent';
import { Edit as EditIcon } from '@vicons/tabler';

// Components
import Selector from './components/Selector.vue';
import VisitUserList from './components/VisitUserList.vue';
import PermissionList from './components/Permissions.vue';

// API
import {
  apiPutGetAndChangeGroupPermissions,
  //
  apiGetAllUserList,
  apiGetGroupUsers,
  apiPostAddUserIntoGroup,
  apiDelUserFromGroup,
  //
  // apiGetGroupList,
  apiPostAddNewGroup,
  apiDelGroup
  // some
} from '@/api/axios/system/userInfo/groupSetting.js';

// ==========================================
// == GLOBAL START v
// ==========================================
// var
// visit, edit, add
const sCurrentPage = ref('visit');

// GROUP NAME
const sInitSelectdGroupName = ref('');
const sSelectdGroupName = ref(sInitSelectdGroupName.value);

// GROUP ID v
let nInitSelectedGroupID = null;
const nSelectedGroupID = ref(nInitSelectedGroupID);

// PMS ID v
// const nInitSelectedGroupPMSID = 1;
// const nSelectedGroupPMSID = ref(nInitSelectedGroupID);

const fnGetEmitSelectedOption = (obj) => {
  console.log('(emit) selected option is ', obj);
  sInitSelectdGroupName.value = obj.label;
  sSelectdGroupName.value = obj.label;
  nSelectedGroupID.value = obj.value;
  // nSelectedGroupPMSID.value = obj.permission_id;
};

// USER LIST v
const oAllUserList = reactive({ data: [] });
const aGroupUsers = reactive({ data: [] });
const aGroupUsersOrg = reactive({ data: [] });

const fnApiGetAllUserList = () => {
  apiGetAllUserList()
    .then((res) => {
      if (res.status === 200) {
        const ary = [];
        res.data.users.forEach((item) => {
          ary.push({ label: item.name, value: item.id });
        });
        oAllUserList.data = ary;
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

const fnApiGetGroupUsers = (gid) => {
  if (gid !== 'add') {
    console.log('not add');
    // page edit
    apiGetGroupUsers(gid)
      .then((res) => {
        if (res.status === 200) {
          const ary = [];
          res.data.users.forEach((item) => {
            ary.push(item.id);
          });
          aGroupUsers.data = ary;
          aGroupUsersOrg.data = ary;
        }
      })
      .catch((err) => {
        console.log('apiGetGroupUsers err');
        alert(err.response);
      });
  } else {
    console.log('is add');
    // page add
    aGroupUsers.data = [];
    aGroupUsersOrg.data = [];
  }
};

const fnChangeTransferUiTextLeft = () => {
  setTimeout(() => {
    const leftText = document
      .querySelector('.n-transfer-list--source')
      .querySelector('.n-transfer-list-header__extra').innerText;
    console.log('leftText is', leftText);
    document.querySelector('.n-transfer-list--source').querySelector('.n-transfer-list-header__extra').innerText =
      leftText.replace('items', 'users');
  }, 50); // 等待 dom 元素 render 定位
};

const fnChangeTransferUiTextRight = () => {
  setTimeout(() => {
    const rightText = document
      .querySelector('.n-transfer-list--target')
      .querySelector('.n-transfer-list-header__extra').innerText;
    console.log('rightText is', rightText);
    document.querySelector('.n-transfer-list--target').querySelector('.n-transfer-list-header__extra').innerText =
      rightText.replace('items', 'users');
  }, 0); // 等待 dom 元素 render 定位
};
// ==========================================
// == GLOBAL END ^
// ==========================================

// ==========================================
// == PAGE EDIT START v
// ==========================================
let emitPmsUpdateObj = reactive();
const sEditingSelectdGroupName = ref('');

const fnGoPageEdit = () => {
  switch (nSelectedGroupID.value) {
    case null:
      alert('Please select a group on the left');
      break;
    case 1:
      alert('Administrator group prohibits modification');
      break;
    default:
      sEditingSelectdGroupName.value = sSelectdGroupName.value;
      sCurrentPage.value = 'edit';
      fnChangeTransferUiTextLeft();
      fnApiGetAllUserList();
      fnApiGetGroupUsers(nSelectedGroupID.value);
      break;
  }
};

const fnGetEmitPmsUpdateObj = (value) => {
  console.log('fnGetEmitPmsUpdateObj value is ', value);
  emitPmsUpdateObj = value;
};

const fnApiPutChangeGroupPms = (gid, isEditSubmit) => {
  if (gid !== 1) {
    const name = isEditSubmit ? sEditingSelectdGroupName.value : sSelectdGroupName.value;
    const obj = {
      name,
      permission: emitPmsUpdateObj
    };
    apiPutGetAndChangeGroupPermissions(gid, obj)
      .then((res) => {
        if (res.status === 200) {
          console.log('%capiPutChangeGroupPms active', 'color: greenyellow');
        }
      })
      .catch((err) => {
        alert(err.response);
      });
  } else {
    alert('Administrator not allowed to update');
  }
};

const fnApiUpdateDelUserListWithGroup = () => {
  console.log('aGroupUsersOrg is ', aGroupUsersOrg.data);
  console.log('aGroupUsers is ', aGroupUsers.data);

  // ADD
  let added = 0;
  aGroupUsers.data.forEach((id) => {
    const index = aGroupUsersOrg.data.findIndex((oId) => oId === id);
    if (index < 0) {
      fnApiPostAddUserIntoGroup(nSelectedGroupID.value, id);
      added++;
    }
  });

  // SUBTRACTION
  let subtraction = 0;
  aGroupUsersOrg.data.forEach((id) => {
    const index = aGroupUsers.data.findIndex((oId) => oId === id);
    if (index < 0) {
      fnApiDelUserFromGroup(nSelectedGroupID.value, id);
      subtraction++;
    }
  });

  console.log(`add is ${added}, sub is ${subtraction}`);

  aGroupUsersOrg.data = aGroupUsers.data;
};

// 從 group 新增會員
const fnApiPostAddUserIntoGroup = (gid, uid) => {
  apiPostAddUserIntoGroup(gid, uid)
    .then((res) => {
      if (res.status === 200) {
        console.log('apiPostAddUserIntoGroup Active');
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

// 從 group 刪除會員
const fnApiDelUserFromGroup = (gid, uid) => {
  apiDelUserFromGroup(gid, uid)
    .then((res) => {
      if (res.status === 200) {
        console.log('apiDelUserFromGroup Active, res is ', res.data);
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

// MODAL
const showModalRefEdit = ref(false);
const showModalEdit = showModalRefEdit;
const sModalEditWhere = ref('');

const fnshowModalEdit = (where) => {
  showModalEdit.value = 'true';
  sModalEditWhere.value = where;
  console.log('nSelectedGroupID is ', nSelectedGroupID.value);
  // console.log('nSelectedGroupPMSID is ', nSelectedGroupPMSID.value);
};

// comfirm click comfirm v
const fnPositiveClickEdit = () => {
  if (sModalEditWhere.value === '修改') {
    // 更新 user list
    fnApiUpdateDelUserListWithGroup();
    // 更新 permision list
    fnApiPutChangeGroupPms(nSelectedGroupID.value, true);
    sInitSelectdGroupName.value = sSelectdGroupName.value;
    sEditingSelectdGroupName.value = sSelectdGroupName.value;
    // 更新 end

    fnEditAddSuccessBack();
  } else {
    console.log('%c執行刪除函式', 'color:red');
    fnApiDelGroup(nSelectedGroupID.value);

    // 更新 group list
    nSelectedGroupID.value = nInitSelectedGroupID;
    // nSelectedGroupPMSID.value = nInitSelectedGroupPMSID;
  }
  message.success(sModalEditWhere.value + '成功');
  showModalRefEdit.value = false;
  sCurrentPage.value = 'visit';
};

// comfirm click cancel v
const fnNegativeClickEdit = () => {
  showModalRefEdit.value = false;
  console.log('negative');
};

const fnEditBack = () => {
  sEditingSelectdGroupName.value = '';
  sCurrentPage.value = 'visit';
};

// 刪除 group
const fnApiDelGroup = (gid) => {
  apiDelGroup(gid)
    .then((res) => {
      if (res.status === 200) {
        console.log('apiDelGroup res is', res.data);
        nSelectedGroupID.value = nInitSelectedGroupID;
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

// ==========================================
// == PAGE EDIT END ^
// ==========================================

// ==========================================
// == PAGE ADD START v
// ==========================================
const sNewGroupName = ref('');
// const bNewGroupNameAdded = ref(false);

// const fnApiPostAddNewGroup = () => {
//   const obj = {
//     name: sNewGroupName.value,
//     permission: emitPmsUpdateObj
//   };
//   apiPostAddNewGroup(obj).then((res) => {
//     console.log('apiPostAddNewGroup res is ', res.data);
//     // bNewGroupNameAdded.value = true;
//     nSelectedGroupID.value = res.data.group.id;
//     // nSelectedGroupPMSID.value = res.data.group.permission_id;
//     console.log('new gid is', nSelectedGroupID.value);
//     // console.log('new pmsid is ', nSelectedGroupPMSID.value);
//   });
// };

const fnAddBack = () => {
  // init
  nSelectedGroupID.value = nInitSelectedGroupID;
  sSelectdGroupName.value = sInitSelectdGroupName.value;
  sNewGroupName.value = '';

  // 換頁
  sCurrentPage.value = 'visit';
};

// MODAL
const showModalRefAdd = ref(false);
const showModalAdd = showModalRefAdd;

const fnShowModalAdd = () => {
  if (sNewGroupName.value !== '') {
    showModalAdd.value = true;
    console.log('oAllUserList is ', oAllUserList.data);
    console.log('aGroupUsers is ', aGroupUsers.data);
  } else {
    alert('new group name 不得為空');
  }
};

// comfirm click comfirm v
const fnPositiveClickAdd = () => {
  const fnDoneBack = () => {
    // UI
    message.success('newGroupName 新增成功');
    showModalRefAdd.value = false;
    sCurrentPage.value = 'visit';

    // init name add input
    // bNewGroupNameAdded.value = false;
    sNewGroupName.value = '';
  };

  const obj = {
    name: sNewGroupName.value,
    permission: emitPmsUpdateObj
  };

  apiPostAddNewGroup(obj)
    .then((res) => {
      console.log(res);
      console.log('apiPostAddNewGroup res is ', res.data);
      // bNewGroupNameAdded.value = true;
      nSelectedGroupID.value = res.data.group.id;
      // nSelectedGroupPMSID.value = res.data.group.permission_id;
      console.log('new gid is', res.data.group.id);
      // console.log('new pmsid is ', nSelectedGroupPMSID.value);

      // 更新 user list
      const maxIndex = aGroupUsers.data.length - 1;
      console.log('%cmaxIndex is ' + maxIndex, 'color: red');
      console.log('%cmaxIndex < 0 ?' + (maxIndex === -1), 'color:red');
      if (maxIndex !== -1) {
        aGroupUsers.data.forEach((id, i) => {
          fnApiPostAddUserIntoGroup(nSelectedGroupID.value, id);
          console.log('i is', i, '/ maxIndex is', maxIndex, '/i === maxIndex?', i === maxIndex);
          console.log('maxIndex === 0 ?', maxIndex === 0);
          if (i === maxIndex) {
            fnDoneBack();
            fnEditAddSuccessBack();
          }
        });
      } else {
        fnDoneBack();
        fnEditAddSuccessBack();
      }
    })
    .catch((err) => {
      alert(err.response);
    });
};

const fnEditAddSuccessBack = () => {
  // 兩段強制更新 group list
  const currentGroupId = nSelectedGroupID.value;
  // const currentPmsId = nSelectedGroupPMSID.value;
  // nSelectedGroupID.value = 1;
  // nSelectedGroupPMSID.value = nInitSelectedGroupPMSID;
  // setTimeout(() => {
  nSelectedGroupID.value = currentGroupId;
  // nSelectedGroupPMSID.value = currentPmsId;
  // }, 500);
};

// comfirm click cancel v
const fnNegativeClickAdd = () => {
  showModalRefAdd.value = false;
};

const fnGoPageAdd = () => {
  fnChangeTransferUiTextLeft();
  fnApiGetAllUserList();
  sCurrentPage.value = 'add';
  nSelectedGroupID.value = 'add';
  // nSelectedGroupPMSID.value = 'add';
  fnApiGetGroupUsers(nSelectedGroupID.value); // add
};
// ==========================================
// == PAGE ADD END ^
// ==========================================

// dialog
const message = useMessage();
</script>

<style lang="scss" scoped>
// --------------------------------
// custom
@import '@/assets/style/publicStyle';
@import '@/assets/style/userManagerment/groupSetting/groupSetting.scss';
</style>

<style lang="scss">
// naive ui
@import '@/assets/style/publicStyle';
@import '@/assets/style/userManagerment/groupSetting/groupSetting_naive.scss';
</style>
