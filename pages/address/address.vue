<template>
  <view class="address">
    <StatusBarHeader title="地址管理" :back="true" @goback="goBack" />
    <scroll-view scroll-y class="list" v-if="address && address.length > 0">
      <view
        :class="['list-item', isSelect && 'isSelect']"
        v-for="(item, index) in address"
        :key="index"
        @tap="selectAddr(item, index)"
      >
        <view class="select" v-if="isSelect">
          <image
            v-if="isSelectIndex === index"
            src="/static/order/addr-icon.png"
          ></image>
        </view>
        <view class="list-item-user"
          >{{ item.name }}
          <text>{{ item.tel }}</text>
        </view>
        <view class="list-item-address">
          <text class="default" v-if="Number(item.is_default)">默认</text>
          <text class="address-text">{{ item.address_xq }}</text>
        </view>
        <view class="list-item-btn" v-if="!isSelect">
          <image
            v-if="Number(item.is_default)"
            src="../../static/address/is_default.png"
            class="default-logo"
          ></image>
          <image
            v-else
            @tap="setNormal(item, index)"
            src="../../static/address/no_default.png"
            class="default-logo"
          ></image>
          <text class="default-text" @tap="setNormal(item, index)">
            默认地址
          </text>
          <view class="right">
            <view @tap.stop="addAddress('edit', item)">编辑</view>
            <view @tap="delAddress(item.addr_id)">删除</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view>
      <view v-if="address && address.length === 0">
        <empty content="您还没有添加收货地址哦～" />
      </view>
    </view>
    <view class="new-address" @tap="addAddress('add')">添加新地址</view>
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import addressService from "./address.service";
import { mapMutations } from "vuex";
import empty from "@/components/empty/empty.vue";
export default {
  name: "x-address",
  components: {
    StatusBarHeader,
    empty
  },
  data() {
    return {
      address: null,
      isSelect: false,
      isSelectIndex: null,
      selectAddressId: null
    };
  },
  onLoad(opt) {
    // 这是创建订单页面来选地址的
    this.isSelect = opt.type === "1";
    console.log(opt.addressId,'addressIdaddressIdaddressIdaddressId')
    this.selectAddressId = opt.addressId || null
    // this.isSelect = opt.type === "0";
  },
  onShow() {
    this.getAddress();
  },
  methods: {
    ...mapMutations(["setSelectAddress"]),
    selectAddr(item, index) {
      if (this.isSelect) {
        this.isSelectIndex = index;
        this.setSelectAddress({ ...item });
        uni.navigateBack();
      }
    },
    goBack() {
      const pages = getCurrentPages();
      uni.navigateBack({
        delta: this.searchPrev(pages)
      });
    },
    searchPrev(routes) {
      let delta;
      for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].route.indexOf("pages/address") === -1) {
          delta = routes.length - i - 1;
          break;
        }
      }
      return delta;
    },
    // 删除收货地址
    delAddress(id) {
      addressService.delete(id).then(res => {
        this.$showMsg("删除成功");
        this.getAddress();
      });
    },
    // 获取收货地址
    getAddress() {
      addressService
        .get()
        .then(res => {
          this.address = res.adds;
          if (this.isSelect) {
            const index = this.address.findIndex(x => x.id === this.selectAddressId)
            if (index !== -1) {
              this.isSelectIndex = index
            }
          }
        })
        .catch(() => {
          this.address = [];
        });
    },
    addAddress(type, item) {
      uni.navigateTo({
        url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(
          item
        )}&selectType=${this.isSelect}`
      });
    },
    setNormal(item, index) {
      this.address.forEach(x => {
        x.is_default = "0";
      });
      this.$forceUpdate();

      addressService.setDf(item.addr_id).then(res => {
        this.$showMsg("设置成功");
        this.getAddress();
      });
    }
  }
};
</script>

<style lang='less'>
@import url("./address.less");
</style>
