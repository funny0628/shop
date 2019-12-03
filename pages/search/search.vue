<template>
  <!-- header -->
  <view class="search">
    <!-- #ifdef APP-PLUS -->
    <view class="status-bar"></view>
    <!-- #endif -->
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
    <view class="fix-top">
      <template>
        <view v-if="hotList.length">
          <view class="hot-search">
            <view class="search-title">热门搜索 </view>
            <image
              src="../../static/search/hot.png"
              class="hot-search-icon"
            ></image>
          </view>
          <view class="search-list">
            <view
              class="search-list-item hot-text"
              v-for="(item, index) in hotList"
              :key="index"
            >
              <text @tap="search(item)">{{ item }}</text>
            </view>
          </view>
        </view>
        <view class="history-search" v-if="historyList.length">
          <view class="search-title">历史搜索 </view>
          <image
            @tap="clearHistory"
            src="../../static/search/trash.png"
            class="history-search-icon"
          ></image>
          <view class="search-list">
            <view
              class="search-list-item history-text"
              v-for="(item, index) in historyList"
              :key="index"
            >
              <text @tap="search(item)">{{ item }}</text>
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
<script>
import searchService from "./search.service";
export default {
  name: "search",
  data() {
    return {
      // 关键词
      keyword: "",
      // 热门搜索
      hotList: [],
      // 历史搜索列表
      historyList: []
    };
  },
  created() {
    this.hotSearch();
  },
  onShow() {
    this.historyList = uni.getStorageSync("historyList")
      ? uni.getStorageSync("historyList").split(",")
      : [];
  },
  methods: {
    // 返回
    back() {
      uni.switchTab({
        url: "/pages/home/home"
      });
    },
    //  热门搜索
    hotSearch() {
      const { hotSearch } = searchService;
      hotSearch().then(res => {
        this.hotList = res.data;
      });
    },
    // 清空历史搜索列表
    clearHistory() {
      const { historySearch } = searchService;
      this.historyList = historySearch.clear();
    },
    // 搜索
    search(keyword) {
      uni.hideKeyboard();
      if (!keyword) return false;
      uni.navigateTo({
        url: `/pages/search/search-result?keyword=${keyword}`
      });
      // 存入历史搜索列表
      const { historySearch } = searchService;
      this.historyList = historySearch.save(keyword);
    }
  }
};
</script>
<style lang="less">
@import url("./search.less");
.input {
  background-color: #f4f4f4;
}
</style>