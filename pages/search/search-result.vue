<template>
  <view class="search-result">
    <view class="status-bar"></view>
    <view class="search-header">
      <image
        src="../../static/common/back.png"
        class="search-header-back"
        @tap="back"
      />
      <view class="search-input">
        <image src="../../static/search/search.png" class="input-search-icon" />
        <input
          v-model="keyword"
          type="text"
          placeholder="搜索商品"
          placeholder-style="color:#fff;font-size: 26upx;opacity:0.8;"
        />
      </view>
      <text class="search-btn" @tap="search(keyword)">搜索</text>
    </view>
    <view class="mescroll-wrap fix-top">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="downOption"
        :up="upOption"
        @up="getData"
      >
        <!-- 列表 -->
        <view v-if="list && list.length > 0">
          <view class="search-result-list">
            <list-item
              :item="item"
              :index="index"
              class="search-result-list-item"
              v-for="(item, index) in list"
              :key="index"
            ></list-item>
          </view>
        </view>
        <view v-if="list && list.length === 0">
          <empty content="没有找到相关商品哦～">
            <view class="button" slot="button" @tap="goStroll">去逛逛</view>
          </empty>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>
<script>
import searchService from "./search.service";
import ListItem from "@/components/list-item/index.vue";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import empty from "@/components/empty/empty.vue";
export default {
  name: "search-result",
  components: {
    ListItem,
    MescrollUni,
    empty
  },
  data() {
    return {
      keyword: "",
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
  onLoad({ keyword }) {
    this.keyword = keyword;
    this.$nextTick(() => {
      this.search();
    });
  },
  methods: {
    goStroll() {
      uni.switchTab({
        url: `/pages/stroll/stroll`
      });
    },
    back() {
      uni.navigateBack();
    },
    search(keyword) {
      keyword && uni.hideKeyboard();
      this.$refs.mescroll.mescroll.resetUpScroll();
      // 存入历史搜索列表
      const { historySearch } = searchService;
      this.historyList = historySearch.save(this.keyword);
    },
    getData(mescroll) {
      let { num, size } = mescroll;
      const { search } = searchService;
      search(this.keyword, num)
        .then(res => {
          if (num > 1) {
            this.list.push(...res.data);
          } else {
            this.list = res.data;
          }
          mescroll.endBySize(res.data.length, Number(res.total));
        })
        .catch(e => {
          this.list = [];
          mescroll && mescroll.endErr();
        });
    }
  }
};
</script>

<style lang="less">
@import url("./search");
.search-result {
  height: 100%;
  background-color: #f6f6f6;
  padding-bottom: 30upx;
  &-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30upx;
    &-item {
      margin-left: 30upx;
      &:nth-of-type(n + 3) {
        margin-top: 20upx;
      }
    }
  }
  .button {
    margin: 70upx auto 0;
    width: 224upx;
    height: 70upx;
    line-height: 70upx;
    background-image: linear-gradient(82deg, #f78c87 0%, #ec597c 100%),
      linear-gradient(#ff7c4b, #ff7c4b);
    background-blend-mode: normal, normal;
    border-radius: 12upx;
    color: #fefefe;
    font-size: 28upx;
    text-align: center;
  }
}
</style>