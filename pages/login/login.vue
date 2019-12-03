<template>
  <view class="container">
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <l-header :title="loginText"></l-header>
    <view class="container-box">
      <template v-if="oLoginText !== 'passLogin'">
        <input-lr
          :placeholder="placeholders.account"
          preIcon="phone"
          v-model="account"
        ></input-lr>
        <input-lr
          :placeholder="placeholders.password"
          preIcon="password"
          type="password"
          v-model="password"
        >
          <text class="text-f" @tap="toForgetPs">忘记密码</text>
        </input-lr>
      </template>
      <template v-else>
        <input-lr
          :placeholder="placeholders.phone"
          preIcon="phone"
          v-model="phone"
        ></input-lr>
        <input-lr
          :placeholder="placeholders.encode"
          preIcon="encode"
          v-model="encode"
        >
          <view class="text-p" @tap="_getCode">{{ codeText }}</view>
        </input-lr>
      </template>
      <view class="button-submit" @tap="toLogin">登录 </view>
      <view class="bottom-text">
        <text @tap="toRegist">注册新账号 ›</text> |
        <text @tap="toCodeLogin">{{ logins[oLoginText] }} ›</text>
      </view>
    </view>
    <to-agreement class="to-argeement"></to-agreement>
  </view>
</template>

<script>
import lHeader from "./_child/header";
import inputLr from "./_child/input-lr";
import toAgreement from "./toAgreement";
import { mapActions } from "vuex";
import reg from "../../utils/reg";
import { loginBack } from "@/utils/index.js";

export default {
  components: { toAgreement, lHeader, inputLr },
  data() {
    return {
      account: "",
      phone: "",
      password: "",
      encode: "",
      logining: false,
      oLoginText: "codeLogin",
      isEncodeGet: false,
      codeText: "获取验证码",
      codeTimer: null,
      logins: {
        codeLogin: "验证码登录",
        passLogin: "密码登录"
      },
      placeholders: {
        account: "请输入账号/手机号",
        phone: "请输入手机号",
        password: "请输入密码",
        encode: "请输入验证码"
      }
    };
  },
  computed: {
    loginText() {
      return this.oLoginText === "codeLogin" ? "密码登录" : "验证码登录";
    }
  },
  onLoad() {
    this.isEncodeGet = false;
    this.codeText = "获取验证码";
    this.oLoginTex = "codeLogin";
  },
  methods: {
    ...mapActions(["getCode"]),
    navBack() {
      uni.switchTab({ url: "/pages/user/user" });
    },
    toRegist() {
      uni.navigateTo({ url: "/pages/login/register" });
    },
    //忘记密码
    toForgetPs() {
      uni.navigateTo({ url: "/pages/login/retrievepassword" });
    },
    _getCode() {
      if (this.codeText !== "获取验证码") return;
      if (!reg(this.phone, "phone")) {
        this.$showMsg("请输入正确的手机号");
        return;
      }
      this.getCode({ phone: this.phone }).then(res => {
        if (!res) return;
        this.isEncodeGet = true;
        this.$showMsg("验证码发送成功");
        let timers = 60;
        this.codeText = `${timers}秒后可重获`;
        this.codeTimer = setInterval(() => {
          if (timers > 0) {
            timers--;
            this.codeText = `${timers}秒后可重获`;
          } else {
            clearInterval(this.codeTimer);
            this.codeText = "获取验证码";
          }
        }, 1000);
      });
    },
    //codeLogin
    toCodeLogin() {
      this.oLoginText =
        this.oLoginText === "passLogin" ? "codeLogin" : "passLogin";
    },
    async toLogin() {
      if (!this.valid()) return;
      const { account, password, phone, encode } = this;
      this.logining = true;
      let body,
        msg = "";
      if (this.oLoginText === "passLogin") {
        // codeLogin
        body = {
          store_type: 2,
          action: "login",
          app: "register",
          store_id: 1,
          phone,
          keyCode: encode
        };
      } else {
        body = {
          action: "login",
          app: "login",
          store_type: 2,
          phone: account,
          password
        };
        msg = "密码错误";
      }
      this.loginPass(body, msg);
    },
    valid() {
      const msgs = {
        account: "请输入账号/手机号码",
        phone: "请输入手机号码",
        password: "请输入密码",
        passwordErr: "密码不符合6-16位数字，字母组合规范",
        encode: "请输入验证码",
        codeText: "请获取验证码"
      };
      const { account, phone, password, encode, isEncodeGet } = this;
      //这里的oLoginText判断是反向的
      switch (this.oLoginText) {
        case "codeLogin":
          if (!account.length) {
            this.$showMsg(msgs.account);
            return false;
          }
          if (!password.length) {
            this.$showMsg(msgs.password);
            return false;
          }
          if (!reg(password, "password")) {
            this.$showMsg(msgs.passwordErr);
            return false;
          }
          break;
        case "passLogin":
          if (!isEncodeGet) {
            this.$showMsg(msgs.codeText);
            return false;
          }
          if (!phone.length) {
            this.$showMsg(msgs.phone);
            return false;
          }
          if (!encode.length) {
            this.$showMsg(msgs.encode);
            return false;
          }
          break;

        default:
          break;
      }
      return true;
    },
    loginPass(body, msg) {
      uni.showLoading({ title: "", mask: true });
      this.$Http
        .post(body)
        .then(res => {
          uni.setStorageSync("token", res.access_id);
          this.$showMsg("登录成功", () => {
            loginBack();
          });
          this.logining = false;
          uni.hideLoading();
        })
        .catch(e => {
          this.$showMsg(e || msg);
          uni.hideLoading();
          this.logining = false;
        });
    }
  }
};
</script>

<style lang='less' scoped>
.to-argeement {
  margin-top: 300upx;
}
@import url("./less/index.less");
</style>
