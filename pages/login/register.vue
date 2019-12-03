<template>
  <view class="container">
    <l-header title="注册"></l-header>
    <view class="container-box">
      <input-lr
        :placeholder="placeholders.account"
        preIcon="account"
        v-model="form.account"
      ></input-lr>
      <input-lr
        :placeholder="placeholders.passwordone"
        preIcon="password"
        type="password"
        v-model="form.passwordone"
      >
      </input-lr>
      <input-lr
        :placeholder="placeholders.passwordtwo"
        preIcon="password"
        type="password"
        v-model="form.passwordtwo"
      >
      </input-lr>

      <input-lr
        :placeholder="placeholders.phone"
        preIcon="phone"
        v-model="form.phone"
      ></input-lr>
      <input-lr
        :placeholder="placeholders.encode"
        preIcon="encode"
        v-model="form.encode"
      >
        <text class="text-p" @tap.stop="sendCode">{{ codeText }}</text>
      </input-lr>

      <view class="button-submit" @tap="toRegister">注册 </view>
      <view class="bottom-tologin">
        <!-- 这里暂时去除 -->
        <!-- <text @tap="navToLogin">已有账号,去登录</text> -->
      </view>
    </view>
    <to-agreement></to-agreement>
  </view>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import toAgreement from "./toAgreement";
import lHeader from "./_child/header";
import inputLr from "./_child/input-lr";
import reg from "../../utils/reg";
const initForm = {
  account: "",
  passwordone: "",
  passwordtwo: "",
  phone: "",
  encode: ""
};
const initPassShow = {
  input1: false,
  input2: false
};
export default {
  components: { lHeader, inputLr, toAgreement },
  data() {
    return {
      disableCodeBtn: false, //验证码是否返回数字
      codeText: "获取验证码",
      codeTimer: null,
      form: { ...initForm },
      passShow: { ...initPassShow },

      //是否获取了验证码
      isGetingCode: false,
      placeholders: {
        account: "请输入账号（6-15位字母或数字）",
        passwordone: "请输入6-16位密码",
        passwordtwo: "请再次输入密码",
        phone: "请输入手机号",
        encode: "请输入验证码"
      }
    };
  },
  computed: {
    isRegister() {
      const _form = this.form;
      const _isGetingCode = this.isGetingCode;
      const flag = Object.values(_form).every(x => x.length) && _isGetingCode;
      if (flag) {
        return true;
      }
      return false;
    }
  },
  onLoad() {},
  methods: {
    ...mapActions(["getCode"]),
    navBack() {
      uni.navigateBack();
    },
    navToLogin() {
      //先清空填写的数据
      uni.navigateTo({ url: "/pages/login/login" });
    },
    sendCode() {
      if (!reg(this.form.phone, "phone")) {
        this.$showMsg("手机填写有误");
        return;
      }
      if (this.codeText !== "获取验证码") return;
      this.getCode({ phone: this.form.phone }).then(res => {
        if (!res) return;
        this.isGetingCode = true;
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
    _empty(type) {
      this.form[type] = "";
    },
    pwStatus(type) {
      this.passShow[type] = !this.passShow[type];
    },
    toRegister() {
      if (!Object.values(this.form).every(x => x.length)) {
        this.$showMsg("请先将表单信息填写完整");
        return;
      }
      if (!this.isGetingCode) {
        this.$showMsg("请先获取验证码");
        return;
      }
      if (this.form.passwordone !== this.form.passwordtwo) {
        this.$showMsg("两次输入的密码不一致");
        return;
      }
      const body = {
        action: "login",
        app: "user_register",
        phone: this.form.phone,
        keyCode: this.form.encode,
        password: this.form.passwordone,
        userId: this.form.encode,
        store_type: 2
      };
      this.loading = true;
      this.$Http
        .post(body)
        .then(res => {
          this.$showMsg("注册成功", () => {
            uni.setStorageSync("token", res.access_id);
            uni.navigateBack({ delta: 2 });
          });
          this.loading = false;
        })
        .catch(e => {
          this.$showMsg(e || "请求失败");
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./less/index.less");
</style>