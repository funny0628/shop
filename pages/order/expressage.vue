<template>
  <!-- 物流 -->
  <view class="expressage">
    <StatusBarHeader title="物流信息" :back="true" @goback="back" />
    <view class="expressage-head" v-if="data.name">
      <view class="expressage-head-content">
        <view class="left">
          <text> {{ data.name }}&nbsp;&nbsp;&nbsp;{{ data.courier_num }} </text>
        </view>
        <view class="right" v-if="false">
          <view class="right-icon">
            <image src="/static/order/right-arrows.png"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="mescroll-wrap ">
      <mescroll-uni
        ref="mescroll"
        :fixed="false"
        :down="{ use: false }"
        :up="{ use: false }"
      >
        <view class="expressage-list" v-if="list && list.length > 0">
          <view
            class="expressage-list-item"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="item-line"></view>
            <view class="item-content">
              <view class="item-description">{{ item.context }}</view>
              <view class="item-time">{{ item.time }}</view>
            </view>
          </view>
        </view>
        <view v-if="list && list.length === 0" class="empty">
          <image src="/static/collect/no-data.png" class="empty-icon"></image>
          <view class="empty-text">暂时还没有物流信息哦～</view>
        </view>
      </mescroll-uni>
    </view>
  </view>
</template>

<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";

export default {
  components: {
    StatusBarHeader,
    MescrollUni
  },
  data() {
    return {
      id: null,
      data: {},
      list: null
    };
  },
  onLoad(opt) {
    // opt.id = "IN190822041900366513";

    this.id = opt.id;
    this.getData();
  },
  methods: {
    getData() {
      this.$Http
        .get({
          action: "order",
          app: "logistics",
          id: this.id
        })
        .then(res => {
          if (res.res_1) {
            this.data = res;
            this.list = this.data.res_1;
            return;
          }
          this.data = res;
          this.list = [];
        })
        .catch(err => {
          this.list = [];
        });
    },
    back() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="less">
@import url("./expressage.less");
</style>