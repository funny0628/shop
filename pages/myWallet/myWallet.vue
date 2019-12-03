<template>
  <view class="wallet">
    <view class="wallet-container">
      <view class="wallet-account">
        <view class="wallet-info">
          <view class="balance">{{ data.user_money || 0 }}</view>
          <view class="sub-tit">账户余额（元）</view>
          <view class="operation">
            <view class="recharge">
              <image class="img" src="/static/wallet/recharge.png"></image>
              充值
            </view>
            <view class="withdraw">
              <image class="img" src="/static/wallet/withdraw.png"></image>
              提现
            </view>
          </view>
        </view>
        <view class="hint">
          钱包明细
        </view>
      </view>
    </view>
    <view class="trade-list">
      <mescroll-uni
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
        :top="508"
      >
        <!-- 
       -->
        <view class="list-item" v-for="(item, index) in data.list" :key="index">
          <view class="list-info">
            <text class="status">余额消费</text>
            <text class="time">{{ item.time }}</text>
          </view>
          <view class="list-amount">
            <text class="time">{{ item.money }}</text>
          </view>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>

<script>
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
export default {
  components: {
    MescrollUni
  },
  data() {
    return {
      data: {},
      // 下拉刷新的常用配置
      downOption: {
        use: true, // 是否启用下拉刷新; 默认true
        auto: false // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
      },
      // 上拉加载的常用配置
      upOption: {
        use: true, // 是否启用上拉加载; 默认true
        auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10 // 每页数据的数量,默认10
        },
        noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        empty: {
          tip: "暂无相关数据"
        }
      }
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      const token = uni.getStorageSync("token");
      this.$Http
        .post({
          action: "user",
          app: "details"
        })
        .then(res => {
          this.data = res;
        });
    },
    /*下拉刷新的回调, 有三种处理方式: */
    downCallback(mescroll) {
      // 第1种: 请求具体接口

      this.$Http
        .post({
          action: "user",
          app: "details"
        })
        .then(res => {
          console.log(res);
          this.data = res;
          // 成功隐藏下拉加载状态
          mescroll.endSuccess();
        })
        .catch(() => {
          // 失败隐藏下拉加载状态
          mescroll.endErr();
        });
      // // 第2种: 下拉刷新和上拉加载调同样的接口, 那以上请求可删, 直接用mescroll.resetUpScroll()代替
      // mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      // // 第3种: 下拉刷新什么也不处理, 可直接调用或者延时一会调用 mescroll.endSuccess() 结束即可
      // mescroll.endSuccess();
    },

    /*上拉加载的回调*/
    upCallback(mescroll) {
      // 此时mescroll会携带page的参数:
      let page = mescroll.num; // 页码, 默认从1开始
      let pageSize = mescroll.size; // 页长, 默认每页10条

      this.$Http
        .post({
          action: "user",
          app: "wallet_detailed",

          page: pageSize
        })
        .then(res => {
          console.log(res);

          // 接口返回的当前页数据列表 (数组)
          let curPageData = res.list;
          // 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
          // let totalPage = 99999;
          // 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
          // let totalSize = 99999;
          // 接口返回的是否有下一页 (true/false)
          let hasNext =
            curPageData.length !== 0 && curPageData.length === pageSize;

          //设置列表数据
          if (mescroll.num == 1) this.data.list = []; //如果是第一页需手动置空列表
          this.data.list = this.data.list.concat(curPageData); //追加新数据

          // 成功隐藏下拉加载状态
          // mescroll.endSuccess();

          mescroll.endSuccess(curPageData.length, hasNext);
        })
        .catch(() => {
          // 失败隐藏下拉加载状态
          mescroll.endErr();
        });
      // uni.request({
      //   url: "xxxx?pageNum=" + pageNum + "&pageSize=" + pageSize,
      //   success: data => {
      //     // 接口返回的当前页数据列表 (数组)
      //     let curPageData = data.xxx;
      //     // 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
      //     let totalPage = data.xxx;
      //     // 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
      //     let totalSize = data.xxx;
      //     // 接口返回的是否有下一页 (true/false)
      //     let hasNext = data.xxx;

      //     //设置列表数据
      //     if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动置空列表
      //     this.dataList = this.dataList.concat(curPageData); //追加新数据

      //     // 成功隐藏下拉加载状态
      //     //方法一(推荐): 后台接口有返回列表的总页数 totalPage
      //     mescroll.endByPage(curPageData.length, totalPage);

      //     //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      //     //mescroll.endBySize(curPageData.length, totalSize);

      //     //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
      //     //mescroll.endSuccess(curPageData.length, hasNext);

      //     //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.
      //     //如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据
      //     //如果传了hasNext,则翻到第二页即可显示无更多数据.
      //     //mescroll.endSuccess(curPageData.length);

      //     // 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
      //     this.$nextTick(() => {
      //       mescroll.endSuccess(curPageData.length);
      //     });
      //   },
      //   fail: () => {
      //     // 失败隐藏下拉加载状态
      //     mescroll.endErr();
      //   }
      // });
    }
  }
};
</script>

<style lang="less">
@import url("./myWallet.less");
</style>