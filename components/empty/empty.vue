<template>
  <view class="empty">
    <image src="../../static/common/empty.png" class="empty-icon"></image>
    <view class="empty-text">{{ content }}</view>
    <slot name="button"></slot>
  </view>
</template>
<script>
export default {
  name: "empty-content",
  props: ["content"]
};
</script>
<style lang="less">
.empty {
  padding-top: 113upx;
  &-icon {
    display: block;
    margin: 0 auto;
    width: 158upx;
    height: 158upx;
  }
  &-text {
    text-align: center;
    margin-top: 40upx;
    height: 26upx;
    line-height: 26upx;
    font-size: 26upx;
    color: #818181;
  }
}
</style>
