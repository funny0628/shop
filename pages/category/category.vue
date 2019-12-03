<template>
  <view class="category">
    <status-bar-header title="分类">
      <image
        class="search"
        src="../../static/search/search.png"
        slot="icon"
        @tap="runTo('/pages/search/search')"
      ></image>
    </status-bar-header>
    <view class="content">
      <scroll-view scroll-y class="left-aside">
        <view
          v-for="item in flist"
          :key="item.id"
          class="f-item"
          :class="{ active: item.id === currentId }"
          @tap="tabtap(item)"
        >
          {{ item.name }}
        </view>
      </scroll-view>

      <scroll-view
        scroll-with-animation
        scroll-y
        class="right-aside"
        @scroll="asideScroll"
        :scroll-top="tabScrollTop"
      >
        <view
          v-for="item in slist"
          :key="item.pid"
          class="s-list"
          :id="'main-' + item.pid"
        >
          <view class="s-item">
            <view class="left-l"></view>{{ item.name }}
            <view class="right-l"></view>
          </view>
          <view class="t-list">
            <view
              v-if="titem.pid === item.pid"
              class="t-item"
              v-for="titem in tlist"
              :key="titem.child_id"
              @tap="navToList(item.name, titem, tlist)"
            >
              <image :src="titem.picture"></image>
              <text>{{ titem.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import statusBarHeader from "../../components/status-bar-header/status-bar-header";
import { cateList } from "../../Json.js";
export default {
  components: { statusBarHeader },
  data() {
    return {
      sizeCalcState: false,
      title: "Hello",
      currentId: "",
      flist: [], //左侧栏一级菜单列表
      slist: [], //二级title
      tlist: [], //三级菜单
      tabScrollTop: 0,
      oldScrollTop: 0,
      //这里设置flag如果是左边点击产生滚动,滚动回调不调用
      isLeftScroll: false
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$Http
        .post({
          action: "search",
          app: "index"
        })
        .then(res => {
          const list = res.List || [];
          list
            .filter(x => x.ishaveChild)
            .forEach(item => {
              this.flist.push({
                id: item.cate_id,
                name: item.cate_name,
                picture: item.cimgurl
              });
              this.slist.push({
                pid: item.cate_id,
                name: item.cate_name
              });
              item.children.forEach(j => {
                j.pid = item.cate_id;
                this.tlist.push(j);
              });
            });
          this.currentId = this.flist[0] ? this.flist[0].id : "";
        })
        .catch(e => {
          this.$showMsg(e || "请求失败");
        });
    },
    //一级分类点击
    tabtap(item) {
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      this.isLeftScroll = false;
      this.currentId = item.id;
      let index = this.slist.findIndex(sitem => sitem.pid === item.id);
      this.tabScrollTop = this.oldScrollTop;
      this.$nextTick(() => {
        this.tabScrollTop = this.slist[index].top;
        this.oldScrollTop = this.tabScrollTop;
        this.isLeftScroll = true;
      });
    },
    //右侧栏滚动
    asideScroll(e) {
      if (this.isLeftScroll) {
        this.isLeftScroll = false;
        return;
      }
      if (!this.sizeCalcState) {
        this.calcSize();
      }

      this.oldScrollTop = e.detail.scrollTop;
      // this.tabScrollTop = scrollTop; // 这里在安卓端有个 bug 导致在安卓端滑动卡顿 先注释
      let tabs = this.slist
        .filter(item => item.top <= this.oldScrollTop)
        .reverse();
      if (tabs.length > 0) {
        this.currentId = tabs[0].pid;
      }
    },
    //计算右侧栏每个tab的高度等信息,这里相当于把对应的信息塞到item中
    calcSize() {
      let h = 0;
      this.slist.forEach(item => {
        let view = uni.createSelectorQuery().select("#main-" + item.pid);
        view
          .fields(
            {
              size: true
            },
            data => {
              item.top = h;
              h += data.height;
              item.bottom = h;
            }
          )
          .exec();
      });
      console.log(this.slist);
      this.sizeCalcState = true;
    },
    navToList(name, titem, list) {
      console.log(titem);
      const _list = encodeURIComponent(
        JSON.stringify(list.filter(x => x.pid === titem.pid))
      );
      uni.navigateTo({
        url: `/pages/category/cate-goods?title=${name}&id=${titem.pid}&cid=${titem.child_id}&list=${_list}`
      });
    },
    runTo(url) {
      uni.navigateTo({ url });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./category.less");
</style>
