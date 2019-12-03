<template>
  <view class="gold">
    <StatusBarHeader title="我的金币" :back="true" @goback="back" />
    <view class="gold-bg"></view>
    <view class="gold-card">
      <view class="gold-total">
        <view class="gold-total-num">
          <text>{{ user_money }}</text>
        </view>
        <view class="gold-total-tips">金币余额</view>
        <view class="gold-total-cool">
          提现申请冻结金币：
          <text class="num">{{ lock_score }}</text>
        </view>
      </view>
      <view class="gold-total-btn">
        <view @tap="torecharge">
          <text class="image"></text>
          <text class="world">充值</text>
        </view>
        <view @tap="towithdraw">
          <text class="image"></text>
          <text class="world">提现</text>
        </view>
      </view>
    </view>
    <!-- 弹窗的显示 -->
    <view v-if="isshow" class="mask">
      <view class="setpassword">
        <view @tap="closewindow" class="image"></view>
        <view class="world">需设置提现密码后才可急需进行操作</view>
        <view @tap="tomyset" class="btn">去设置</view>
      </view>
    </view>

    <view ref="shoplist" class="gold-shop-list">
      <view :class="{ nolisttitle: list.length == 0 }" class="title"
        >金币消费明细</view
      >
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :up="upOption"
        @up="loadMore"
        :down="{ use: false }"
      >
        <view v-if="list.length == 0">
          <image class="nolist " src="../../static/gold/icon.png"></image>
        </view>
        <view class="list-item" v-for="(item, index) in list" :key="index">
          <view class="l">
            <view>{{ item.typename }}</view>
            <view>{{ item.add_date }}</view>
          </view>
          <view class="r reduce" :style="{ color: item.color }">{{
            item.money
          }}</view>
        </view>
        <!-- <view v-if="nomoreshow" class="nomore">没有更多了...</view> -->
      </mescroll-uni>
    </view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "gold",
  components: {
    StatusBarHeader,
    MescrollUni
  },
  data() {
    return {
      typename: "",
      isshow: false,
      password: true, //提现密码
      existed: true, //已经申请提现
      userInfo: {},
      user_money: "",
      lock_score: "",
      list: [],
      nomoreshow: false,
      upOption: {
        use: true,
        auto: false,
        textNoMore: "没有更多明细了～"
      },
      typedata: [
        {
          id: "1",
          type: "购物消费"
        },
        {
          id: "2",
          type: "首次关注得积分"
        },
        {
          id: "3",
          type: "转积分给好友"
        },
        {
          id: "4",
          type: "好友转积分"
        },
        {
          id: "5",
          type: "系统扣除"
        },
        {
          id: "6",
          type: "系统赠送"
        },
        {
          id: "7",
          type: "抽奖"
        },
        {
          id: "8",
          type: "会员购物积分"
        },
        {
          id: "9",
          type: "充值"
        },
        {
          id: "10",
          type: "提现成功"
        },
        {
          id: "11",
          type: "游戏收入"
        },
        {
          id: "12",
          type: "游戏支出"
        },
        {
          id: "13",
          type: "订单取消返还金币"
        }
      ]
    };
  },
  onShow() {
    this.getgolddata();
    this.getgolddetail(0);
    uni.getSystemInfo({});
  },
  computed: {
    ...mapState({ withdrawInfo: s => s.withdrawInfo })
  },
  methods: {
    ...mapActions(["goWithdraw"]),
    //下拉加载更多
    loadMore(mescroll) {
      console.log(mescroll.num);
      let { num, size } = mescroll;
      this.getgolddetail(num);
    },

    back() {
      uni.switchTab({ url: "/pages/user/user" });
    },
    torecharge() {
      uni.navigateTo({
        url: "/pages/recharge/recharge"
      });
    },
    towithdraw() {
      // 已设置提现密码&&已经提交过提现申请
      this.goWithdraw().then(() => {
        if (+this.withdrawInfo.isSetWithdrawPwd === 0) {
          this.isshow = true;
        } else if (this.withdrawInfo.availableAmount === "0.00") {
          this.$showMsg("当前可提现金额为0，不可提现");
        } else {
          this.withdrawInfo.availableAmount &&
            uni.navigateTo({ url: "/pages/withdraw/withdraw" });
        }
      });
    },
    closewindow() {
      this.isshow = false;
    },
    tomyset() {
      this.closewindow();
      uni.navigateTo({
        url: `/pages/set/setWithPassword?hasWithPassword=${false}`
      });
    },

    // 获取金币
    getgolddata() {
      this.$Http
        .post({
          action: "user",
          app: "details"
        })
        .then(res => {
          this.user_money = res.user_money;
          this.lock_score = res.lock_score;
        });
    },
    // 获取金币明细
    getgolddetail(num) {
      console.log(num);
      this.$Http
        .post({
          action: "user",
          app: "wallet_detailed",
          page: num
        })
        .then(res => {
          console.log(res);
          if (num === 0) {
            this.list = res.list;
            this.fromattype();
          } else {
            if (this.list.length == res.pager_count) return;
            // this.nomoreshow = true;
            this.list.push(...res.list);
            this.fromattype();
          }
          let { list, pager_count } = res;
          this.$refs.mescroll.mescroll.endBySize(
            list.length,
            Number(pager_count)
          );
          // console.log( list.length, pager_count )
        })
        .catch(err => {
          console.log(err);
          this.$refs.mescroll.mescroll.endErr();
        });
    },
    fromattype() {
      this.list.map(v1 => {
        this.typedata.map(v2 => {
          if (v1.type == v2.id) {
            v1.typename = v2.type;
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
@import url("./gold");
</style>