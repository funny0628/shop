<template>
  <view class="pay">
    <StatusBarHeader title="支付" :back="true" @goback="back" />
    <view class="pay-header">
      <view class="pay-header-title">支付金额</view>
      <view class="pay-header-count">
        <text class="price"
          >{{ data.totalPrice }}
          <text class="price-unit">元</text>
        </text>
        <text class="sign">+</text>
        <text class="gold"
          >{{ data.totalGold }}
          <text class="gold-unit">金币</text>
        </text>
      </view>
    </view>
    <view class="pay-gold">
      <view class="pay-gold-title">金币</view>
      <view class="pay-gold-count">
        金币余额
        <text>{{ data.goldBalance }}金币</text>
        <text class="insufficient-gold" v-if="insufficientGold">余额不足</text>
        <image src="../../static/pay/selected.png" />
      </view>
    </view>
    <view class="pay-way" v-if="!noPrice">
      <view class="pay-way-title">支付方式</view>
      <view
        class="pay-way-count"
        v-for="(item, index) in providerList"
        :key="index"
      >
        {{ item.name }}
        <image src="../../static/pay/selected.png" />
      </view>
    </view>
    <button
      hover-class="pay-btn-hover"
      plain
      :class="['pay-btn', insufficientGold && 'un-selected']"
      :loading="btnLoading"
      @tap="confirmPay"
    >
      确认支付
    </button>
    <!-- <view class="pay-btn"  @tap='confirmPay'>确认支付</view> -->
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import payService from "./pay.service";
export default {
  name: "pay",
  components: {
    StatusBarHeader
  },
  data() {
    return {
      orderSn: "",
      data: {},
      providerList: [],
      btnLoading: false,
      payId: "wxpay"
    };
  },
  onLoad(opt) {
    console.log(opt);

    this.orderSn = opt.orderSn;
    this.getOrderInfo();

    payService
      .getProvider()
      .then(res => {
        console.log(res);

        let providerList = [];
        res.provider.map(value => {
          switch (value) {
            // case "alipay":
            //   providerList.push({
            //     name: "支付宝",
            //     id: value,
            //     loading: false
            //   });
            //   break;
            case "wxpay":
              providerList.push({
                name: "微信支付",
                id: value,
                loading: false
              });
              break;
            default:
              break;
          }
        });
        this.providerList = providerList;
      })
      .catch(err => {
        this.$showMsg("获取支付通道失败：", err);
      });
  },
  computed: {
    // 余额不足
    insufficientGold() {
      // 用户余额 小于 总商品价格
      return (
        Number(this.data.goldBalance || 0) < Number(this.data.totalGold || 0)
      );
    },
    // 不需要 人民币 支付
    noPrice() {
      return Number(this.data.totalPrice || 0) === 0;
    }
  },
  onShow() {
    //
  },
  methods: {
    back() {
      console.log("我触发了");
      uni.navigateBack();
    },
    getOrderInfo() {
      this.$Http
        .post({
          app: "goPay",
          action: "order",
          orderNo: this.orderSn
        })
        .then(res => {
          this.data = res.data;
        })
        .catch(err => {
          this.$showMsg(err || "服务器错误");
        });
    },
    confirmPay() {
      if (this.insufficientGold) {
        this.$showMsg("余额不足");
        return;
      }
      if (this.btnLoading) return;
      this.btnLoading = true;

      // 先获取orderInfo
      this.$Http
        .post({
          action: "pay",
          app: "pay",
          orderNo: this.orderSn,
          payId: this.payId
        })
        .then(res => {
          // 带到orderInfo  如果有需要唤醒app支付    不需要支付人民币的话就不要唤醒APP
          const { payData } = res.data;
          console.log("payData: ------>", payData);
          if (payData) {
            payService
              .requestPayment(this.payId, payData)
              .then(res => {
                console.log(res, "res");
                this.paySuccess();
              })
              .catch(err => {
                this.$showMsg(err.errMsg);
                console.log("err: -------->", err);
                this.btnLoading = false;
              });
            return;
          }

          this.paySuccess();
        })
        .catch(err => {
          this.$showMsg(err);
          this.btnLoading = false;
        });
    },
    // 手机端支付完成之后  需要调取查询支付状态的接口
    queryPayStatus() {
      return this.$Http.post({
        action: "pay",
        app: "payStatus",
        orderNo: this.orderSn
      });
    },
    async paySuccess() {
      this.queryPayStatus()
        .then(res => {
          this.btnLoading = false;
          if (res.data.payStatus === "1") {
            console.log("paySuccess", res);
            this.$showMsg("支付成功！", () => {
              this.goTo(
                `/pages/pay/pay-success?orderSn=${this.orderSn}&orderId=${this.data.orderId}`
              );
            });
          }
          this.$showMsg(res.message);
        })
        .catch(err => {
          this.btnLoading = false;
          this.$showMsg(err);
        });
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
.box {
  width: 690upx;
  height: 160upx;
  border-radius: 10upx;
  background-color: rgba(255, 255, 255, 0.9);
}
.title {
  width: 100%;
  height: 72upx;
  line-height: 72upx;
  font-size: 26upx;
  color: #414141;
  font-weight: bold;
  text-indent: 37upx;
  border-bottom: 2upx solid #f6f6f6;
}
image {
  position: absolute;
  top: 20upx;
  right: 30upx;
  width: 46upx;
  height: 46upx;
}
.pay {
  box-sizing: border-box;
  width: 750upx;
  padding: 30upx;
  height: 100%;
  background: #f6f6f6;
  &-header {
    width: 690upx;
    height: 290upx;
    border-radius: 10upx;
    background-color: rgba(255, 255, 255, 0.9);
    &-title {
      font-weight: bold;
      text-align: center;
      width: 100%;
      height: 85upx;
      line-height: 85upx;
      font-size: 32upx;
      color: #414141;
      border-bottom: 2upx solid #f6f6f6;
    }
    &-count {
      text-align: center;
      width: 100%;
      height: 203upx;
      line-height: 203upx;
      font-size: 50upx;
      .price {
        color: #f84e91;
        &-unit {
          font-size: 34upx;
        }
      }
      .sign {
        margin: 0 8upx;
        color: #414141;
      }
      .gold {
        color: #ff8d06;
        &-unit {
          font-size: 34upx;
        }
      }
    }
  }
  &-gold {
    margin: 30upx 0 45upx 0;
    &:extend(.box);
    &-title {
      &:extend(.title);
    }
    &-count {
      font-size: 28upx;
      color: #414141;
      position: relative;
      text-indent: 85upx;
      width: 100%;
      height: 86upx;
      line-height: 86upx;
      &::before {
        content: " ";
        position: absolute;
        width: 32upx;
        height: 32upx;
        top: 27upx;
        left: 35upx;
        background: url("~@/static/pay/gold.png") center center no-repeat;
        background-size: 100% 100%;
      }
      text {
        margin-left: 30upx;
        font-size: 28upx;
        color: #ff8d06;
      }
      image {
        &:extend(.image);
      }
    }
    .insufficient-gold {
      font-size: 24upx;
      color: #f84e91;
      border-radius: 5px;
      padding: 4upx;
      border: solid 2upx #f84e91;
    }
  }
  &-way {
    &:extend(.box);
    &-title {
      &:extend(.title);
    }
    &-count {
      font-size: 28upx;
      color: #4c4c4c;
      position: relative;
      text-indent: 85upx;
      width: 100%;
      height: 86upx;
      line-height: 86upx;
      &::before {
        content: " ";
        position: absolute;
        width: 32upx;
        height: 32upx;
        top: 27upx;
        left: 35upx;
        background: url("~@/static/pay/wechat.png") center center no-repeat;
        background-size: 100% 100%;
      }
      image {
        &:extend(.image);
      }
    }
  }
  &-btn {
    font-size: 30upx;
    color: #fff !important;
    text-align: center;
    margin: 67upx auto 0;
    width: 580upx;
    height: 80upx;
    line-height: 80upx;
    background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#c93802, #c93802);
    box-shadow: 0upx 5upx 10upx 0upx rgba(255, 0, 61, 0.35);
    border-radius: 40upx;
    background-color: rgba(0, 0, 0, 0.9);
    border: none !important;
    overflow: hidden;
    &.un-selected {
      background-image: linear-gradient(#818181, #818181),
        linear-gradient(#c93802, #c93802);
      box-shadow: none;
    }
  }
  .pay-btn-hover {
    border: none;
    overflow: hidden;
  }
}
</style>