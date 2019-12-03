<template>
  <view class="recharge">
    <status-bar-header title="充值" :back="true" @goback="back"></status-bar-header>
    <view class="content">
      <view class="recharge-gold">
        <view class="tipText">充值金币</view>
        <view class="gold">
          <text class="gold-sign">¥</text>
          <input v-model="goldNum" maxlength="6" class="uni-input" type="number" :placeholder="placeholder" />
          <!-- <input v-model="goldNum" maxlength="6" class="uni-input" type="number" @input="getGoldNum" ref="goldInput" placeholder="请输入正整数（50元起)" /> -->
        </view>
      </view>
      <view class="pay-mode">
        <text class="pay-tip">支付方式</text>
        <view class="line"></view>
        <view class="choose-pay">
          <view class="weixin">
            <image class="weixin-icon" src="../../static/recharge/wechat.png"></image>
            <text class="type">微信支付:</text>
            <text class="money">¥ {{ goldNum !=null ? goldNum : '0.00'}}</text>
            <image class="checked" src="../../static/recharge/checked.png"></image>
          </view>
        </view>
      </view>
      <view class="confirm" @tap="confirmCharge">立即充值</view>
    </view>
  </view>
</template>

<script>
import statusBarHeader from "../../components/status-bar-header/status-bar-header";
import rechargeService from './recharge.service'
export default {
  data() {
    return {
      goldNum: null,//充值金币数值
      placeholder: '',
      data: {},//接收获取充值信息接口返回的数据
      providerList: [],//充值服务提供商
      min_money: 0,//最少充值金额
      max_money: 99999,//最大充值金额
      payId: "wxpay"
    }
  },
  components: {
    statusBarHeader
  },
  methods: {
    // getGoldNum() {
    //   this.$nextTick(function() {
    //     console.log(this.$refs.goldInput.value);
    //     // this.goldNum = this.$refs.goldInput.value
    //     // console.log(this.goldNum)
    //   })
    // },
    back() {
      uni.navigateBack(); 
    },
    //获取充值信息
    getChargeInfo() {
      this.$Http
        .post({
          app: "recharge",
          action: "pay",
          module: "app",
          amount: this.goldNum,
          payId: "wxpay"
        })
        .then(res => {
          console.log(res);
          this.data = res.data;
          if(this.data!={}) {
             const { payData } = res.data;
          console.log("payData: ------>", payData);
          if (payData) {
            rechargeService
              .requestPayment(this.payId, payData)
              .then(res => {
                console.log(res, "res");
                this.chargeSuccess();
                console.log("我执行了");
                
              })
              .catch(err => {
                
                console.log("err: -------->", err);
                this.$showMsg(err.errMsg);
              });
            return;
            }
          }
          this.chargeSuccess()
        })
        .catch(err => {
          this.$showMsg(err || "服务器错误");
        });
    },
    //获取最少充值金额
    getMinChargeInfo() {
      this.$Http
        .post({
          app: "rechargeRule",
          action: "pay",
          module: "app",
        })
        .then(res => {
          console.log(res);
          this.min_money = res.data.min_money
          this.placeholder = `请输入充值金额(${this.min_money}元起)`
        })
        .catch(err => {
          this.$showMsg(err || "服务器错误");
        });
    },
    //确认支付
    confirmCharge() {
      if ( ( ( this.goldNum - 0 ) | 0 ) === this.goldNum - 0 ) { //判断输入金额是否为正整数，若为正整数，则继续执行下面代码，否则执行提示信息
        if(this.goldNum >= this.min_money && this.goldNum <= this.max_money) {
          this.getChargeInfo()
        }else {
        this.$showMsg(`充值金额最小为 ${this.min_money},最大为 ${this.max_money}`)
        }
      }else {
        this.$showMsg("充值金额必须为正整数")
      }
    },
    // 手机端支付完成之后  需要调取查询支付状态的接口

    chargeSuccess() {
      console.log( this.data.orderNo, ' this.data.orderNo')
     this.$Http.post({
        module: "app",
        action: "pay",
        app: "rechargeStatus",
        orderNo: this.data.orderNo
      }).then(res => {
        console.log("chargeSuccess", res);
          if (res.data.status === "1") {
            this.$showMsg("支付成功！");
            uni.hideKeyboard();
            this.goTo(
              "/pages/recharge/recharge-success"
            );
        }
      }).catch(err => {
        console.log(err, 'err')
      }) 

    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: url
      });
    }
  },
  onLoad() {
    //调用获取最少充值金额方法
    this.getMinChargeInfo()

    //调用获取充值信息方法
    // this.getChargeInfo()

    //获取充值方式
    rechargeService
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
};
</script>

<style scoped lang="less">
page {
  background-color: #f6f6f6;
}

.content {
  .recharge-gold {
    width: 693upx;
    height: 245upx;
    background-color: #ffffff;
    // background-color: skyblue;
    border-radius: 10upx;
    opacity: 0.9;
    box-sizing: border-box;
    margin: 30upx auto 0;
    overflow: hidden;
    padding-left: 16upx;

    .tipText {
      // width: 131upx;
      // height: 31upx;
      font-family: MicrosoftYaHei;
      font-size: 32upx;
      font-weight: normal;
      font-stretch: normal;
      line-height: 39upx;
      letter-spacing: 2upx;
      color: #414141;
      margin: 35upx 540upx 75upx 0;
    }

    .gold {
      display: flex;
      .gold-sign {
        width: 33upx;
        height: 46upx;
        font-family: MicrosoftYaHei;
        font-size: 60upx;
        font-weight: normal;
        font-stretch: normal;
        line-height: 39upx;
        letter-spacing: 3upx;
        color: #222222;
        margin-right: 10upx;
      }
    .uni-input {
        font-size: 28upx;
        flex: 1;
        margin-right: 10upx;
      }
    }
  }
  .pay-mode {
    width: 693upx;
    height: 156upx;
    background-color: #ffffff;
    // background-color: pink;
    border-radius: 10upx;
    opacity: 0.9;
    margin: 30upx auto 0;
    padding-left: 16upx;
    display: flex;
    flex-direction: column;

    .pay-tip {
      // width: 115upx;
      // height: 28upx;
      font-family: MicrosoftYaHei;
      font-size: 28upx;
      font-weight: normal;
      font-stretch: normal;
      line-height: 88upx;
      letter-spacing: 1px;
      color: #414141;
      border-bottom: 2upx solid #ededed;
    }
    .line {
      width: 677upx;
      height: 4upx;
      // background-color: #ededed;
      background-color: blue;
    }
    .choose-pay {
      .weixin {
        display: flex;
        line-height: 70upx;

        .weixin-icon {
          width: 33upx;
          height: 31upx;
          margin-top: 20upx;
        }

        .type {
          font-family: MicrosoftYaHei;
          font-size: 28upx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 1px;
          color: #4c4c4c;
          margin: 0 10upx;
        }

        .money {
          font-family: MicrosoftYaHei;
          font-size: 28upx;
          font-weight: normal;
          letter-spacing: 1px;
          color: #f84e91;
          width: 320upx;
        }

        .checked {
          width: 46upx;
          height: 46upx;
          margin-top: 12upx;
          margin-left: 20upx;
        }
      }
    }
  }
  .confirm {
    width: 581upx;
    height: 81upx;
    background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#c93802, #c93802);
    background-blend-mode: normal, normal;
    box-shadow: 0px 5px 10px 0px rgba(255, 0, 61, 0.35);
    border-radius: 40upx;
    opacity: 0.9;
    margin: 69upx auto 0;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 30upx;
    font-weight: normal;
    font-stretch: normal;
    line-height: 81upx;
    letter-spacing: 1px;
    color: #ffffff;
  }
}
</style>