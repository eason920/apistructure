import atsRequest from '../../atsRequest.js';

// 給 token
atsRequest.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;

// --------------------------------
// -- PERMISSION
// --------------------------------
// [取得與修改特定group的permission]
// 不給 data 即是純取值
//   給 data 即修改值
// http://{{HOST_IP}}:{{HOST_PORT}}/api/permissions/6
export const apiPutGetAndChangeGroupPermissions = (group_id, data) =>
  atsRequest.put('/api/permissions/' + group_id, data);

// --------------------------------
// -- USER
// --------------------------------
// [取得所有user list]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/user/mgnt/list
export const apiGetAllUserList = () => atsRequest.get('/api/user/mgnt/list');

// [取得特定group的所有user]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6
export const apiGetGroupUsers = (group_id) => atsRequest.get('/api/groups.users/' + group_id);

// [往 group (by group_id) 中新增特定 user (by user_id)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6/6
export const apiPostAddUserIntoGroup = (group_id, user_id) =>
  atsRequest.post(`/api/groups.users/${group_id}/${user_id}`);

// [往 group (by group_id) 中刪除特定 user (by user_id)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups.users/6/6
// delete
export const apiDelUserFromGroup = (group_id, user_id) => atsRequest.delete(`/api/groups.users/${group_id}/${user_id}`);

// --------------------------------
// -- GROUP
// --------------------------------
// [取得 group list]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups
export const apiGetGroupList = () => atsRequest.get('/api/groups');

// [新增 group (給名字 only ) (無user & premission 得編)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups
export const apiPostAddNewGroup = (data) => atsRequest.post('/api/groups', data);

// [修改 group 名字 (無user & premission 得編)]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups/6
export const apiPutChangeGroupName = (group_id, data) => atsRequest.put(`/api/groups/${group_id}`, data);

// [刪除特定 group]
// http://{{HOST_IP}}:{{HOST_PORT}}/api/groups/5
export const apiDelGroup = (group_id) => atsRequest.delete(`/api/groups/${group_id}`);
