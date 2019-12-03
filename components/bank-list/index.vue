<template>
  <view class="bank-list-box">
    <scroll-view scroll-y class="pop-content">
      <view
        class="bank-list-item"
        v-for="(item, index) in list"
        :key="index"
        @tap="select(item, index)"
      >
        {{ item.text }}
        <image
          class="active"
          v-if="value === item.value"
          src="/static/wallet/active-bank.png"
        ></image>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    list:{
      type:Array
    }
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    select(item, index) {
      this.$emit("input", item.value);
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.bank-list-box {
  // max-height: 700upx;
  background-color: #fff;
  .pop-content {
    width: 750upx;
    max-height: 700upx;
    // padding-bottom: 0;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
  }
  .bank-list-item {
    text-align: center;
    line-height: 100upx;
    height: 100upx;
    border-bottom: 2upx solid #ededed;
    position: relative;
    .active {
      position: absolute;
      top: 40upx;
      right: 54upx;
      width: 30upx;
      height: 22upx;
    }
  }
}
</style>