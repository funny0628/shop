<template>
  <view class="user">
    <StatusBarHeader title="我的">
      <template slot="icon">
        <view class="msg" @tap="linkMenu('message')">
          <image src="../../static/user/msg.png" />
          <text class="msg-count" v-if="Number(msgCount)">{{ msgCount>99?'99+':msgCount }}</text>
        </view>
      </template>
    </StatusBarHeader>
    <!-- 测试代码 -->
    <view class="user-header">
      <view class="user-info">
        <view class="user-photo">
          <image :src="userInfo.headimgurl" @tap="isLogin() && goTo('/pages/set/setInfo')" v-if="userInfo.headimgurl"></image>
          <image src="../../static/user/default_user.png" v-else/></image>
        </view>
        <view
          class="user-name"
          v-if="isLogin()"
          @tap="goTo('/pages/set/setInfo')"
          >{{ userInfo.user_name }}</view
        >
        <view class="user-name" v-else @tap="login">立即登录</view>
        <!-- <view class="sign-in-btn">签到领金币</view> -->
      </view>
    </view>
    <view class="order-menu">
      <view class="order-menu-item" @tap="goTo('/pages/order/order')">
        <image src="../../static/user/order-all.png" />
        <text>全部订单</text>
      </view>
      <view class="order-menu-item" @tap="goTo('/pages/order/order?type=payment')">
        <image src="../../static/user/order-wait.png" />
        <text>待付款</text>
        <text class="order-total" v-if="Number(orderNum.waitPay)">{{orderNum.waitPay}}</text>
      </view>
      <view class="order-menu-item" @tap="goTo(`/pages/order/order?type=receipt`)">
        <image src="../../static/user/order-receive.png" />
        <text>待收货</text>
        <text class="order-total" v-if="Number(orderNum.waitReceive)">{{orderNum.waitReceive}}</text>
      </view>
      <view class="order-menu-item" @tap="goTo(`/pages/order/order?type=evaluete`)">
        <image src="../../static/user/order-finish.png" />
        <text>已完成</text>
      </view>
    </view>
    <view class="user-menu">
      <view
        class="user-menu-item"
        v-for="(item, i) in userMenu"
        :key="i"
        @tap="linkMenu(item.id, item.noClick)"
      >
        <image :src="`../../static/user/${item.id}.png`"></image>
        <view :class="[!item.noClick && 'click']">
          {{ item.name }}
          <text v-if="item.id === 'gold' && isLogin()"
            >{{ userInfo.score }}个</text
          >
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
const initInfo = {
  headimgurl: "",
  money: 0,
  score: 0,
  user_name: ""
};
export default {
  name: "user",
  components: {
    StatusBarHeader
  },
  data() {
    return {
      // 消息数量
      msgCount: 0,
      orderNum: {
        waitPay: 0,
        waitReceive: 0
      },
      userInfo: {
        ...initInfo
      },
      userMenu: [
        {
          name: "我的金币",
          id: "gold"
          // noClick: true
        },
        {
          name: "我的收藏",
          id: "collect"
        },
        {
          name: "地址管理",
          id: "address"
        },
        {
          name: "设置",
          id: "set"
        }
      ]
    };
  },
  onShow() {
    if (this.isLogin()) {
      this.getUserInfo();
    } else {
      this.msgCount = 0;
      this.userInfo = { ...initInfo };
    }
  },
  methods: {
    fatherEvent() {
      if (this.isflag) {
        console.log("更新大版本");
        this.openUrl("https://www.baidu.com");
      } else {
        this.install(this.wgtUrl);
        console.log("更新小版本");
      }
    },
    // 登录页面跳转
    login() {
      uni.navigateTo({
        url: "/pages/login/login"
      });
    },
    // 登录状态
    isLogin() {
      return uni.getStorageSync("token");
    },
    // 菜单跳转
    linkMenu(id, noClick) {
      if (noClick) return;
      const token = uni.getStorageSync("token");
      uni.navigateTo({
        url: !token ? "/pages/login/login" : `/pages/${id}/${id}`
      });
    },
    // 获取用户信息
    getUserInfo() {
      this.$Http
        .post({
          action: "user",
          app: "index"
        })
        .then(res => {
          this.userInfo = res.data.user;
          this.msgCount = res.data.unread;
          this.orderNum.waitPay = res.data.dfk_num;
          this.orderNum.waitReceive = res.data.dsh_num;
          console.log(res.data.user);
        });
    },
    goTo(url, type = "navigateTo") {
      const token = uni.getStorageSync("token");
      if (!token) {
        uni.navigateTo({
          url: "/pages/login/login"
        });
        return false;
      }
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url
      });
    }
  }
};
</script>
<style lang="less">
@import url("./user");
</style>