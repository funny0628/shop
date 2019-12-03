<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots circular="true" duration="400">
        <swiper-item
          class="swiper-item"
          v-for="(item, index) in bannerList"
          :key="index"
        >
          <view class="image-wrapper">
            <image :src="item" class="loaded" mode="aspectFill"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="introduce-section">
      <text class="title">{{ goodsName }}</text>
      <view class="price-box">
        <text class="price-tip">¥</text>
        <text class="price">{{ goodsPrice }}</text>
        <!-- <text class="m-price">¥488</text> -->
        <!-- <text class="coupon-tip">7折</text> -->
      </view>
      <view class="bot-row">
        <text>销量: {{ goodsSales }}</text>
        <text>库存: {{ goodsCount }}</text>
        <text>浏览量: 9999</text>
      </view>
    </view>

    <!--  分享 -->
    <!-- <view class="share-section" @tap="share">
      <view class="share-icon">
        <text class="yticon icon-xingxing"></text>
        返
      </view>
      <text class="tit">该商品分享可领49减10红包</text>
      <text class="yticon icon-bangzhu1"></text>
      <view class="share-btn">
        立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view> -->

    <view class="c-list">
      <view class="c-row b-b" @tap="toggleSpec">
        <text class="tit">购买类型</text>
        <view class="con">
          <text
            class="selected-text"
            v-for="(sItem, sIndex) in specSelected"
            :key="sIndex"
          >
            {{ sItem.name }}
          </text>
        </view>
        <text class="yticon icon-you"></text>
      </view>
      <!-- <view class="c-row b-b">
        <text class="tit">优惠券</text>
        <text class="con t-r red">领取优惠券</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="c-row b-b">
        <text class="tit">促销活动</text>
        <view class="con-list">
          <text>新人首单送20元无门槛代金券</text>
          <text>订单满50减10</text>
          <text>订单满100减30</text>
          <text>单笔购买满两件免邮费</text>
        </view>
      </view>
      <view class="c-row b-b">
        <text class="tit">服务</text>
        <view class="bz-list con">
          <text>7天无理由退换货 ·</text>
          <text>假一赔十 ·</text>
        </view>
      </view> -->
    </view>

    <!-- 评价 -->
    <view class="eva-section">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>(86)</text>
        <text class="tip">好评率 100%</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box">
        <image
          class="portrait"
          src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg"
          mode="aspectFill"
        ></image>
        <view class="right">
          <text class="name">Leo yo</text>
          <text class="con"
            >商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text
          >
          <view class="bot">
            <text class="attr">购买类型：XL 红色</text>
            <text class="time">2019-04-01 19:21</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-desc">
      <view class="d-header">
        <text>图文详情</text>
      </view>
      <rich-text
        :nodes="goodsDesc"
        class="goods-desc"
        style="font-size: 14px;width: 100%;max-width: 100%;"
      ></rich-text>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <navigator url="/pages/home/home" open-type="switchTab" class="p-b-btn">
        <text class="yticon icon-xiatubiao--copy"></text>
        <text>首页</text>
      </navigator>
      <navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
        <text class="yticon icon-gouwuche"></text>
        <text>购物车</text>
      </navigator>
      <view
        class="p-b-btn"
        :class="{ active: collectState }"
        @tap="toggleCollectState"
      >
        <text class="yticon icon-shoucang"></text>
        <text>收藏</text>
      </view>

      <view class="action-btn-group">
        <button
          type="primary"
          class=" action-btn no-border buy-now-btn"
          @tap="buy"
        >
          立即购买
        </button>
        <button type="primary" class=" action-btn no-border add-cart-btn">
          加入购物车
        </button>
      </view>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view
      class="popup spec"
      :class="specClass"
      @touchmove.stop.prevent="stopPrevent"
      @tap="toggleSpec"
    >
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content" @tap.stop="stopPrevent">
        <view class="a-t">
          <image
            src="https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg"
          ></image>
          <view class="right">
            <text class="price">¥328.00</text>
            <text class="stock">库存：188件</text>
            <view class="selected">
              已选：
              <text
                class="selected-text"
                v-for="(sItem, sIndex) in specSelected"
                :key="sIndex"
              >
                {{ sItem.name }}
              </text>
            </view>
          </view>
        </view>
        <view v-for="(item, index) in specList" :key="index" class="attr-list">
          <text>{{ item.name }}</text>
          <view class="item-list">
            <text
              v-for="(childItem, childIndex) in specChildList"
              v-if="childItem.pid === item.id"
              :key="childIndex"
              class="tit"
              :class="{ selected: childItem.selected }"
              @tap="selectSpec(childIndex, childItem.pid)"
            >
              {{ childItem.name }}
            </text>
          </view>
        </view>
        <button class="btn" @tap="toggleSpec">完成</button>
      </view>
    </view>
    <!-- 分享 -->
    <!-- <share ref="share" :contentHeight="580" :shareList="shareList"></share> -->
  </view>
</template>

<script>
// import share from "@/components/share";
export default {
  components: {
    // share
  },
  data() {
    return {
      // 轮播图
      bannerList: [],
      // 商品名
      goodsName: "",
      // 商品价格
      goodsPrice: 0,
      // 总库存
      goodsCount: 0,
      // 销量
      goodsSales: 0,
      // 图文详情
      goodsDesc: "",
      // 收藏状态
      collectState: 0,
      specClass: "none",
      specSelected: [],
      favorite: true,
      shareList: [],
      specList: [
        {
          id: 1,
          name: "尺寸"
        },
        {
          id: 2,
          name: "颜色"
        }
      ],
      specChildList: [
        {
          id: 1,
          pid: 1,
          name: "XS"
        },
        {
          id: 2,
          pid: 1,
          name: "S"
        },
        {
          id: 3,
          pid: 1,
          name: "M"
        },
        {
          id: 4,
          pid: 1,
          name: "L"
        },
        {
          id: 5,
          pid: 1,
          name: "XL"
        },
        {
          id: 6,
          pid: 1,
          name: "XXL"
        },
        {
          id: 7,
          pid: 2,
          name: "白色"
        },
        {
          id: 8,
          pid: 2,
          name: "珊瑚粉"
        },
        {
          id: 9,
          pid: 2,
          name: "草木绿"
        }
      ]
    };
  },
  async onLoad(options) {
    this.getDetail();
    //接收传值,id里面放的是标题，因为测试数据并没写id
    let id = options.id;
    if (id) {
      this.$api.msg(`点击了${id}`);
    }

    //规格 默认选中第一条
    this.specList.forEach(item => {
      for (let cItem of this.specChildList) {
        if (cItem.pid === item.id) {
          this.$set(cItem, "selected", true);
          this.specSelected.push(cItem);
          break; //forEach不能使用break
        }
      }
    });
    // this.shareList = await this.$api.json("shareList");
  },
  methods: {
    getDetail() {
      this.$Http
        .post({
          action: "product",
          app: "index",
          pro_id: 416
        })
        .then(res => {
          const { img_arr, name, price, num, volume, content } = res.data.pro;
          // 轮播图
          this.bannerList = img_arr;
          //商品名
          this.goodsName = name;
          // 商品价格
          this.goodsPrice = price;
          // 总库存
          this.goodsCount = num;
          // 销量
          this.goodsSales = volume;
          // 图文详情
          this.goodsDesc = content;
          // 收藏状态
          this.collectState = res.data.type;
          // console.log(this.bannerList);
        });
    },
    //规格弹窗开关
    toggleSpec() {
      if (this.specClass === "show") {
        this.specClass = "hide";
        setTimeout(() => {
          this.specClass = "none";
        }, 250);
      } else if (this.specClass === "none") {
        this.specClass = "show";
      }
    },
    //选择规格
    selectSpec(index, pid) {
      let list = this.specChildList;
      list.forEach(item => {
        if (item.pid === pid) {
          this.$set(item, "selected", false);
        }
      });

      this.$set(list[index], "selected", true);
      //存储已选择
      /**
       * 修复选择规格存储错误
       * 将这几行代码替换即可
       * 选择的规格存放在specSelected中
       */
      this.specSelected = [];
      list.forEach(item => {
        if (item.selected === true) {
          this.specSelected.push(item);
        }
      });
    },
    //分享
    share() {
      this.$refs.share.toggleMask();
    },
    //收藏
    toggleCollectState() {
      this.collectState = !this.collectState;
    },
    buy() {
      uni.navigateTo({
        url: `/pages/order/createOrder`
      });
    },
    stopPrevent() {}
  }
};
</script>

<style lang='less'>
@import url("./goods-detail.less");
</style>
