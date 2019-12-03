<template>
  <view class="order-item">
    <view class="order-item-head">
      <view class="order-item-head-time">{{ item.add_time }}</view>
      <view class="order-item-head-status">
        {{ order_status[item.status] }}
      </view>
    </view>
    <view
      class="order-item-info"
      @click="goTo(`/pages/order/detail?id=${item.id}`)"
    >
      <view class="order-item-info-main">
        <view class="left-side">
          <image :src="item.imgurl"></image>
        </view>
        <view class="right-side">
          <view class="title">
            {{ item.p_name }}
          </view>
          <view class="specification">
            <text>{{ item.size }}</text>
            <text>x{{ item.num }}</text>
          </view>
        </view>
      </view>
      <view class="order-item-info-price">
        <text class="normal">合计</text>
        <text class="money">
          <text class="small">￥</text>
          <text class="big">{{ item.z_price | price(0) }}</text>
          <text class="small">{{ item.z_price | price(1) }}</text>
          <text class="small">元</text>
        </text>
        <text class="plus">+</text>
        <text class="gold">
          <text class="big">{{ item.allow }}</text>
          <text class="small">金币</text>
        </text>
      </view>
    </view>
    <!-- 按钮操作 -->
    <view class="order-item-action" v-if="isShowAction">
      <text class="order-btn" @tap="cancel" v-if="item.status === '0'">
        取消订单
      </text>
      <text class="order-btn" @tap="pay" v-if="item.status === '0'">
        立即支付
      </text>
      <text
        class="order-btn"
        @tap="goTo(`/pages/order/expressage?id=${item.sNo}`)"
        v-if="item.status === '2'"
      >
        查看物流
      </text>
      <text class="order-btn" @tap="confirmTake" v-if="item.status === '2'">
        确认收货
      </text>
      <text
        class="order-btn"
        @tap.stop="deleteOrder"
        v-if="item.status === '6'"
      >
        删除订单
      </text>
    </view>
  </view>
</template>

<script>
import { order_status } from "./utils";
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      order_status
    };
  },
  computed: {
    isShowAction() {
      return ["0", "2", "6"].indexOf(this.item.status) !== -1;
    }
  },
  methods: {
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    },
    cancel() {
      const { cancelOrder } = this.$Actions.orderAction;
      cancelOrder({ order_id: this.item.id })
        .then(res => {
          this.$showMsg(res.message);
          this.$emit("callback");
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    },
    pay() {
      this.goTo(`/pages/pay/pay?orderSn=${this.item.sNo}`);
    },
    confirmTake() {
      const { confirmTake } = this.$Actions.orderAction;
      confirmTake({ order_id: this.item.id })
        .then(res => {
          this.$showMsg(res.message);
          this.$emit("callback");
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    },
    deleteOrder() {
      const { deleteOrder } = this.$Actions.orderAction;
      deleteOrder({ order_id: this.item.id })
        .then(res => {
          this.$showMsg(res.message);
          this.$emit("callback");
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    }
  }
};
</script>

<style lang="less">
.order-item {
  width: 690upx;
  // height: 260px;
  background-color: #ffffff;
  border-radius: 5px;
  margin-bottom: 20upx;
  &-head {
    display: flex;
    height: 86upx;
    padding: 0 20upx;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f6f6f6;
    &-time {
      font-size: 12px;
      color: #818181;
    }
    &-status {
      font-size: 13px;
      color: #f84e91;
    }
  }
  &-info {
    padding: 40upx 20upx;
    border-bottom: 1px solid #f6f6f6;
    &-main {
      display: flex;
      .left-side {
        flex-basis: 180upx;
        height: 180upx;
        background-color: #ffffff;
        border-radius: 10upx;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .right-side {
        flex: 1;
        margin-left: 20upx;
        .title {
          font-size: 26upx;
          color: #414141;
        }
        .specification {
          display: flex;
          justify-content: space-between;
          margin-top: 40upx;
          font-size: 26upx;
          color: #818181;
        }
      }
    }
    &-price {
      margin-top: 60upx;
      text-align: right;
      line-height: 28upx;
      color: #ff8d06;
      .normal {
        font-size: 26upx;
        color: #414141;
      }
      .small {
        font-size: 22upx;
      }
      .big {
        font-size: 30upx;
      }
      .money {
        color: #f84e91;
      }
      .gold {
        color: #ff8d06;
      }
      .plus {
        padding: 0 8upx;
        font-size: 30upx;
        color: #767676;
      }
    }
  }
  &-action {
    padding: 0 20upx;
    height: 86upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .order-btn {
      width: 150upx;
      height: 60upx;
      line-height: 60upx;
      text-align: center;
      margin-left: 50upx;
      // padding: 0 26upx;
      border-radius: 30upx;
      border: solid 2upx #818181;
      font-size: 24upx;
      color: #818181;
    }
  }
}
</style>