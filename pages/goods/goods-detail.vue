<template>
  <view class="container">
    <status-bar-header
      :back="true"
      @goback="goback"
      title="商品详情"
    ></status-bar-header>
    <view class="bg-padding"></view>
    <swiper class="banner-list" circular @change="changeBanner">
      <swiper-item
        v-for="(item, index) in bannerList"
        :key="index"
        class="list-item"
      >
        <image :src="item" />
      </swiper-item>
    </swiper>
    <view class="tiggers">
      <view
        v-for="(item, index) in bannerList"
        :class="{ active: index === currentBN }"
      ></view>
    </view>
    <view class="content">
      <!-- 标题 -->
      <view class="tilte">{{ pro.name }} </view>
      <view class="info">
        {{ pro.subtitle }}
      </view>
    </view>
    <view class="need">
      <view class="gold">
        <view class="money">
          <text class="max">￥{{ pro.price | price(0) }}</text>
          <text class="min">{{ pro.price | price(1) }}元</text>
        </view>
        <view class="add">
          +
        </view>
        <view class="gold-r"> {{ Number(pro.gold) }}金币 </view>
      </view>
      <view class="repertory">
        <view class="num">销量:{{ pro.volume }}</view>
        <view class="num">库存:{{ goodsCount }}</view>
      </view>
    </view>
    <view class="rule" @tap="checkedRule">
      <view class="checked">规格选择</view>
      <view class="mas">
        <template v-for="(item, index) in checkedArr">
          <view class="ma" v-if="item.name" :key="index">{{ item.name }}</view>
        </template>
      </view>
    </view>
    <rich-text
      :nodes="pro.content | formatRichText"
      class="goods-desc"
    ></rich-text>
    <view class="padding-box"></view>
    <!-- 底部的flex -->
    <view class="fixed-b">
      <view class="to-home item" @tap="navTo('/pages/home/home')">
        <image src="../../static/tabBar/home-act.png"></image>
        <text>首页</text>
      </view>
      <view class="to-collect item">
        <image
          @tap="collecting(1)"
          v-if="detail.type === 0"
          src="../../static/goods/sc.png"
        ></image>
        <image
          @tap="collecting(2)"
          v-else
          src="../../static/goods/scxz.png"
        ></image>
        <text>收藏</text>
      </view>
      <view class="to-buy">
        <view class="buy" @tap="submit(false)">立即购买</view>
      </view>
    </view>

    <!-- 底部弹窗 -->
    <uni-popup ref="popup" maskClick custom type="bottom">
      <scroll-view scroll-y class="pop-content">
        <view class="top">
          <image :src="showItem.imgurl || pro.photo_x"></image>
          <view class="right-info">
            <view class="collected">
              {{ showItem.name ? `已选:${showItem.name}` : " " }}
            </view>
            <view class="num">库存:{{ goodsCount }}{{ goodsUnit }} </view>
            <view class="gold">
              <view class="money">
                <text class="max"
                  >￥{{ showItem.price || pro.price | price(0) }}</text
                >
                <text class="min"
                  >{{ showItem.price || pro.price | price(1) }}元</text
                >
              </view>
              <view class="add">
                +
              </view>
              <view class="gold-r">
                {{
                  showItem.gold ? Number(showItem.gold) : Number(pro.gold)
                }}金币
              </view>
            </view>
          </view>
        </view>
        <view class="select-item" v-for="(item, x) in attrList" :key="x">
          <view class="item-title">{{ item.attrName }}</view>
          <view class="item-btns">
            <view
              @tap="select(x, pro)"
              class="item"
              :class="{ active: checkedArr[x].id === pro.id }"
              v-for="(pro, y) in item.attr"
              :key="y"
              >{{ pro.attributeValue }}</view
            >
          </view>
        </view>
        <view class="buy">
          <view class="text">购买数量</view>
          <view class="right-handle">
            <image
              @tap="handleNumber('sub')"
              class="sub"
              v-show="buyNumber > 1"
              src="../../static/goods/-xz.png"
            ></image>
            <image
              class="sub"
              v-show="buyNumber <= 1"
              src="../../static/goods/-.png"
            ></image>
            <view class="num">{{ buyNumber }}</view>
            <image
              @tap="handleNumber('add')"
              class="add"
              v-show="buyNumber < goodsCount"
              src="../../static/goods/+xz.png"
            ></image>
            <image
              v-show="buyNumber >= goodsCount"
              class="add"
              src="../../static/goods/+.png"
            ></image>
          </view>
        </view>
        <view class="bottom-wrap">
          <view
            @tap="submit(true)"
            class="bottom "
            :class="{ active: Number(goodsCount) !== 0 && showItem.cid }"
          >
            {{ Number(goodsCount) === 0 ? `缺货` : "立即购买" }}
          </view>
        </view>
      </scroll-view>
    </uni-popup>
  </view>
</template>
<script>
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import service from "./goodsDetailService.js";
export default {
  components: { StatusBarHeader, uniPopup },
  data() {
    return {
      id: "",
      detail: {},
      //轮播图
      bannerList: [],
      pro: {
        content: "<p></p>"
      },
      //商品规格
      skuBeanList: {},
      currentBN: 0,
      firstDetail: true,
      collectInfo: {
        img: ""
      },
      // 分类选择
      attrList: [],
      //显示信息
      skuBeanList: [],
      //选择的ids  array
      checkedArr: [],
      oldCheckedArr: [],
      showItem: {}, //展示的那个item
      buyNumber: 1
    };
  },
  onLoad(option) {
    this.id = option.id;
    this.getDetail();
  },
  computed: {
    goodsCount() {
      return this.showItem.cid ? this.showItem.count : this.pro.num;
    },
    goodsUnit() {
      return this.showItem.cid ? this.showItem.unit : this.pro.unit;
    },
    isChecked() {}
  },

  methods: {
    //获取详情
    getDetail() {
      service
        .getDetail(this.id)
        .then(res => {
          this.detail = res.data;
          this.pro = res.data.pro || {};
          this.bannerList = this.detail.pro.img_arr;
          this.skuBeanList = this.detail.skuBeanList;
          this.attrList = this.detail.attrList;
          this.firstDetail && this.sestCollectInfo();
          this.firstDetail = false;
        })
        .catch(msg => {
          this.$showMsg(msg || "获取商品详情失败");
        });
    },
    //轮播图
    changeBanner(e) {
      this.currentBN = e.detail.current;
    },
    //返回
    goback() {
      uni.navigateBack();
    },
    checkedRule() {
      this.$refs.popup.open();
    },
    //收藏
    collecting(type) {
      const msgs = {
        1: {
          success: "收藏成功",
          err: "收藏失败"
        },
        2: {
          success: "取消收藏成功",
          err: "取消收藏失败"
        }
      };
      let body;
      if (type === 1) {
        body = {
          action: "addFavorites",
          store_type: 2,
          app: "index",
          pro_id: this.id
        };
      } else {
        body = {
          action: `addFavorites`,
          store_type: 2,
          app: `removeFavorites`,
          collection: this.detail.collection_id
        };
      }
      this.$Http
        .post(body)
        .then(res => {
          this.$showMsg(msgs[type].success);
          this.getDetail();
        })
        .catch(e => {
          this.$showMsg(e || msgs[type].err);
        });
    },
    sestCollectInfo() {
      //默认展示第一个项目
      const nams = this.skuBeanList[0].name.split(",");
      this.checkedArr = this.skuBeanList[0].attributes.map((x, i) => {
        return {
          id: x.attributeValId,
          name: nams[i]
        };
      });
      this.checkedNameArr = this.skuBeanList[0].name.split(",");
      this.oldCheckedArr = this.checkedArr.concat([]);
      this.showItem = this.skuBeanList[0];
    },
    handleNumber(type) {
      const _count = this.showItem.count || this.pro.num;
      switch (type) {
        case "add":
          if (this.buyNumber < _count) {
            this.buyNumber++;
          } else {
            this.$showMsg("您选择的商品数量达到上限了");
          }
          break;
        case "sub":
          this.buyNumber--;
          break;

        default:
          break;
      }
    },
    navTo(url) {
      uni.switchTab({ url });
    },
    select(x, item) {
      const { id, attributeValue } = item;
      if (this.checkedArr[x].id === id) {
        this.$set(this.checkedArr, x, {});
      } else {
        this.$set(this.checkedArr, x, { id, name: attributeValue });
      }
      this.getShowItem();
    },
    getShowItem() {
      const v = this.checkedArr;
      const _selectStr = v.map(x => x.id).join("");
      let result = {};
      this.skuBeanList.forEach(x => {
        const _uniqStr = x.attributes.reduce(
          (prev, next) => prev + next.attributeValId,
          ""
        );

        if (_uniqStr === _selectStr) {
          result = x;
        }
      });

      this.showItem = result;
    },
    submit(flag) {
      if (Number(this.goodsCount) === 0) {
        flag && this.$showMsg("该类型商品缺货,请重新选择");
        !flag && this.$refs.popup.open();
        return;
      }
      if (!this.showItem.cid) {
        flag && this.$showMsg("请选择规格");
        !flag && this.$refs.popup.open();
        return;
      }
      this.valid();
    },
    valid() {
      const order_products = {
        pid: this.id,
        cid: this.showItem.cid,
        price: this.showItem.price,
        gold: this.showItem.gold,
        num: this.buyNumber
      };
      service
        .preview(order_products)
        .then(res => {
          //这里请求后台接口,请求成功就返回ok
          const str = `pid=${this.id}&cid=${this.showItem.cid}&price=${this.showItem.price}&gold=${this.showItem.gold}&num=${this.buyNumber}`;
          uni.navigateTo({ url: `/pages/order/create?${str}` });
        })
        .catch(msg => {
          this.$showMsg(msg);
          this.firstDetail = true;
          this.getDetail();
        });
    }
  }
};
</script>
<style scoped lang='less'>
@import url("./goods-detail.less");
</style>
  