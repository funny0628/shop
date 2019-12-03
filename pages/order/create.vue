<template>
  <view class="order-create">
    <StatusBarHeader title="确认订单" :back="true" @goback="back" />

    <view class="mescroll-wrap ">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="{ use: false }"
        :up="{ use: false }"
      >
        <view class="order-create-content">
          <view
            class="order-create-content-user"
            @tap="
              goTo(
                `/pages/address/address?type=1&addressId=${selectAddress.id}`
              )
            "
          >
            <view class="icon">
              <image src="/static/order/addr-icon.png"></image>
            </view>
            <view class="info" v-if="JSON.stringify(selectAddress) !== '{}'">
              <view>
                <text class="name">{{ selectAddress.name }}</text>
                <text class="phone">{{ selectAddress.tel }}</text>
              </view>
              <view class="addr">
                <text>
                  {{ selectAddress.address_xq }}
                </text>
              </view>
            </view>
            <view class="info" v-else>
              <text class="name">
                请设置一个收货地址
              </text>
            </view>
          </view>
          <view class="order-create-content-shop">
            <view
              class="shop-detail"
              @tap="goTo(`/pages/goods/goods-detail?id=${shopData.pid}`)"
            >
              <view class="img">
                <image :src="shopData.imgurl"></image>
              </view>
              <view class="shop-info">
                <view class="tit">
                  {{ shopData.product_title }}
                </view>
                <view class="specification">
                  <view class="text">{{ shopData.attribute }}</view>
                  <view class="count">x{{ shopData.num }}</view>
                </view>
              </view>
            </view>

            <view class="info-item">
              <text class="item-tit">应付现金</text>
              <text class="item-description money">
                <text class="small">￥</text>
                <text class="big">{{ shopData.price | price(0) }}</text>
                <text class="small">{{ shopData.price | price(1) }}</text>
                <text class="small">元</text>
              </text>
            </view>
            <view class="info-item">
              <text class="item-tit">应付金币</text>
              <text class="item-description gold">
                <text class="big">{{ shopData.gold }}</text>
                <text class="small">金币</text>
              </text>
            </view>
            <view class="info-item">
              <text class="item-tit">运费</text>
              <text class="item-description">
                <text>{{ data.totalShippingFee }}元</text>
              </text>
            </view>

            <view class="lien"></view>
            <view class="info-item">
              <text class="item-tit">合计 :</text>
              <text class="item-description">
                <text class="money">
                  <text class="small">￥</text>
                  <text class="big">{{ data.totalPrice | price(0) }}</text>
                  <text class="small">{{ data.totalPrice | price(1) }}</text>
                  <text class="small">元</text>
                </text>
                <text class="plus">&nbsp;+&nbsp;</text>
                <text class="gold">
                  <text class="big">{{ data.totalGold }}</text>
                  <text class="small">金币</text>
                </text>
              </text>
            </view>
          </view>

          <view class="order-create-content-order">
            <view class="order-item">
              <view class="item-tit">备注 :</view>
              <view class="item-description remark">
                <!-- <textarea
                  class="remark-textarea"
                  placeholder="请输入备注信息"
                ></textarea> -->
                <input
                  type="text"
                  v-model="remark"
                  class="remark-textarea"
                  placeholder="请输入备注信息"
                />
              </view>
            </view>
          </view>
        </view>
      </mescroll-uni>
    </view>
    <view class="order-create-footer">
      <view class="price">
        <text class="money">
          <text class="sum">合计&nbsp;:&nbsp;</text>
          <text class="small">￥</text>
          <text class="big">{{ data.totalPrice | price(0) }}</text>
          <text class="small">{{ data.totalPrice | price(1) }}</text>
          <text class="small">元</text>
        </text>
        <text class="plus">&nbsp;+&nbsp;</text>
        <text class="gold">
          <text class="big">{{ data.totalGold }}</text>
          <text class="small">金币</text>
        </text>
      </view>
      <view class="action">
        <view class="btn pay" @tap="submit">
          提交订单
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import { mapState, mapMutations } from "vuex";
let timeId = null;
export default {
  components: {
    StatusBarHeader,
    MescrollUni
  },
  data() {
    return {
      data: {},
      // id: null,
      order_products: {},
      remark: ""
    };
  },
  onLoad(opt) {
    // this.id = opt.id;
    const { pid, cid, price, gold, num } = opt;
    this.order_products = { pid, cid, price, gold, num };
    console.log(this.order_products);
    // this.getDate();
    //商品数据
  },
  computed: {
    ...mapState({
      selectAddress: s => s.selectAddress
    }),
    shopData() {
      return (this.data.order_products && this.data.order_products[0]) || {};
    }
  },
  onShow() {
    this.getDate();
  },
  methods: {
    ...mapMutations(["setSelectAddress"]),
    getDate() {
      this.$Http
        .post({
          action: "order",
          app: "preview",
          order_products: JSON.stringify([this.order_products]),
          address_id: this.selectAddress.id
        })
        .then(res => {
          const { address } = res.data;
          this.data = res.data;
          console.log(address);
          if (Object.prototype.toString.call(address) === "[object Array]") {
            this.setSelectAddress({});
          } else {
            this.setSelectAddress(address);
          }
        })
        .catch(err => {
          this.$showMsg(err);
          this.backDetail();
        });
    },
    // 返回
    back() {
      uni.navigateBack();
    },
    backDetail() {
      timeId = setTimeout(v => {
        this.goTo(`/pages/goods/goods-detail?id=${this.order_products.pid}`);
      }, 1500);
    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    },
    submit() {
      const address_id = this.selectAddress.id || null;
      if (!address_id) {
        this.$showMsg("请选择一个收货地址！");
        return;
      }

      this.$Http
        .post({
          action: "order",
          app: "confirm",
          order_products: JSON.stringify([this.order_products]),
          shippingFee: this.data.totalShippingFee,
          remark: this.remark,
          address_id: address_id
        })
        .then(res => {
          this.goTo(`/pages/pay/pay?orderSn=${res.data.orderNo}`);
        })
        .catch(err => {
          this.$showMsg(err);
          this.backDetail();
        });
    }
  },
  deactivated() {
    clearTimeout(timeId);
  }
};
</script>

<style lang='less' scoped>
@import url("./create.less");
</style>