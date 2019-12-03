<template>
  <view class="cate-goods">
    <status-bar-header
      :back="true"
      @goback="goback"
      :title="title"
    ></status-bar-header>

    <scroll-view
      :scroll-x="true"
      :show-scrollbar="false"
      :scroll-left="scrollLeft"
      class="cate-goods-tab"
    >
      <view style="position:relative">
        <view
          class="cate-goods-tab-item"
          @tap="toggleTab(index)"
          v-for="(item, index) in tablist"
          :key="index"
          :class="{ active: index === tabIndex }"
          ><text :id="`item-text-${index}`">{{ item.name }}</text></view
        >
        <!-- 这里存在upx计算误差,之后可以用百分比计算 -->
        <view
          class="underline-wrap"
          :class="{ transit: transit }"
          :style="{
            transform: `translateX(${left}upx)`
          }"
        >
          <view
            class="underline"
            :style="{
              width: `${undeLineWidth}px`
            }"
          >
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="scroll-wrap">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="downOption"
        @down="refresh"
        :up="upOption"
        @up="loadMore"
      >
        <view class="cate-goods-list">
          <view
            :key="index"
            @tap="navTo(item.id)"
            v-for="(item, index) in list"
            class="cate-goods-list-item"
          >
            <list-item :item="item" :index="index"></list-item>
          </view>
          <view class="empty" v-if="list && list.length === 0">
            <image
              src="../../static/common/empty.png"
              class="empty-icon"
            ></image>
            <view class="empty-text">没有找到相关商品哦～</view>
          </view>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>
<script>
import ListItem from "@/components/list-item/index.vue";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import { getElSize } from "@/utils/index.js";
export default {
  components: { ListItem, MescrollUni, StatusBarHeader },
  data() {
    return {
      title: "",
      downOption: {
        use: true
      },
      upOption: {
        auto: true,
        empty: {
          use: false
        },
        textNoMore: "没有更多商品了～"
      },
      tablist: [],
      scrollLeft: 0,
      oldScrollLeft: 0,
      // tab underline
      left: 0,
      //当前tab索引
      tabIndex: "",
      undeLineWidth: 0,
      cid: "",
      cate_id: "",
      transit: false,
      //
      list: null
    };
  },

  onLoad(options) {
    this.cid = options.cid;
    this.cate_id = options.id;
    this.title = options.title;
    this.tablist = JSON.parse(decodeURIComponent(options.list));
    this.tabIndex = this.tablist.findIndex(x => x.child_id === this.cid);
  },
  mounted() {
    this.getWidth();

    this.$nextTick(() => {
      this.scrollLeft = uni.upx2px(this.tabIndex * 200);
      this.oldScrollLeft = this.scrollLeft;
    });
  },
  methods: {
    refresh() {
      this.getList(this.cid);
    },
    goback() {
      uni.switchTab({ url: "/pages/category/category" });
    },
    loadMore(mescroll) {
      let { num, size } = mescroll;
      this.getList(this.cid, num);
    },
    async getWidth() {
      const index = this.tabIndex;
      this.cid = this.tablist[index].child_id;
      this.left = index * 200;
      this.undeLineWidth = (await getElSize(`#item-text-${index}`)).width;
      this.transit = true;
    },
    async toggleTab(index) {
      this.list = null;
      this.tabIndex = index;
      await this.getWidth();
      this.$refs.mescroll.mescroll.resetUpScroll();
      this.$refs.mescroll.mescroll.scrollTo(0, 0);
    },
    getList(cid, page = 1) {
      this.$Http
        .post({
          action: "search",
          app: "listdetail",
          page,
          cid,
          cate_id: this.cate_id
        })
        .then(res => {
          const { pro, total } = res;
          if (page > 1) {
            this.list.push(...pro);
          } else {
            this.list = res.pro;
          }

          this.$refs.mescroll.mescroll.endBySize(
            this.list.length,
            Number(total)
          );
        })
        .catch(() => {
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
        });
    },
    navTo(id) {
      uni.navigateTo({ url: `/pages/goods/goods-detail?id=${id}` });
    }
  }
};
</script>
<style scoped lang='less'>
@import url("./cate-goods.less");
</style>
