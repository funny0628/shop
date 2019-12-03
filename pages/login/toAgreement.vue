<template>
  <view class="agreement" @tap="toAreement">
    注册/登录即代表已同意
    <text class="i-text">《用户协议》</text>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    toAreement() {
      uni.navigateTo({
        url: "/pages/login/agreement"
      });
    }
  }
};
</script>

<style lang='less' scoped>
.agreement {
  // position: absolute;
  // bottom: 0;
  margin-top: 100upx;
  height: 100upx;
  width: 100%;
  font-size: 24upx;
  color: #b6b6b6;
  display: flex;
  align-items: center;
  justify-content: center;
  .i-text {
    text-decoration: underline;
    color: #f84e91;
  }
}
</style>