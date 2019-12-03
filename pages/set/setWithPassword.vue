<template>
  <view>
    <min-header
      :title="`${hasWithPassword ? '修改' : '设置'}提现密码`"
      :callback="goBack"
    >
    </min-header>
    <view class="container-box">
      <input-lr
        :placeholder="placeholders.phone"
        preIcon="phone"
        v-model="form.phone"
        disabled
      ></input-lr>
      <input-lr
        :placeholder="placeholders.encode"
        preIcon="encode"
        v-model="form.encode"
      >
        <text class="text-p" @tap.stop="sendCode">{{ codeText }}</text>
      </input-lr>
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

      <view class="button-submit" @tap="toEdit"> 确认 </view>
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
  passwordone: "",
  passwordtwo: ""
};
export default {
  components: { minHeader, inputLr },
  data() {
    return {
      hasWithPassword: false,
      isGetingCode: false, //验证码是否返回数字
      codeText: "获取验证码",
      codeTimer: null,
      form: { ...initForm },
      placeholders: {
        phone: "请输入有效的手机号",
        encode: "请输入验证码",
        passwordone: "请输入6位数字提现密码",
        passwordtwo: "请确认提现密码"
      },
      userInfo: {}
    };
  },
  onLoad(option) {
    this.hasWithPassword = +option.hasWithPassword;
    this.getMobil();
  },
  methods: {
    ...mapActions(["getCode","getUserInfo"]),
    toEdit() {
      if (!this.valid()) return;
      const body = {
        action: "user",
        app: "set_password1",
        password: this.form.passwordone,
        phone: this.form.phone,
        keyCode: this.form.encode
      };
      this.$Http
        .post(body)
        .then(res => {
          this.$showMsg("提现密码修改成功", () => {
            this.goBack();
          });
        })
        .catch(msg => {
          this.$showMsg(msg);
        });
    },
    getMobil() {
      this.getUserInfo()
        .then(res => {
          this.form.phone = res.data.user.mobile;
        })
        .catch(msg => {
          this.$showMsg(msg);
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
    goBack() {
      uni.navigateBack();
    },
    valid() {
      if (!this.isGetingCode) {
        this.$showMsg("请先获取验证码");
        return false;
      }
      if (this.form.passwordone !== this.form.passwordtwo) {
        this.$showMsg("两次输入的密码不一致");
        return false;
      }
      if (!reg(this.form.passwordone, "withdraw")) {
        this.$showMsg("提现密码输入不符合规则,只能输入6位数字密码");
        return false;
      }
      return true;
    }
  }
};
</script>
<style scoped lang='less'>
@import url("./less/index.less");
</style>
