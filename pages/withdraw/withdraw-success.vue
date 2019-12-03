<template>
  <view class="withdraw-success">
    <StatusBarHeader title="提现申请提交成功" :back="true" @goback="back" />
    <view class="success">
      <image src="../../static/pay/success.png" class="success-logo" />
      <text class="success-tips">您的提现申请已提交成功</text>
      <text class="success-wait">加速审核中，请耐心等待~</text>
    </view>
    <view class="Amount">
      <view class="A-item">
        <text>银行卡</text>
        <text>{{ cardEnd }}</text>
      </view>
      <view class="A-item">
        <text>提现金额</text>
        <text class="money">¥{{ money }}</text>
      </view>
    </view>

    <view class="look-order" @tap="goTo('/pages/gold/gold')">查看我的金币</view>
    <view class="back-index" @tap="goTo(`/pages/home/home`, 'switchTab')"
      >返回首页</view
    >
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
export default {
  components: {
    StatusBarHeader
  },
  data() {
    return {
      money: "",
      cardEnd: ""
    };
  },
  onLoad(options) {
    this.money = options.money || "";
    this.cardEnd = options.cardEnd || "";
  },
  methods: {
    back() {
      uni.navigateTo({ url: "/pages/gold/gold" });
    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    }
  }
};
</script>


<style lang="less">
@import url("./withdraw-success");
</style>