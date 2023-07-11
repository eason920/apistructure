import atsRequest from '../../atsRequest.js';

// 給 token
atsRequest.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;

// --------------------------------
// -- USER MULTIPLE
// --------------------------------
// [查所有user list]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/user/mgnt/list
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/user/mgnt/list (同，未改)
export const apiGetAllUserList = () => atsRequest.get('/api/user/mgnt/list');

// --------------------------------
// -- USER SINGLE
// --------------------------------
// USER ADD
// [往 group (by group_id) 中新增特定 user (by user_id)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6/6
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group/1/user/2
export const apiPostAddUserIntoGroup = (group_id, user_id) =>
  // atsRequest.post(`/api/groups.users/${group_id}/${user_id}`);
  atsRequest.post(`/api/group/${group_id}/user/${user_id}`);

// [查特定group的所有user]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group/1/user
export const apiGetGroupUsers = (group_id) =>
  // atsRequest.get('/api/groups.users/' + group_id);
  atsRequest.get('/api/group/' + group_id + '/user');

// 沒有改

// USER DEL
// [往 group (by group_id) 中刪除特定 user (by user_id)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6/6
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group/1/user/2
export const apiDelUserFromGroup = (group_id, user_id) =>
  // atsRequest.delete(`/api/groups.users/${group_id}/${user_id}`);
  atsRequest.delete(`/api/group/${group_id}/user/${user_id}`);

// --------------------------------
// -- GROUP MULTIPLE
// --------------------------------
// [取得 group list]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group
export const apiGetGroupList = () =>
  // atsRequest.get('/api/groups');
  atsRequest.get('/api/group');

// --------------------------------
// -- GROUP SINGLE
// --------------------------------
// [增一 group (給名字 & premission) (無user 得編)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group
export const apiPostAddNewGroup = (data) =>
  // atsRequest.post('/api/groups', data);
  atsRequest.post('/api/group', data);

// [查特定group的permission]
// [改特定group的permission & name]
// 不給 data 即是純取值
//   給 data 即修改值
// http://{{HOST_IP}}:{{HOST_PORT}}/api/permissions/6
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group/4
export const apiPutGetAndChangeGroupPermissions = (group_id, data) =>
  // atsRequest.put('/api/permissions/' + group_id, data);
  atsRequest.put('/api/group/' + group_id, data);
// *** ^^^>>> 如 group_id 為 1 時，現在會因「查&改」在一起 & 後端會檔「改」1，固導致查也噴錯
// *** ^^^>>> 再找時間，若查的 gid 為 1 時改用 apiGetGroupList 來改
// *** ^^^>>> 或改成，「查」時用 apiGetGroupList，「改」時用這+檔 gid1

// [改 group 名字 (無user & premission 得編)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups/6
// export const apiPutChangeGroupName = (group_id, data) => atsRequest.put(`/api/groups/${group_id}`, data);
// ** 合併到 apiPutGetAndChangeGroupPermissions

// [刪除特定 group]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups/5
// new v
// http://{{HOST_IP}}:{{HOST_PORT}}/api/group/5
export const apiDelGroup = (group_id) =>
  // atsRequest.delete(`/api/groups/${group_id}`);
  atsRequest.delete(`/api/group/${group_id}`);
