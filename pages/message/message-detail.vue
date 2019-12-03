<template>
  <view class="message-detail">
    <StatusBarHeader title="系统消息" :back="true" @goback="back" />
    <view class="content">
      <view class="content-title">{{ detail.title }}</view>
      <view class="content-date">{{ detail.time }}</view>
      <view class="content-detail">{{ detail.content }}</view>
    </view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import msgService from "./message.service";
export default {
  name: "message-detail",
  components: {
    StatusBarHeader
  },
  data() {
    return {
      detail: {
        content: "",
        title: "",
        time: ""
      }
    };
  },
  onLoad(options) {
    this.getDetail(options.id);
  },
  methods: {
    getDetail(id) {
      msgService.read(id).then(res => {
        this.detail = res.message[0];
      });
    },
    back() {
      uni.navigateBack();
      // uni.navigateTo({
      //   url: "/pages/message/message"
      // });
    }
  }
};
</script>
<style lang="less">
.message-detail {
  box-sizing: border-box;
  padding: 30upx;
  height: 100%;
  background-color: #f6f6f6;
  .content {
    box-sizing: border-box;
    padding: 20upx 16upx;
    width: 690upx;
    background-color: #fff;
    border-radius: 10upx;
    &-title {
      height: 62upx;
      line-height: 62upx;
      font-size: 30upx;
      color: #414141;
      text {
        color: #f84e91;
      }
    }
    &-date {
      font-size: 24upx;
      color: #818181;
      margin-bottom: 40upx;
    }
    &-detail {
      padding-top: 20upx;
      border-top: 2upx solid #f6f6f6;
      font-size: 28upx;
      color: #818181;
      line-height: 60upx;
    }
  }
}
</style>