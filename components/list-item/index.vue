<template>
  <view
    class="list-item"
    @tap="goTo(`/pages/goods/goods-detail?id=${item.id}`)"
  >
    <view class="img">
      <image :src="item.imgurl"></image>
    </view>
    <view class="info">
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
      <view class="title ellipsis">
        {{ item.product_title || item.name }}
      </view>
      <view class="tag">
        <view
          :class="['tag-item', tag[itemC].class]"
          v-for="(itemC, itemIndex) in item.s_types"
          :key="itemIndex"
        >
          {{ tag[itemC].label }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
      // 好像现在不需要吧
    }
  },
  data() {
    return {
      tag: {
        1: {
          label: "新品",
          class: "new"
        },
        2: {
          label: "热销",
          class: "hot"
        },
        3: {
          label: "推荐",
          class: "recommend"
        }
      }
    };
  },
  methods: {
    goTo(url, type = "navigateTo", index) {
      // switchTab tabbar
      // navigateTo pages
      uni[type]({
        url
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index");
</style>