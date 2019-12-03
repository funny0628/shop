import Http from '@/api/request.js';
export default {
  // 地址列表
  async get() {
    return await Http.post({
      action: 'address',
      app: 'index'
    });
  },
  // 新增地址
  async create(info) {
    return await Http.post({
      ...info,
      action: 'address',
      app: 'SaveAddress'
    });
  },
  // 修改地址
  async update(info) {
    return await Http.post({
      ...info,
      action: 'address',
      app: 'up_adds'
    });
  },
  // 删除地址
  async delete(addr_id) {
    return await Http.post({
      action: 'address',
      app: 'del_adds',
      addr_id
    });
  },
  //设置默认地址
  async setDf(addr_id) {
    return await Http.post({
      action: 'address',
      app: 'set_default',
      addr_id
    });
  }
};
