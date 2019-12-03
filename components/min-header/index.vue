<template>
  <view class="header-wrap" :style="{ height: BoxHeight }">
    <!-- 这里如果是app的话要多加一个这个，h5这里为0 -->
    <view :style="{ height: halfWidth }"></view>
    <view class="header" v-if="title">
      <view class="left-back" @tap="backHandle">
        <image :src="back" alt="" />
      </view>
      <text>{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    backUrl: {
      required: false,
      type: String
    },
    callback: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      BoxHeight: "",
      halfWidth: "",
      back: "../../static/login/back2x.png"
    };
  },
  mounted() {
    var me = this;
    uni.getSystemInfo({
      success(res) {
        //app 端信息打印
        // me.$showMsg(`${JSON.stringify(res)}`, () => {}, 66666);
        me.halfWidth = res.statusBarHeight + "px";
        var height = uni.upx2px(88);
        me.BoxHeight = res.statusBarHeight + height + "px";
      }
    });
  },
  methods: {
    backHandle() {
      console.log(this.callback);
      if (this.callback) {
        this.callback();
      } else {
        uni.navigateBack();
      }
    }
  }
};
</script>


<style lang='less' scoped>
.header-wrap {
  background-image: linear-gradient(90deg, #f78c87 0%, #ec597c 100%),
    linear-gradient(#000000, #000000);
  background-blend-mode: normal, normal;
  .header {
    position: relative;
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
    text {
      display: block;
      text-align: center;
      width: 100%;
      height: 100%;
      line-height: 88upx;
      font-size: 34upx;
      color: #fefefe;
      font-weight: 500;
      font-size: 32upx;
    }
  }
}
</style>