<template>
  <view class="withdraw">
    <StatusBarHeader title="提现" :back="true" @goback="goBack" />
    <view class="content">
      <view class="money">
        <view class="money-top">
          <view class="money-top-title">提现金额</view>
          <view class="money-top-inputwrap">
            <text class="money-top-inputwrap-pre">¥</text>
            <input class="money-top-inputwrap-input" v-model="form.money" placeholder-style="color:#818181" :placeholder="placeholders.money" type="number"></input>
          </view>
        </view>
        <view class="money-bottom">
          <view class="left-info">可提现: <text>{{withdrawInfo.availableAmount}}元</text></view>
          <view class="right-btn" @tap="allwithdrwa">全部提现</view>
        </view>
      </view>
      <view class="info">
         <view class="ceil">
           <view class="ceil-pre">银行卡号:</view>
           <input class="ceil-input" v-model="form.card" placeholder-style="color:#818181" type="number" :placeholder="placeholders.card"></input>
         </view>
         <view class="ceil" @tap="selectBank">
           <view class="ceil-pre">开户银行:</view>
           <view class="ceil-btn" >
             <template v-if="!bank"> 
             请选择开户银行 
             </template>
              <text class="ceil-bank" v-else>
              {{bankName}}
             </text>
             <text class="cell-more icon-you"></text>
          </view>
         </view>
         <view class="ceil">
           <view class="ceil-pre">持卡人姓名:</view>
           <input class="ceil-input"  v-model.trim="form.username" placeholder-style="color:#818181" :placeholder="placeholders.username"></input>
         </view>
      </view>
      <div class="tip">为了您的提现能够及时到账，请确保提现信息准确无误。</div>
      <view class="bottom-btn" @tap="handleWithdraw">
        申请提现
      </view>
    </view>
    <uni-popup ref="popup" maskClick custom type="center">
      <view class="pop-wrap">
       <image class="close" src="../../static/common/close.png" @tap="closePop"></image>
       <view class="title">请输入提现密码</view>
       <valid-code ref="validCode" class="valid-code" :maxlength="6" :isPwd="true"></valid-code>  
      <view class="bottom-btn" @tap="submit">确定</view>
      </view>  
    </uni-popup>
    <uni-popup ref="bankPopup" maskClick custom type="bottom">
      <bankList v-model="bank" :list="banks" @close="closeBank"></bankList>
    </uni-popup>
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import validCode from "@/components/valid-code/valid-code.vue";
import bankList from "@/components/bank-list/index.vue";
import reg from "@/utils/reg.js";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    StatusBarHeader,
    uniPopup,
    validCode,
    bankList
  },
  data() {
    return {
      placeholders: {
        money: "请输入正整数（50元起）",
        card: "请输入银行卡号",
        bank: "选择开户银行",
        username: "请输入持卡人真实姓名"
      },
      form: {
        money: "",
        card: "",
        username: ""
      },
      banks: [],
      bank: "",
      bankName: ""
    };
  },
  watch: {
    bank(v) {
      if (!v) this.bankName = "";
      else {
        //这里已经拿到了银行数据列表
        const item = this.banks.filter(x => x.value === v);
        item[0] ? (this.bankName = item[0].text) : "";
      }
    }
  },
  onLoad() {
    this.getBankList().then(() => {
      this.init();
    });
  },
  computed: {
    ...mapState({ withdrawInfo: s => s.withdrawInfo })
  },
  methods: {
    ...mapActions(["goWithdraw"]),
    // 初始化数据
    init() {
      if (!this.withdrawInfo.availableAmount) {
        this.goWithdraw().then(() => {
          this.setInit();
        });
      } else this.setInit();
    },
    setInit() {
      this.form.card = this.withdrawInfo.bankCardNo;
      this.bank = this.withdrawInfo.bankCode;
      this.form.username = this.withdrawInfo.bankCardHolder;
      const min_money = this.withdrawInfo.minWithdrawAmount || 1;
      this.placeholders.money = `请输入正整数（${min_money}元起）`;
    },

    // 获取银行列表
    getBankList() {
      return this.$Http
        .post({
          module: "app",
          action: "user",
          app: "getBankList"
        })
        .then(res => {
          this.banks = res.bank_list;
          console.log(res, "请求了吗");
        })
        .catch(err => {
          console.log(err);
        });
    },
    getInfo() {
      this.$Http
        .post({
          module: "app",
          action: "user",
          app: "getBankList"
        })
        .then(res => {})
        .catch(err => {
          console.log(`${err}` || "");
        });
    },
    goBack() {
      uni.navigateBack();
    },
    allwithdrwa() {
      this.form.money = Number.parseInt(this.withdrawInfo.availableAmount);
    },
    selectBank() {
      uni.hideKeyboard();
      this.$refs.bankPopup.open();
    },
    handleWithdraw() {
      uni.hideKeyboard();
      this.clearCodeVal();
      if (!this.valid()) return;
      this.$refs.popup.open();
    },
    closeBank() {
      this.$refs.bankPopup.close();
    },
    closePop() {
      this.$refs.popup.close();
      this.clearCodeVal();
    },
    clearCodeVal() {
      this.$refs.validCode && this.$refs.validCode.clearVal();
    },
    submit() {
      const withdrawPass = this.$refs.validCode.getVal();
      // console.log(withdrawPass)
      if (!withdrawPass) {
        this.$showMsg("请输入完整密码");
        return;
      } else {
        //这里请求接口返回后跳转页面。
        this.$Http
          .post({
            module: "app",
            action: "user",
            app: "withdraw",
            withdrawAmount: this.form.money,
            bankCode: this.bank,
            bankCardNo: this.form.card,
            bankCardHolder: this.form.username,
            withdrawPassword: withdrawPass
          })
          .then(res => {
            this.closePop();
            uni.navigateTo({
              url: `/pages/withdraw/withdraw-success?cardEnd=${res.data.withdrawInfo}&money=${res.data.withdrawAmount}`
            });
          })
          .catch(err => {
            this.$showMsg(err || "");
          });
      }
    },
    valid() {
      const _withInfo = this.withdrawInfo;
      const _money = +this.form.money;
      const errs = {
        money: "请输入大于0的提现金额",
        card: "请输入银行卡号",
        username: "请输入持卡人姓名",
        bank: "请选择开户银行",
        integer: "提现金额需输入整数",
        bankErr: "输入银行卡号格式有误",
        minErr: `提现金额小于最小提现金额${_withInfo.minWithdrawAmount}元`
      };
      let flag = false;
      for (const key in this.form) {
        if (!this.form[key]) {
          flag = true;
          this.$showMsg(errs[key]);
          break;
        }
      }
      if (flag) return false;
      if (!this.bank) {
        this.$showMsg(errs.bank);
        return false;
      }
      if (_money % 1 !== 0) {
        this.$showMsg(errs.integer);
        return false;
      }
      if (!reg(+this.form.card, "bankCard")) {
        this.$showMsg(errs.bankErr);
        return false;
      }
      if (_money < _withInfo.minWithdrawAmount) {
        this.$showMsg(errs.minErr);
        return false;
      }
      if (_money > _withInfo.availableAmount) {
        this.$showMsg(
          `提现金额超过了用户可提现金额${_withInfo.availableAmount}元`
        );
        return false;
      }
      if (
        _withInfo.maxWithdrawAmount != -1 &&
        _money > _withInfo.maxWithdrawAmount
      ) {
        this.$showMsg(
          `提现金额超过了最大提现金额${_withInfo.maxWithdrawAmount}元`
        );
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./withdraw.less");
</style>