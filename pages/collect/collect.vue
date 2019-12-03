<template>
  <view class="collect">
    <StatusBarHeader title="我的收藏" :back="true" @goback="back" />
    <view class="mescroll-wrap">
      <mescroll-uni
        @up="upCallback"
        :up="upOption"
        :down="downOption"
        ref="mescroll"
        :fixed="false"
        class="mescroll-uni"
      >
        <view class="collect-list" v-if="collectList && collectList.length > 0">
          <view
            class="collect-list-item"
            v-for="(item, i) in collectList"
            :key="i"
            @tap="goTo(`/pages/goods/goods-detail?id=${item.p_id}`)"
          >
            <image :src="item.imgurl" class="imgurl" />
            <view class="text">
              <text class="title">{{ item.product_title }}</text>
              <view class="price ellipsis">
                <text class="money">
                  <text class="small">￥</text>
                  <text class="big">{{ item.price | price(0) }}</text>
                  <text class="small">{{ item.price | price(1) }}</text>
                  <text class="small">元</text>
                </text>
                <text class="plus">&nbsp;+&nbsp;</text>
                <text class="gold">
                  <text class="big">{{ item.gold }}</text>
                  <text class="small">金币</text>
                </text>
              </view>
              <view class="btn" @tap.stop="removeCollect(item.id)"
                >取消收藏</view
              >
            </view>
          </view>
        </view>
        <view>
          <view v-if="collectList && collectList.length === 0" class="empty">
            <image src="/static/collect/no-data.png" class="empty-icon"></image>
            <view class="empty-text">您还没有收藏的商品哦～</view>
          </view>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
export default {
  name: "collect",
  components: {
    StatusBarHeader,
    MescrollUni
  },
  data() {
    return {
      // 收藏商品列表
      collectList: null,
      upOption: {
        auto: true,
        textNoMore: "没有更多了...",
        empty: {
          use: false
        }
      },
      downOption: {
        use: false
      }
    };
  },
  onShow() {
    // this.getCollect();
  },
  methods: {
    // 返回
    back() {
      uni.switchTab({ url: "/pages/user/user" });
    },
    // 取消收藏
    removeCollect(id) {
      const { removeCollect } = this.$Actions.CollectAction;
      removeCollect(id)
        .then(res => {
          // this.getCollect();
          this.$showMsg("取消成功！");
          this.$refs.mescroll.mescroll.resetUpScroll();
        })
        .catch(err => {
          this.$showMsg(err);
        });
    },
    // 下拉刷新
    downCallback(mescroll) {
      console.log("down");
      mescroll.resetUpScroll();
      return;
      const { getCollect } = this.$Actions.CollectAction;
      getCollect({ page_no: 1 })
        .then(res => {
          this.collectList = res.data;
          // this.$refs.mescroll.mescroll.resetUpScroll();
          mescroll.endSuccess();
        })
        .catch(e => {
          mescroll.endErr();
        });
    },
    // 上拉加载
    upCallback(mescroll) {
      const { getCollect } = this.$Actions.CollectAction;
      const { num, size } = mescroll;
      getCollect({ page_no: num })
        .then(res => {
          const { collectionList, totalCount } = res.data;
          // collectionList.push(
          //   ...collectionList,
          //   ...collectionList,
          //   ...collectionList,
          //   ...collectionList
          // );
          console.log(collectionList, totalCount);
          if (num === 1) {
            this.collectList = collectionList;
          } else {
            this.collectList.push(...collectionList);
          }
          // this.collectList = [];
          const total = Number(totalCount);
          const len = collectionList.length;
          if (len === total) {
            // mescroll.endSuccess(1, false);
            // mescroll.showNoMore();
          } else {
          }
          mescroll.endBySize(len, total);
          console.log("len", len, "total", total, "num:", num, "size", size);
          // mescroll.endBySize(len, 2000);
          // mescroll.endSuccess(10, true);
        })
        .catch(e => {
          console.log(e);
          this.collectList = [];
          mescroll.endErr();
        });
    },
    goTo(url, type = "navigateTo") {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url: `${url}`
      });
    }
  }
};
</script>
<style lang="less">
@import url("./collect");
</style>