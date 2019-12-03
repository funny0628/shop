<template>
  <view class="guide">
    <swiper
      style="height:100vh"
      circular="false"
      :autoplay="true"
      :indicator-dots="false"
      interval="2000"
    >
      <swiper-item v-for="(item, index) in guidePic" :key="index">
        <view class="item">
          <image
            :src="item.image"
            style="width:750upx;height:100vh;position:absolute;"
          ></image>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      guidePic: []
    };
  },
  onLoad() {
    this.getGuide();
  },
  methods: {
    getGuide() {
      this.$Http
        .post({
          app: "guided_graph",
          action: "index"
        })
        .then(res => {
          console.log("res", res.list);
          this.guidePic = res.list;
          this.hideGuide();
        })
        .catch(e => {
          this.guidePic = [];
          this.hideGuide();
        });
    },
    hideGuide() {
      setTimeout(() => {
        uni.switchTab({
          url: "/pages/home/home"
        });
      }, 2000);
    }
  }
};
</script>
<style lang="less">
.guide {
  width: 750upx;
  position: relative;
  .item {
    position: absolute;
    width: 750upx;
    height: 100vh;
    background-color: #fff;
  }
}
</style>