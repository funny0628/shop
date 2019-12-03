import Http from '@/api/request.js';
export default {
  // 消息列表
  async get(num) {
    return await Http.post({
      action: 'message',
      app: 'index',
      num
    });
  },
  // 加载更多..
  async loadMore(page) {
    return await Http.post({
      action: 'message',
      app: 'more',
      page
    });
  },
  // 删除消息
  async delete(id) {
    return await Http.post({
      action: 'message',
      app: 'del',
      id
    });
  },
  // 读取消息
  async read(id) {
    return await Http.post({
      id,
      type: 2,
      action: 'message',
      app: 'oneindex'
    });
  },
  // 读取全部消息
  async readAll() {
    return await Http.post({
      action: 'message',
      app: 'all'
    });
  }
};
