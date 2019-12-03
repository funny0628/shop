<template>
  <view class="con">
    <min-header title="修改手机" :callback="goBack"></min-header>

    <view class="container-box">
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
      <view class="button-submit" @tap="toEdit">确认 </view>
    </view>
  </view>
</template>
<script>
import minHeader from "@/components/min-header";
import inputLr from "./_child/input-lr";
import reg from "../../utils/reg";
import { mapActions } from "vuex";
const initForm = {
  phone: "",
  encode: "",
  originPhone: ""
};
export default {
  components: { minHeader, inputLr },
  data() {
    return {
      disableCodeBtn: false, //验证码是否返回数字
      codeText: "获取验证码",
      codeTimer: null,
      form: { ...initForm },
      placeholders: {
        phone: "请输入有效的手机号",
        encode: "请输入验证码"
      },
      userInfo: {}
    };
  },
  onLoad(options) {
    this.form.originPhone = options.origin;
    this.getUser();
  },
  methods: {
    ...mapActions(["getUserInfo", "getCode"]),
    getUser() {
      this.getUserInfo()
        .then(res => {
          this.userInfo = res.data.user;
          this.form.originPhone = this.userInfo.mobile;
        })
        .catch(e => {
          this.$showMsg(e || "");
        });
    },
    sendCode() {
      if (!reg(this.form.phone, "phone")) {
        this.$showMsg("手机号码填写有误");
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
    toEdit() {
      if (!reg(this.form.phone, "phone")) {
        this.$showMsg("手机号码填写有误");
        return;
      }
      if (!this.isGetingCode) {
        this.$showMsg("请获取验证码");
        return;
      }
      if (!this.form.encode) {
        this.$showMsg("请填写验证码");
        return;
      }
      const body = {
        action: "user",
        app: "update_phone",
        y_phone: this.form.originPhone || "", //原来的手机号
        x_phone: this.form.phone,
        keyCode: this.form.encode
      };
      this.$Http
        .post(body)
        .then(res => {
          this.$showMsg("手机号修改成功", () => {
            uni.switchTab({ url: "/pages/user/user" });
          });
        })
        .catch(msg => {
          this.$showMsg(msg);
        });
    },
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>
<style scoped lang='less'>
@import url("./less/index.less");
</style>
