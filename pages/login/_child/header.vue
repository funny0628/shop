<template>
  <view class="wrap">
    <StatusBarHeader title=" " :back="true" @goback="backHandle" />
    <text>{{ title }}</text>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import { loginBack } from "@/utils/index.js";
export default {
  components: { StatusBarHeader },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    backHandle() {
      const pages = getCurrentPages();
      // if (pages[pages.length - 1].route === "pages/login/register") {
      //   //登陆页面的回退逻辑
      //   uni.navigateBack({ delta: 2 });
      // } else {
      // };
      uni.navigateBack();
    }
  }
};
</script>
<style scoped lang='less'>
@bg-img: linear-gradient(90deg, #f78c87 0%, #ec597c 100%),
  linear-gradient(#000000, #000000);
.wrap {
  width: 100%;
  height: calc(var(--status-bar-height) + 378upx);
  background: @bg-img no-repeat;
  background-size: 100%;
  margin-bottom: -84upx;
  position: relative;
  text {
    position: absolute;
    left: 30upx;
    top: calc(var(--status-bar-height) + 171upx);
    font-family: MicrosoftYaHei;
    font-size: 58upx;
    line-height: 38.7upx;
    color: #ffffff;
  }
  .left-back {
    height: 88upx;
    width: 100upx;
    display: inline-block;
    position: absolute;
    image {
      position: absolute;
      top: 26upx;
      left: 20upx;
      width: 36upx;
      height: 36upx;
    }
  }
}
</style>
