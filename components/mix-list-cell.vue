<template>
  <view class="content">
    <view
      class="mix-list-cell"
      :class="border"
      @tap="eventClick"
      hover-class="cell-hover"
      :hover-stay-time="50"
    >
      <text
        v-if="icon"
        class="cell-icon yticon"
        :style="[
          {
            color: iconColor
          }
        ]"
        :class="icon"
      ></text>

      <text
        class="cell-tit clamp"
        :style="[
          {
            color: textColor
          },
          {
            fontSize: textSize
          }
        ]"
        >{{ title }}</text
      >
      <text v-if="tips" class="cell-tip">{{ tips }}</text>
      <slot></slot>
      <text class="cell-more" :class="typeList[navigateType]"></text>
    </view>
  </view>
</template>
 
<script>
/**
 *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
 *  比如加入image， iconSize可控等
 */
export default {
  data() {
    return {
      typeList: {
        right: "icon-you"
      }
    };
  },
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "标题"
    },
    tips: {
      type: String,
      default: ""
    },
    navigateType: {
      type: String,
      default() {
        return "right";
      }
    },
    border: {
      type: String,
      default: "b-b"
    },
    hoverClass: {
      type: String,
      default: "cell-hover"
    },
    iconColor: {
      type: String,
      default: "#333"
    },
    textColor: {
      type: String,
      default: "#303133"
    },
    textSize: {
      type: String,
      default: "28upx"
    }
  },
  methods: {
    eventClick() {
      this.$emit("eventClick");
    }
  }
};
</script>

<style lang='less' scoped>
.icon .mix-list-cell.b-b:after {
  left: 90upx;
}
.mix-list-cell {
  display: flex;
  align-items: baseline;
  padding: 20upx 30upx;
  line-height: 60upx;
  position: relative;

  &.cell-hover {
    background: #fafafa;
  }
  &.b-b:after {
    left: 30upx;
  }
  //这里加了个不缩略的样式 b-b  b-b-a
  &.b-b-a:after {
    left: 0;
  }

  .cell-icon {
    align-self: center;
    width: 56upx;
    max-height: 60upx;
    font-size: 38upx;
  }
  .cell-more {
    align-self: center;
    font-size: 30upx;
    color: #606266;
    // margin-left: $uni-spacing-row-sm;
    &.icon-you {
      &::after{
        content: " ";
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        right: 20upx;
        width: 16upx;
        height: 28upx;
        background: url("../static/common/right.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .cell-tit {
    flex: 1;
    align-self: center;
    font-size: 28upx;
    color: #303133;
    margin-right: 10upx;
  }
  .cell-tip {
    font-size: 24upx+2upx;
    color: #909399;
  }
}
</style>
