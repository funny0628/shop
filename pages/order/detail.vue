<template>
  <!-- 订单详情 -->
  <view class="order-detail">
    <StatusBarHeader title="订单详情" :back="true" @goback="back" />
    <view class="order-detail-head">
      <view class="order-detail-head-content">
        <view class="left" v-if="orderData.status === '0'">
          <text class="status">待付款</text>
          <!-- <text class="time">0时59分59秒后关闭订单</text> -->
          <view class="time">
            <uni-countdown
              :show-day="false"
              background-color="transparent"
              color="#fff"
              :hour="date.hour"
              :minute="date.minute"
              :second="date.second"
              :show-colon="false"
              @timeup="timeup"
            >
            </uni-countdown>
            后关闭订单
          </view>
        </view>
        <view class="left" v-else-if="orderData.status === '1'">
          <text class="status">已付款 等待发货</text>
        </view>
        <view class="left" v-else-if="orderData.status === '2'">
          <text class="status">已发货</text>
          <text class="time">
            {{ orderData.logistics.name || "" }}
            {{ orderData.logistics.courier_num || "" }}
          </text>
        </view>
        <view
          class="left"
          v-else-if="['6', '7'].indexOf(orderData.status) !== -1"
        >
          <text class="status">订单已取消</text>
        </view>
        <view class="left" v-else-if="['5'].indexOf(orderData.status) !== -1">
          <text class="status">订单已完成</text>
          <text class="time">
            {{ orderData.logistics.name }} {{ orderData.logistics.courier_num }}
          </text>
        </view>
        <view class="left" v-else></view>
        <view class="image">
          <image :src="`/static/order/${imageKey[orderData.status]}`"></image>
        </view>
        <view class="right" v-if="false">
          <view class="right-icon">
            <image src="/static/order/right-arrows.png"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="mescroll-wrap ">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="{ use: false }"
        :up="{ use: false }"
      >
        <view class="order-detail-content">
          <view class="order-detail-content-user">
            <view class="icon">
              <image src="/static/order/addr-icon.png"></image>
            </view>
            <view class="info">
              <view>
                <text class="name">{{ orderData.name }}</text>
                <text class="phone">{{ orderData.mobile }}</text>
              </view>
              <view class="addr">
                <text>
                  {{ orderData.address }}
                </text>
              </view>
            </view>
          </view>
          <view class="order-detail-content-shop">
            <view
              class="shop-detail"
              @tap="goTo(`/pages/goods/goods-detail?id=${shopData.p_id}`)"
            >
              <view class="img">
                <image :src="shopData.imgurl"></image>
              </view>
              <view class="shop-info">
                <view class="tit">
                  {{ shopData.p_name }}
                </view>
                <view class="specification">
                  <view class="text">{{ shopData.size }}</view>
                  <view class="count">x{{ shopData.num }}</view>
                </view>
              </view>
            </view>
            <view class="info-item">
              <text class="item-tit">商品总价</text>
              <text class="item-description"
                >￥{{ orderData.z_price }}元 +
                {{ orderData.omsg && orderData.omsg.allow }}金币</text
              >
            </view>
            <view class="info-item">
              <text class="item-tit">运费</text>
              <text class="item-description">{{ orderData.z_freight }}元</text>
            </view>
            <view class="info-item">
              <text class="item-tit">订单备注</text>
              <text class="item-description remark">
                {{ orderData.remarks }}
              </text>
            </view>
            <view class="lien"></view>
            <view class="info-item">
              <text class="item-tit">应付现金</text>
              <text class="item-description money">
                <text class="small">￥</text>
                <text class="big">{{ orderData.z_price | price(0) }}</text>
                <text class="small">{{ orderData.z_price | price(1) }}</text>
                <text class="small">元</text>
              </text>
            </view>
            <view class="info-item">
              <text class="item-tit">应付金币</text>
              <text class="item-description gold">
                <text class="big">{{
                  orderData.omsg && orderData.omsg.allow
                }}</text>
                <text class="small">金币</text>
              </text>
            </view>
          </view>
          <view class="order-detail-content-order">
            <view class="order-item">
              <view class="item-tit">订单编号</view>
              <view class="item-description">{{ orderData.sNo }}</view>
            </view>
            <view class="order-item">
              <view class="item-tit">下单时间</view>
              <view class="item-description">{{ orderData.add_time }}</view>
            </view>
            <view
              class="order-item"
              v-if="['1', '2', '5'].indexOf(orderData.status) !== -1"
            >
              <view class="item-tit">付款时间</view>
              <view class="item-description">
                {{ orderData.omsg.pay_time }}
              </view>
            </view>
            <view
              class="order-item"
              v-if="['1', '2', '5'].indexOf(orderData.status) !== -1"
            >
              <view class="item-tit">付款方式</view>
              <view class="item-description">{{ payMethodText }}</view>
            </view>
            <view
              class="order-item"
              v-if="['5'].indexOf(orderData.status) !== -1"
            >
              <view class="item-tit">发货时间</view>
              <view class="item-description">{{ shopData.deliver_time }}</view>
            </view>
            <view
              class="order-item"
              v-if="['5'].indexOf(orderData.status) !== -1"
            >
              <view class="item-tit">成交时间 </view>
              <view class="item-description">
                {{ orderData.omsg.arrive_time }}
              </view>
            </view>
            <view
              class="order-item"
              v-if="['6', '7'].indexOf(orderData.status) !== -1"
            >
              <view class="item-tit">取消时间</view>
              <view class="item-description">
                {{ orderData.omsg.cancel_time }}
              </view>
            </view>
          </view>
        </view>
      </mescroll-uni>
    </view>
    <view class="order-detail-footer">
      <view class="price" v-if="orderData.status === '0'">
        <text class="money">
          <text class="small">￥</text>
          <text class="big">{{ orderData.z_price | price(0) }}</text>
          <text class="small">{{ orderData.z_price | price(1) }}</text>
          <text class="small">元</text>
        </text>
        <text class="plus">&nbsp;+&nbsp;</text>
        <text class="gold">
          <text class="big">{{ orderData.omsg && orderData.omsg.allow }}</text>
          <text class="small">金币</text>
        </text>
      </view>
      <view class="time" v-if="orderData.status === '2'">
        <!-- <uni-countdown
          :show-day="false"
          background-color="transparent"
          color="#818181"
          :hour="date.hour"
          :minute="date.minute"
          :second="date.second"
          :show-colon="false"
          @timeup="timeup"
        >
        </uni-countdown> -->
        {{ autoReceiving }}后自动确认
      </view>
      <view class="" v-else></view>
      <view class="action">
        <view class="btn" @tap="cancel" v-if="orderData.status === '0'">
          取消订单
        </view>
        <view class="btn pay" @tap="pay" v-if="orderData.status === '0'">
          立即付款
        </view>
        <view
          class="btn"
          @tap="goTo(`/pages/order/expressage?id=${orderData.sNo}`)"
          v-if="['1', '2'].indexOf(orderData.status) !== -1"
        >
          查看物流
        </view>
        <view
          class="btn"
          @tap="confirmTake"
          v-if="['2'].indexOf(orderData.status) !== -1"
        >
          确认收货
        </view>
        <view
          class="btn"
          @tap="deleteOrder"
          v-if="['5', '6', '7'].indexOf(orderData.status) !== -1"
        >
          删除订单
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import uniCountdown from "@/components/uni-countdown/uni-countdown.vue";
export default {
  components: { StatusBarHeader, MescrollUni, uniCountdown },
  data() {
    return {
      price: 199.98,
      // 支付的倒计时
      date: {
        // 默认倒计时一个小时
        hour: 1,
        minute: 0,
        second: 0
      },
      // 根据状态 显示一个小图片的
      imageKey: {
        0: "payment.png",
        1: "send.png",
        2: "receipt.png",
        5: "evaluete.png",
        6: "cancel.png",
        7: "cancel.png"
      },
      // 自动收货的计时
      autoReceiving: "",
      id: null,
      orderData: {}
    };
  },
  onLoad(opt) {
    const { id } = opt;
    this.id = id;
    this.getOrderDetail();
    // console.log(opt, this.$showMsg("id不存在"));
  },
  computed: {
    shopData() {
      return (this.orderData.list && this.orderData.list[0]) || {};
    },
    payMethodText() {
      if (this.orderData.z_price > 0) {
        return "微信支付";
      }
      return "金币支付";
      // 付款方式文案  目前只有微信支付  可能也会有金币支付  如果应付现金大于0 就是微信支付 否之 金币支付
    }
  },
  methods: {
    getOrderDetail(id) {
      this.$Http
        .post({
          order_id: this.id,
          module: "app",
          action: "order",
          app: "order_details"
        })
        .then(res => {
          // res.data.status = "2";
          this.orderData = res.data;
          // 未付款  开启倒计时
          // res.data.status = "0";
          if (res.data.status === "0") {
            // ios 不能有 -   所以替换一下
            const addTime =
              new Date(res.data.add_time.replace(/-/g, "/")) / 1000;
            const now = res.data.omsg.nowTime;
            // const now = 1566976740;
            // order_failur 是失效的倒计时
            const interval = addTime + res.data.order_failure - now;
            const hour = parseInt((interval / 60 / 60) % 24);
            const minute = parseInt((interval / 60) % 60);
            const second = parseInt(interval % 60);
            this.date = {
              hour,
              minute,
              second
            };
            // console.log(
            //   hour,
            //   minute,
            //   second,
            //   interval,
            //   addTime,
            //   res.data.add_time,
            //   new Date(+res.data.add_time),
            //   res.data.order_failure,
            //   "time:-------------"
            // );
          }
          // 计算发货自动确认日期
          if (res.data.status === "2") {
            // deliver_time
            const deliver_time =
              new Date(this.shopData.deliver_time.replace(/-/g, "/")) / 1000;
            const now = res.data.omsg.nowTime;
            const interval = deliver_time + res.data.auto_signed - now;
            let day = parseInt(interval / 60 / 60 / 24);
            day = day < 0 ? 0 : day;
            let hour = parseInt((interval / 60 / 60) % 24);
            hour = hour < 0 ? 0 : hour;
            // console.log(hour, day, interval);
            this.autoReceiving = `${day}天${hour}时`;
            // this.autoReceiving  9天10时后自动确认
          }
        })
        .catch(err => {});
    },
    // 返回
    back() {
      this.goTo("/pages/order/order");
    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    },
    timeup() {
      console.log("倒计时结束了");
      this.getOrderDetail();
    },
    cancel() {
      const { cancelOrder } = this.$Actions.orderAction;
      cancelOrder({ order_id: this.id })
        .then(res => {
          this.$showMsg(res.message);
          this.getOrderDetail();
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    },
    confirmTake() {
      const { confirmTake } = this.$Actions.orderAction;
      confirmTake({ order_id: this.id })
        .then(res => {
          this.$showMsg(res.message);
          this.getOrderDetail();
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    },
    deleteOrder() {
      const { deleteOrder } = this.$Actions.orderAction;
      deleteOrder({ order_id: this.id })
        .then(res => {
          this.$showMsg(res.message);
          // this.getOrderDetail();
          uni.navigateBack();
        })
        .catch(err => {
          this.$showMsg(err.err);
        });
    },
    pay() {}
  }
};
</script>

<style lang="less">
@import url("./detail.less");
</style>