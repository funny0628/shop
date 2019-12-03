<template>
  <view class="home">
    <view class="mask" v-if="false"></view>
    <view class="home-title-placing"></view>
    <!--       :style="{ opacity: isScrollUp && 1 }"
 -->

    <view class="home-head-content">
      <!--  :style="{ position: isScrollUp && 'fixed' }" -->
      <!-- <view class="home-head-icon"></view> -->
      <view class="home-head-search" @tap="goTo('/pages/search/search')">
        <input type="text" class="search" value="搜索商品" disabled />
      </view>
      <view class="home-head-news" @tap="goMessage">
        <view class="home-head-news-icon">
          <image src="/static/home/message.png"></image>
          <view class="home-head-news-icon-count" v-if="indexData.xxnum > 0">
            {{ indexData.xxnum > 99 ? "99+" : indexData.xxnum }}
          </view>
        </view>
      </view>
    </view>

    <!-- :style="{ paddingTop: `${top}upx` }" -->
    <mescroll-uni
      @up="upCallback"
      :up="upOption"
      :down="downOption"
      @down="downCallback"
      ref="mescroll"
      :fixed="false"
      @scroll="scroll"
      class="mescroll-uni"
    >
      <!--  这个top 是 
      :top="752" -->
      <!-- 
      :fixed="true" :top="top" -->

      <!-- 头部搜索框 -->
      <!-- <view class="home-head" :style="{ marginTop: `${top}upx` }"> -->
      <view class="home-head">
        <!-- 背景色区域 -->
        <!-- <view class="home-head-bg" :style="{ top: `-${top}upx` }"></view> -->
        <view class="home-head-bg"></view>
      </view>

      <!-- 头部轮播 -->
      <view class="home-banner">
        <!-- 标题栏和状态栏占位符 -->
        <!-- <view class="home-title-placing"></view> -->

        <!-- autoplay -->
        <swiper
          class="home-banner-list"
          circular
          autoplay
          indicator-color="#f6b3cd"
          indicator-active-color="#eb5791"
          :indicator-dots="false"
          @change="changeBanner"
        >
          <swiper-item
            v-for="(item, index) in bannerList"
            :key="index"
            class="list-item"
            @tap="goTo(item.url, item.type)"
          >
            <image :src="item.image" />
          </swiper-item>
        </swiper>

        <!-- 轮播图指示器  改变swiper 指示器在真机上无用 只得自定义 -->
        <view class="home-banner-indicator">
          <view
            :class="[
              'home-banner-indicator-item',
              curBannerIndex === index && 'active',
              `${index}`
            ]"
            v-for="(item, index) in bannerList"
            :key="index"
          >
          </view>
        </view>
      </view>

      <!-- 分类 -->
      <view class="home-category">
        <view
          class="home-category-item"
          v-for="(item, index) in categoryList"
          :key="index"
          @tap="jumpMenu(item.url, index)"
        >
          <image :src="item.image"></image>
          <text>{{ item.label }}</text>
        </view>
        <!-- <view class="home-category-item">
            <image src="/static/home/c5.png"></image>
            <text>热销</text>
          </view>
          <view class="home-category-item">
            <image src="/static/home/c6.png"></image>
            <text>新品</text>
          </view>
          <view class="home-category-item">
            <image src="/static/home/c7.png"></image>
            <text>分类</text>
          </view> -->
      </view>
      <!-- 一级tab -->
      <scroll-view :scroll-x="true" class="home-tab">
        <view
          :class="['home-tab-item', tabActiveIndex === index && 'active']"
          v-for="(item, index) in tabList"
          :key="index"
          @tap="changeTab(item, index)"
        >
          {{ item.pname }}
        </view>
        <!-- <view
          class="underline"
          :style="{ transform: `translateX(${left}px)` }"
        ></view> -->
      </scroll-view>
      <!-- 列表 -->
      <view class="home-list">
        <list-item
          :item="item"
          :index="index"
          class="home-list-item"
          v-for="(item, index) in shopList"
          :key="index"
        ></list-item>
      </view>
    </mescroll-uni>
    <!-- <image
      class="game-center"
      src="../../static/game-entry.png"
      v-if="isShowLink"
      @tap="runToGame"
    ></image> -->
  </view>
</template>

<script>
import minHeader from "@/components/min-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"; // npm安装的引入方式
import ListItem from "@/components/list-item/index.vue"; // npm安装的引入方式
import MinHeader from "@/components/min-header/index.vue"; // npm安装的引入方式
import { mapMutations, mapGetters, mapActions, mapState } from "vuex";
import config from "@/api/config";
let flag = true; // 记录是否第一次
export default {
  components: {
    MescrollUni,
    MinHeader,
    ListItem
  },
  data() {
    return {
      // //接收update传过来的值
      // msg: '',
      // 轮播图背景颜色
      bannerBgColor: "",
      // 轮播图列表
      bannerList: [],
      // 分类列表
      categoryList: [],
      // tabActiveId: "196",
      tabActiveIndex: 0, //0,
      // tabActiveIndex: 2, //0,
      shopList: [],
      tabList: [],
      indexData: {},
      top: 0, // 是一个以upx 为单位
      // 下面列表的配置
      upOption: {
        auto: false,
        textNoMore: "没有更多了...",
        onScroll: false,
        empty: {
          use: false
        }
      },
      downOption: {
        auto: true,
        use: true
      },
      curBannerIndex: 0,
      isScrollUp: false // 是否向上滑了
    };
  },
  onLoad() {
    // this.getIndexData();
    // this.bannerBgColor = this.bannerList[0].background;
    var me = this;
    uni.getSystemInfo({
      success(res) {
        // const top = `${res.statusBarHeight * 2}upx`;
        const top = res.statusBarHeight * 2;
        me.top = top;
      }
    });
    this.init();
  },
  onShow() {
    !flag && this.init();
    !flag && this.getIndexData();
    flag = false;
  },
  computed: {
    ...mapGetters(["visibleUpdateTips", "updateInfo"]),
    ...mapState({
      isShowLink: s => s.isShowLink,
      gameLink: s => s.gameLink
    })
  },
  watch: {
    updateInfo: {
      handler(v) {
        JSON.stringify(v) !== "{}" && this.openUpdate();
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(["setStrollType", "getShowLink", "getGameLink"]),
    ...mapActions(["getShowLink", "getGameLink", "unLinkGold"]),
    changeBanner(e) {
      const index = e.detail.current;
      this.curBannerIndex = index;
      // console.log(index);
      // this.bannerBgColor = this.bannerList[index].background;
    },
    // 初始化请求游戏链接接口
    init(cb) {
      this.unLinkGold();
      // this.getShowLink();
    },
    // 进入游戏中心
    runToGame() {
      if (this.isShowLink) {
        uni.showLoading({ title: "", mask: true });
        this.getGameLink().then(() => {
          uni.hideLoading();
          if (this.gameLink) {
            this.goTo("/pages/game/game");
          }
        });
      }
    },
    // 首页数据
    getIndexData(mescroll) {
      this.$Http
        .post({
          app: "index",
          action: "index",
          store_type: 2
        })
        .then(res => {
          this.indexData = res.data;
          this.bannerList = res.data.banner;
          this.categoryList = res.data.plugin_arr;
          this.tabList = res.data.categoryList;

          // this.shopList = [...this.tabList[this.tabActiveIndex].productList];
          this.$refs.mescroll.mescroll.resetUpScroll();

          this.$refs.mescroll.mescroll.endSuccess();
        })
        .catch(e => {
          this.$refs.mescroll.mescroll.endErr();
        });
    },
    // 下拉刷新
    downCallback(mescroll) {
      console.log("down");
      this.getIndexData(mescroll);
    },
    // 上拉加载
    upCallback(mescroll) {
      if (this.tabList.length === 0) return mescroll.endErr();
      // category_id
      console.log("up");
      const { num, size } = mescroll;
      this.$Http
        .post({
          module: "app",
          action: "index",
          app: "get_more",
          page_no: num,
          category_id: this.tabList[this.tabActiveIndex].cid
        })
        .then(res => {
          if (num === 1) {
            this.shopList = res.data.productList;
          } else {
            this.shopList.push(...res.data.productList);
          }
          // const total = this.tabList[this.tabActiveIndex].productTotal;
          const total = Number(res.data.totalCount);
          const len = res.data.productList.length;
          if (len === total) {
            mescroll.endSuccess(1, false);
            mescroll.showNoMore();
          } else {
            mescroll.endBySize(len, total);
          }
          console.log("len", len, "total", total, "num:", num, "size", size);
          // mescroll.endBySize(len, 2000);
          // mescroll.endSuccess(10, true);
        })
        .catch(() => {
          mescroll.endErr();
        });
    },
    // tab跳转
    jumpMenu(url, index) {
      // 设置逛逛菜单类型(vuex)
      if (index !== 3) {
        this.setStrollType(index);
      }
      uni.switchTab({
        url: index === 3 ? "/pages/category/category" : "/pages/stroll/stroll"
      });
    },
    goTo(url, type = "navigateTo", index) {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url
      });
    },
    changeTab(item, index) {
      // tab 值 改变
      this.tabActiveIndex = index;
      // this.left = index * 200;
      // this.undeLineWidth = (await getElSize(`#item-text-${index}`)).width;
      //重置列表为第一页
      this.$refs.mescroll.mescroll.resetUpScroll();
    },
    scroll(mescroll) {
      this.isScrollUp = mescroll.isScrollUp;
      console.log(
        "当前滚动条的位置:" +
          mescroll.scrollTop +
          ", 是否向上滑:" +
          mescroll.isScrollUp
      );
    },
    goMessage() {
      if (this.isLogin()) {
        return this.goTo("/pages/message/message");
      }
      this.goTo("/pages/login/login");
    },
    isLogin() {
      const token = uni.getStorageSync("token");
      return token;
    },
    closeUpdate() {
      // 通过 id 获取 nvue 子窗体
      const updateMask = uni.getSubNVueById("update-mask");
      const updatePopup = uni.getSubNVueById("update-popup");
      // 关闭 nvue 子窗体
      updateMask.hide("none", 300);
      updatePopup.hide("none", 300);
    },
    openUpdate() {
      // 通过 id 获取 nvue 子窗体
      const updateMask = uni.getSubNVueById("update-mask");
      const updatePopup = uni.getSubNVueById("update-popup");

      // 打开 nvue 子窗体
      updateMask.show("none", 300, function() {
        // 打开后进行一些操作...
        //
      });
      updatePopup.show("none", 300, function() {
        // 打开后进行一些操作...
        //
        // this.closeUpdate();
      });
      console.log(JSON.stringify(this.updateInfo), "this.updateInfo");
      plus.webview.postMessageToUniNView(this.updateInfo, "update-popup");
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./home");
</style>

