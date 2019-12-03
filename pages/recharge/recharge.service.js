export default {
  getProvider() {
    return new Promise((res,rej) => {
      uni.getProvider({
        service: 'payment',
        success: e => {
          res(e)
        },
        fail: e => {
          rej(e)
        }
      });
    });
  },
  requestPayment(id, orderInfo) {
    return new Promise((res,rej) => {
      uni.requestPayment({
        provider: id,
        orderInfo: orderInfo,
        success: (e) => {
            res(e)
        },
        fail: (e) => {
            rej(e)
        },
        complete: () => {
          console.log("支付流程完毕")
        }
    })
    })
  }
};
