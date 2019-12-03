import Http from '@/api/request.js';

export default {
  async getDetail(id) {
    return await Http.post({
      app: 'index',
      action: 'product',
      pro_id: id
    });
  },
  async preview(order_products) {
    return await Http.post({
      action: 'order',
      app: 'preview',
      order_products: JSON.stringify([order_products])
    });
  }
};
