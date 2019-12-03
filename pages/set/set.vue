<template>
  <view class="set">
    <min-header title="设置" :callback="backCB"></min-header>
    <view class="content">
      <cell
        title="个人资料"
        border="b-b b-b-a"
        textSize="30upx"
        textColor="#414141"
        @eventClick="navTo('/pages/set/setInfo')"
        iconColor="#afafaf"
      ></cell>
      <cell
        title="修改手机"
        border="b-b b-b-a"
        textSize="30upx"
        @eventClick="navTo('/pages/set/setPhone')"
        iconColor="#afafaf"
        textColor="#414141"
      ></cell>
      <cell
        :title="`${hasPassword ? `修改` : `设置`}登录密码`"
        border="b-b b-b-a"
        textSize="30upx"
        @eventClick="navTo('/pages/set/setPassword')"
        iconColor="#afafaf"
        textColor="#414141"
      ></cell>
      <cell
        :title="`${hasWithPassword ? `修改` : `设置`}提现密码`"
        border="b-b b-b-a"
        textSize="30upx"
        @eventClick="navTo('/pages/set/setWithPassword')"
        iconColor="#afafaf"
        textColor="#414141"
      ></cell>
    </view>
    <view class="button-submit" @tap="loginOut">
      退出登录
    </view>
  </view>
</template>
<script>
import minHeader from "@/components/min-header";
import cell from "@/components/mix-list-cell";
import { mapActions } from "vuex";
export default {
  components: { minHeader, cell },
  data() {
    return {
      toDetail: "../../static/jiantou2x.png",
      hasPassword: false,
      hasWithPassword:false,
      userInfo: {}
    };
  },
  onLoad() {
    this.getStatusInfo();
    this.getUser();
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    backCB() {
      uni.switchTab({ url: "/pages/user/user" });
    },
    getStatusInfo() {
      this.$Http
        .post({
          action: `user`,
          app: `set`
        })
        .then(res => {
          // password_status  是否有支付密码 0.没有 1.有
          // mima_status 是否有登录密码 0.没有 1.有 字符串
          this.hasPassword = Boolean(res.mima_status);
          this.hasWithPassword = Boolean(res.password_status)
        })
        .catch(e => {
          this.$showMsg(e || "");
        });
    },
    getUser() {
      this.getUserInfo()
        .then(res => {
          this.userInfo = res.data.user;
        })
        .catch(msg => {
          this.$showMsg(msg);
        });
    },
    navTo(url) {
      console.log(this.userInfo);
      const _mobile = this.userInfo.mobile || "";
      uni.navigateTo({
        url: `${url}?hasPassword=${+this.hasPassword}&hasWithPassword=${+this.hasWithPassword}&mobile=${_mobile}`
      });
    },
    loginOut() {
      //这里要清除关于登录的一些信息,以及vuex中的信息
      //暂时写清除所有

      this.$Http
        .post({
          action: "login",
          app: "quit"
        })
        .then(res => {
          this.$showMsg("退出登录成功", () => {
            uni.clearStorage();
            uni.switchTab({
              url: "/pages/user/user"
            });
          });
        })
        .catch(msg => {
          this.$showMsg(msg || "");
        });
    }
  }
};
</script>
<style scoped lang='less'>
page,
.set {
  height: 100%;
  background: #f6f6f6;
  & > .content {
    margin: 30upx auto 0;
    width: 690upx;
    background-color: #fff;
    border-radius: 10upx;
    .ceil {
      color: #020202;
      font-size: 30upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      height: 100upx;
      text {
      }
      image {
        width: 16upx;
        height: 28upx;
      }
    }
  }
  .button-submit {
    margin: 99upx auto 0;
    height: 81upx;
    width: 581upx;
    background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#c93802, #c93802);
    background-blend-mode: normal, normal;
    box-shadow: 0upx 5upx 10upx 0upx rgba(255, 0, 61, 0.35);
    border-radius: 40upx;
    opacity: 0.9;
    background-size: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30upx;
    color: #ffffff;
  }
}
</style>
