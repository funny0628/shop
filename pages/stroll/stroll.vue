<template>
  <view class="stroll">
    <StatusBarHeader title="逛逛" />
    <view class="stroll-tab">
      <view
        class="stroll-tab-item"
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
    <view class="mescroll-wrap" v-show="list && list.length > 0">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="downOption"
        :up="upOption"
        @down="refresh"
        @up="loadMore"
      >
        <view class="stroll-list">
          <list-item
            :item="item"
            :index="index"
            class="stroll-list-item"
            v-for="(item, index) in list"
            :key="index"
          ></list-item>
        </view>
      </mescroll-uni>
    </view>
    <template v-if="list && list.length === 0">
      <empty content="该分类暂无商品～" />
    </template>
  </view>
</template>
<script>
import ListItem from "@/components/list-item/index.vue";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import empty from "@/components/empty/empty.vue";
import { mapState } from "vuex";
export default {
  name: "stroll",
  components: {
    ListItem,
    MescrollUni,
    StatusBarHeader,
    empty
  },
  data() {
    return {
      downOption: {
        use: true
      },
      upOption: {
        auto: false,
        empty: {
          use: false
        },
        textNoMore: "没有更多商品了～"
      },
      tablist: [
        {
          id: 3,
          name: "推荐"
        },
        {
          id: 2,
          name: "热销"
        },
        {
          id: 1,
          name: "新品"
        }
      ],
      // tab underline
      left: 0,
      //当前tab索引
      tabIndex: 0,
      //
      list: null
    };
  },
  computed: {
    ...mapState({
      strollMenuType: s => s.strollMenuType
    })
  },
  watch: {
    strollMenuType: {
      handler(val) {
        this.$nextTick(() => {
          this.toggleTab(val);
        });
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.getList(this.tablist[this.tabIndex].id);
    },
    loadMore(mescroll) {
      let { num, size } = mescroll;
      this.getList(this.tablist[this.tabIndex].id, num);
    },
    toggleTab(index) {
      this.tabIndex = index;
      this.left = uni.upx2px(index * 120 + 30);
      // this.left = index * uni.upx2px(116) + uni.upx2px(30);
      this.$refs.mescroll.mescroll.resetUpScroll();
      this.$refs.mescroll.mescroll.scrollTo(0, 0);
    },
    getList(s_type, page_no = 1) {
      this.$Http
        .post({
          action: "stroll",
          app: "index",
          page_no,
          s_type
        })
        .then(res => {
          const { productList, totalCount } = res.data;
          if (page_no > 1) {
            this.list.push(...productList);
          } else {
            this.list = res.data.productList;
          }
          this.$refs.mescroll.mescroll.endBySize(
            productList.length,
            Number(totalCount)
          );
        })
        .catch(() => {
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
          this.list = [];
        });
    }
  }
};
</script>
<style lang="less">
@import url("./stroll");
</style>