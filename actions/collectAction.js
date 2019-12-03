import Http from '@/api/request.js';
export default {
  // 获取收藏
  async getCollect(params = {}) {
    return await Http.post({
      action: 'addFavorites',
      app: 'collection',
      type: 1,
      ...params
    });
  },
  // 添加收藏
  async addCollect(pro_id) {
    return await Http.post({
      action: 'addFavorites',
      app: 'index',
      // 商品id
      pro_id
    });
  },
  // 取消收藏
  async removeCollect(id) {
    return await Http.post({
      action: 'addFavorites',
      app: 'removeFavorites',
      // 商品id
      collection: id
    });
  }
};
