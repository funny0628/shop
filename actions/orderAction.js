import Http from '@/api/request.js';
export default {
	// 删除订单
	async deleteOrder(params = {}) {
		return await Http.post({
			action: 'order',
			app: 'del_order',
			...params
		});
	},
	//  取消订单
	async cancelOrder(params = {}) {
		return await Http.post({
			action: 'order',
			app: 'removeOrder',
			...params
		});
	},
	// 确认收货
	async confirmTake(params = {}) {
		return await Http.post({
			action: 'order',
			app: 'ok_Order',
			...params
		});
	}
};
