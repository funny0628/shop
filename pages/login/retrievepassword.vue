<template>
  <view class="content-reset">
    <min-header
      :title="type !== 'getCode' ? '找回密码' : '验证手机'"
      :callback="titleCB"
    ></min-header>

    <view class="form-wrap">
      <template v-if="type !== 'getCode'">
        <input-lr
          :placeholder="placeholders.account"
          preText="账号 "
          v-model="form.account"
        ></input-lr>
      </template>

      <template v-if="type === 'getCode'">
        <input-lr
          preText="手机号码"
          preTextL="max-width"
          disabled
          v-model="form.phone"
        ></input-lr>
        <input-lr
          preText="验证码"
          :placeholder="placeholders.encode"
          disabled
          v-model="form.encode"
          preTextL="max-width"
        >
          <text class="text-f" @tap.stop="sendCode">{{ codeText }}</text>
        </input-lr>
      </template>
    </view>
    <view
      class="button-next"
      v-if="type === 'getPhone'"
      @tap="isNextP && getPhone()"
    >
      下一步
    </view>
    <view class="button-next" v-if="type === 'getCode'" @tap="toResetPass">
      下一步
    </view>
  </view>
</template>

<script>
import minHeader from "../../components/min-header";
import inputLr from "./_child/input-lr";
import reg from "../../utils/reg";
import { mapActions } from "vuex";
const initForm = {
  account: "",
  phone: "",
  encode: ""
};

export default {
  components: { minHeader, inputLr },
  data() {
    return {
      //当前所在的步数 getPhone 获取手机号
      // getCode 获取验证码
      type: "getPhone",
      form: { ...initForm },
      codeText: "获取验证码",
      disableCodeBtn: false,
      codeTimer: null,

      placeholders: {
        account: "请输入账号（6-15位字母或数字）",
        encode: "请输入验证码"
      }
    };
  },
  computed: {
    isNextP() {
      return this.form.account.length > 0;
    },
    isNextC() {
      return this.form.encode.length > 0;
    }
  },
  methods: {
    ...mapActions(["getCode"]),
    _empty(type) {
      this.form[type] = "";
    },
    getPhone() {
      const body = {
        action: "login",
        app: "forget_zhanghao",
        zhanghao: this.form.account
      };
      this.$Http
        .post(body)
        .then(res => {
          this.form.phone = res.mobile;
          this.type = "getCode";
        })
        .catch(err => {
          this.$showMsg(`${err}` || "");
        });
    },
    sendCode() {
      if (this.codeText !== "获取验证码") return;
      if (!reg(this.form.phone, "phone")) {
        this.$showMsg("请输入正确的手机号");
        return;
      }
      this.getCode({ phone: this.form.phone }).then(res => {
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
    toResetPass() {
      if (!this.isNextC) return;
      const body = {
        app: "forget_code",
        phone: this.form.phone,
        keyCode: this.form.encode,
        action: "login"
      };
      uni.showLoading({ title: "", mask: true });
      this.$Http
        .get(body)
        .then(res => {
          //跳转到重置密码页面
          const str = `phone=${this.form.phone}&&keyCode=${this.form.encode}`;
          uni.navigateTo({ url: `/pages/login/resetPassword?${str}` });
          uni.hideLoading();
        })
        .catch(e => {
          this.$showMsg(e || "操作错误");
          uni.hideLoading();
        });
    },
    titleCB() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang='less'>
@import url("./less/resetpass.less");
</style>