<template>
  <view class="address-manage">
    <StatusBarHeader
      :title="manageType === 'edit' ? '编辑地址' : '添加新地址'"
      :back="true"
      @goback="goBack"
    />
    <view class="form-list">
      <view class="form-list-item">
        <view class="item-label">收货人</view>
        <view class="item-value">
          <input
            type="text"
            v-model="addressData.name"
            placeholder="请输入收货人名称"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <view class="form-list-item">
        <view class="item-label">联系方式</view>
        <view class="item-value">
          <input
            type="number"
            v-model="addressData.tel"
            placeholder="请输入电话号码"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <view class="form-list-item" @tap="chooseLocation">
        <view class="item-label">所在地区</view>
        <view class="item-value">
          <image src="../../static/common/right.png" class="right-icon" />
          <input
            type="text"
            disabled="true"
            @focus="hideKeyboard()"
            placeholder="请选择所在地区"
            v-model="city_all"
            placeholder-class="placeholder"
          />
        </view>
      </view>
      <view class="form-list-item">
        <view class="item-label">详细地址</view>
        <view class="item-value">
          <input
            class="input"
            type="text"
            v-model="addressData.address"
            placeholder="请输入详细地址"
            placeholder-class="placeholder"
          />
        </view>
      </view>
      <view class="form-list-item" @tap="toggleDefault">
        <view class="item-label">默认地址</view>
        <view class="item-value">
          <image
            v-if="addressData.is_default"
            src="../../static/address/is_default.png"
            class="select-icon"
          />
          <image
            v-else
            src="../../static/address/no_default.png"
            class="select-icon"
          ></image>
        </view>
      </view>
    </view>
    <view class="save-btn" @tap="submit">保存</view>
    <w-picker
      mode="region"
      :defaultVal="[12, 0, 11]"
      @confirm="chooseArea"
      ref="region"
    ></w-picker>
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import wPicker from "@/components/w-picker/w-picker.vue";
import addressService from "./address.service";
export default {
  components: {
    StatusBarHeader,
    wPicker
  },
  data() {
    return {
      manageType: "",
      city_all: "",
      selectType: "",
      addressData: {
        name: "",
        tel: "",
        address: "",
        area: "",
        is_default: false
      }
    };
  },
  onLoad(option) {
    if (option.type === "edit") {
      this.formatInfo(option.data);
    }
    this.selectType = option.selectType;
    this.manageType = option.type;
  },
  methods: {
    goBack() {
      uni.navigateBack();
      // uni.navigateTo({
      //   url: `/pages/address/address?type=${this.selectType}`
      // });
    },
    formatInfo(data) {
      this.addressData = JSON.parse(data);
      const { sheng, city, quyu } = this.addressData;
      this.city_all = `${sheng}-${city}-${quyu}`;
      this.addressData.is_default = Boolean(+this.addressData.is_default);
    },
    chooseArea({ checkArr }) {
      const [sheng, city, quyu] = checkArr;
      this.city_all = `${sheng}-${city}-${quyu}`;
    },
    toggleDefault() {
      this.addressData.is_default = !this.addressData.is_default;
    },
    hideKeyboard() {
      uni.hideKeyboard();
    },
    //选择地址
    chooseLocation() {
      this.hideKeyboard();
      this.$refs.region.show();
    },
    showMsg(title, duration = 780, mask = false, icon = "none") {
      uni.showToast({
        title,
        duration,
        mask,
        icon
      });
    },
    //验证
    verfiy(data) {
      if (!data.name) {
        this.showMsg("请填写收货人姓名");
        return false;
      }
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.tel)) {
        this.showMsg("请输入正确的手机号码");
        return false;
      }
      if (!this.city_all) {
        this.showMsg("请选择所在地区");
        return false;
      }
      if (!data.address) {
        this.showMsg("请填写详细地址");
        return false;
      }
      return true;
    },
    //
    responseHandle(p) {
      p.then(r => {
        this.$showMsg(
          `地址${this.manageType == "edit" ? "修改" : "添加"}成功`,
          this.goBack
        );
      });
    },
    //提交
    submit() {
      const data = this.addressData;
      if (!this.verfiy(data)) {
        return false;
      }
      const option = {
        user_name: data.name,
        mobile: data.tel,
        place: this.city_all,
        is_default: Number(data.is_default),
        address: data.address
      };
      if (this.manageType == "edit") {
        this.responseHandle(
          addressService.update({
            ...option,
            addr_id: data.addr_id
          })
        );
      } else {
        this.responseHandle(addressService.create(option));
      }
    }
  }
};
</script>

<style lang="less">
.address-manage {
  background-color: #f6f6f6;
  box-sizing: border-box;
  width: 750upx;
  height: 100%;
  padding: 30upx;
  .form-list {
    width: 100%;
    background-color: #fff;
    border-radius: 10upx;
    &-item {
      display: flex;
      width: 100%;
      height: 128upx;
      line-height: 128upx;
      border-bottom: 2upx solid #f6f6f6;
      .item-label {
        font-size: 28upx;
        color: #414141;
        text-align: left;
        box-sizing: border-box;
        padding-left: 20upx;
        flex: 0 0 150upx;
        height: 100%;
      }
      .item-value {
        flex: 0 0 500upx;
        position: relative;
        height: 100%;
        input {
          font-size: 28upx;
          color: #414141;
          height: 128upx;
          padding: 40upx 0;
          line-height: 1;
          min-height: 0;
          // line-height: 128upx;
        }
        .placeholder {
          font-size: 28upx;
          color: #818181;
        }
        .select-icon {
          position: absolute;
          top: 41upx;
          right: -20upx;
          width: 46upx;
          height: 46upx;
        }
        .right-icon {
          position: absolute;
          top: 50upx;
          right: -20upx;
          width: 16upx;
          height: 28upx;
        }
      }
    }
  }
  .save-btn {
    font-size: 30upx;
    color: #fff;
    text-align: center;
    margin: 100upx auto 0;
    width: 580upx;
    height: 80upx;
    line-height: 80upx;
    background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#c93802, #c93802);
    box-shadow: 0upx 5upx 10upx 0upx rgba(255, 0, 61, 0.35);
    border-radius: 40upx;
    background-color: rgba(0, 0, 0, 0.9);
  }
}
</style>
