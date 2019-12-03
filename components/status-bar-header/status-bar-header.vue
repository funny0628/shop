<template>
  <view class="status-bar-header">
    <view class="status-bar"></view>
    <view class="header">
      <slot name="icon"></slot>
      <image
        v-if="back"
        src="../../static/common/back.png"
        class="back"
        @tap="goBack"
      />
      {{ title }}</view
    >
  </view>
</template>
<script>
export default {
  name: "status-bar-header",
  props: ["title", "back"],
  methods: {
    goBack() {
      this.$emit("goback");
    }
  }
};
</script>
<style lang="less">
.status-bar-header {
  @bg-img: linear-gradient(90deg, #f78c87 0%, #ec597c 100%),
    linear-gradient(#000000, #000000);
  padding-top: calc(var(--status-bar-height) + 88upx);
  .status-bar {
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 0;
    width: 750upx;
    height: var(--status-bar-height);
    background-image: @bg-img;
  }
  .header {
    z-index: 9999;
    position: fixed;
    left: 0;
    top: var(--status-bar-height);
    text-align: center;
    width: 750upx;
    height: 88upx;
    line-height: 88upx;
    font-size: 34upx;
    color: #fff;
    background-image: @bg-img;
  }
  .back {
    position: absolute;
    left: 30upx;
    top: 19upx;
    width: 50upx;
    height: 50upx;
  }
}
</style>