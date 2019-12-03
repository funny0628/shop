<template>
  <!-- 订单列表 -->
  <view class="order">
    <StatusBarHeader title="我的订单" :back="true" @goback="back" />
    <view class="order-tab">
      <view
        class="order-tab-item"
        @tap="toggleTab(index)"
        v-for="(item, index) in tablist"
        :key="index"
        :class="{ active: index === tabIndex }"
        >{{ item.name }}</view
      >
      <view
        class="underline"
        :style="{ transform: `translateX(${left}px)` }"
      ></view>
    </view>
    <view class="mescroll-wrap ">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="downOption"
        :up="upOption"
        @up="loadMore"
      >
        <view class="order-list" v-if="list && list.length > 0">
          <order-item
            :item="item"
            :index="index"
            class="order-list-item"
            v-for="(item, index) in list"
            :key="index"
            @callback="callback"
          ></order-item>
        </view>
        <template v-if="list && list.length === 0">
          <empty content="该分类暂无订单～" />
        </template>
      </mescroll-uni>
    </view>
  </view>
</template> 

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import OrderItem from "./order-item.vue";
import empty from "@/components/empty/empty.vue";

export default {
  components: { StatusBarHeader, MescrollUni, OrderItem, empty },
  data() {
    return {
      tabIndex: 0,
      tablist: [
        {
          id: "",
          name: "全部",
          loadingType: "more",
          orderList: []
        },
        {
          id: "payment",
          name: "待付款",
          loadingType: "more",
          orderList: []
        },
        {
          id: "send",
          name: "待发货",
          loadingType: "more",
          orderList: []
        },
        {
          id: "receipt",
          name: "待收货",
          loadingType: "more",
          orderList: []
        },
        {
          id: "evaluete",
          name: "已完成",
          loadingType: "more",
          orderList: []
        }
      ],
      left: 0,

      downOption: {
        use: false
      },
      upOption: {
        auto: false,
        empty: {
          use: false
        },
        textNoMore: "没有更多商品了～"
      },
      list: null
    };
  },
  computed: {},

  onLoad(opt) {
    opt.type = opt.type || "";
    let index = this.tablist.findIndex(x => x.id === opt.type);
    index === -1 && (index = 0);
    this.tabIndex = index;
    console.log(opt, this.tabIndex, opt.type);
  },
  onShow() {
    this.toggleTab(this.tabIndex);
  },
  methods: {
    callback() {
      this.toggleTab(this.tabIndex);
    },
    // 返回
    back() {
      uni.switchTab({ url: "/pages/user/user" });
    },
    toggleTab(index) {
      this.$nextTick(function() {
        this.list = null;
        this.tabIndex = index;
        this.left = uni.upx2px(index * 120 + 30);
        // this.left = index * uni.upx2px(116) + uni.upx2px(30);
        this.$refs.mescroll.mescroll.resetUpScroll();
        // console.log("我被调用了吧---------------");
        this.$refs.mescroll.mescroll.scrollTo(0, 0);
      });
    },
    loadMore(mescroll) {
      let { num, size } = mescroll;
      this.getList(this.tablist[this.tabIndex].id, num);
    },

    getList(order_type, page_no = 1) {
      // 还没有订单的接口 啊
      this.$Http
        .post({
          action: "order",
          num: page_no,
          app: "index",
          order_type
        })
        .then(res => {
          let { order, total } = res;
          // 模拟的数据哦
          if (page_no > 1) {
            this.list.push(...order);
          } else {
            this.list = order;
          }
          this.$refs.mescroll.mescroll.endBySize(order.length, Number(total));
        })
        .catch(e => {
          console.log(e);
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
        });
    }
  }
};
</script>
<style lang="less">
@import url("./order.less");
</style>