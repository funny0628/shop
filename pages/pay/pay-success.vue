<template>
  <view class="pay-success">
    <StatusBarHeader title="支付" :back="true" @goback="back" />
    <image src="../../static/pay/success.png" class="success-logo" />
    <text class="success-tips">支付成功</text>
    <view class="look-order" @tap="goTo(`/pages/order/detail?id=${opt.orderId}`)">查看订单</view>
    <view class="back-index" @tap="goTo(`/pages/home/home`, 'switchTab')">回到首页</view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
export default {
  name: "pay-success",
  components: {
    StatusBarHeader
  },
  data() {
    return {
      opt: {}
    };
  },
  onLoad(opt) {
    this.opt = opt;
    console.log("opt---------->", opt)
  },
  methods: {
    back() {
      uni.navigateBack()
    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    },
  }
};
</script>
<style lang="less">
.btn {
  text-align: center;
  width: 580upx;
  height: 80upx;
  line-height: 80upx;
  border-radius: 40upx;
  font-size: 30upx;
}
.pay-success {
  height: 100%;
  background-color: #f6f6f6;
  .success-logo {
    display: block;
    margin: 170upx auto 0;
    width: 430upx;
    height: 286upx;
  }
  .success-tips {
    display: block;
    text-align: center;
    width: 750upx;
    height: 126upx;
    line-height: 126upx;
    text-align: center;
    font-size: 26upx;
    color: #414141;
  }
  .look-order {
    &:extend(.btn);
    margin: 50upx auto;
    background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#c93802, #c93802);
    box-shadow: 0upx 5upx 10upx 0upx rgba(255, 0, 61, 0.35);
    background-color: rgba(0, 0, 0, 0.9);
    color: #fff;
  }
  .back-index {
    &:extend(.btn);
    margin: 0 auto;
    background-color: #f6f6f6;
    border: solid 2px #e5e5e5;
    color: #414141;
  }
}
</style>