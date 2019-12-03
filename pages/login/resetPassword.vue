<template>
  <view class="content-reset">
    <min-header title="重置密码" :callback="titleCB"></min-header>
    <view class="form-wrap">
      <input-lr
        preText="密码"
        preTextL="max-width"
        type="password"
        placeholder="请输入6-16位数字或字母组合密码!"
        disabled
        v-model="form.passwordone"
      ></input-lr>
      <input-lr
        preText="确认密码"
        preTextL="max-width"
        type="password"
        disabled
        placeholder="请输入6-16位数字或字母组合密码!"
        v-model="form.passwordtwo"
      ></input-lr>
      <view
        class="button-next"
        @tap="toResetPass"
        :class="{ active: isGetting }"
      >
        确认重置
      </view>
    </view>
  </view>
</template>

<script>
import minHeader from "../../components/min-header";
import inputLr from "./_child/input-lr";
import reg from "../../utils/reg";
const initForm = {
  passwordone: "",
  passwordtwo: ""
};
const initPassShow = {
  input1: false,
  input2: false
};
export default {
  components: { minHeader, inputLr },
  data() {
    return {
      form: { ...initForm },
      passShow: { ...initPassShow },
      del: "../../static/login/delete2x.png",
      guanbi: "../../static/login/guanbi2x.png",
      pwHide: "../../static/login/pwHide.png",
      pwShow: "../../static/login/pwShow.png",
      option: {}
    };
  },
  computed: {
    isGetting() {
      return this.form.passwordone && this.form.passwordtwo;
    }
  },
  onLoad(option) {
    this.option = option;
  },
  methods: {
    _empty(type) {
      this.form[type] = "";
    },
    toResetPass() {
      if (!this.option.phone) {
        this.$showMsg("当前访问有误");
        return;
      }
      if (this.form.passwordone !== this.form.passwordtwo) {
        this.$showMsg("两次输入的密码不一致");
        return;
      }
      if (!reg(this.form.passwordone, "password")) {
        this.$showMsg("密码不符合6-16位数字或字母密码");
        return;
      }
      const body = {
        action: "login",
        app: "forgotpassword",
        phone: this.option.phone,
        password: this.form.passwordone,
        keyCode: this.option.keyCode
      };
      uni.showLoading({ title: "", mask: true });
      this.$Http
        .post(body)
        .then(res => {
          this.$showMsg("密码修改成功,请重新登录", () => {
            uni.navigateTo({
              url: "/pages/login/login"
            });
          });
          uni.hideLoading();
        })
        .catch(e => {
          this.$showMsg(e || "请求失败");
          uni.hideLoading();
        });
    },
    pwStatus(type) {
      this.passShow[type] = !this.passShow[type];
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