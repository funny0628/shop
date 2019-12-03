<!-- 
自定义验证码输入、密码输入使用
 
使用方法：
maxlength：输入最大长度
isPwd：是否是密码模式
@finish：回调函数
 <validcode :maxlength="4" :isPwd="false" @finish="finish"></validcode>
 -->
<template>
  <view class="code-area">
    <view class="flex-box">
      <input
        type="number"
        focus="true"
        :maxlength="maxlength"
        class="hide-input"
        v-model="val"
        @input="setVal"
      />
      <view v-bind:class="['item', { active: codeIndex == 1 }]">
        <view class="line"></view>
        <template v-if="isPwd && codeArr.length >= 1">
          <text class="dot">·</text>
        </template>
        <template v-else>
          {{ codeArr[0] ? codeArr[0] : "" }}</template
        >
      </view>
      <view v-bind:class="['item', { active: codeIndex == 2 }]">
        <view class="line"></view>
        <template v-if="isPwd && codeArr.length >= 2">
          <text class="dot">·</text>
        </template>
        <template v-else>
          {{ codeArr[1] ? codeArr[1] : "" }}</template
        >
      </view>
      <view v-bind:class="['item', { active: codeIndex == 3 }]">
        <view class="line"></view>
        <template v-if="isPwd && codeArr.length >= 3">
          <text class="dot">·</text>
        </template>
        <template v-else>
          {{ codeArr[2] ? codeArr[2] : "" }}</template
        >
      </view>
      <view v-bind:class="['item', { active: codeIndex == 4 }]">
        <view class="line"></view>
        <template v-if="isPwd && codeArr.length >= 4">
          <text class="dot">·</text>
        </template>
        <template v-else>
          {{ codeArr[3] ? codeArr[3] : "" }}</template
        >
      </view>
      <template v-if="maxlength === 6">
        <view v-bind:class="['item', { active: codeIndex == 5 }]">
          <view class="line"></view>
          <template v-if="isPwd && codeArr.length >= 5">
            <text class="dot">·</text>
          </template>
          <template v-else>
            {{ codeArr[4] ? codeArr[4] : "" }}</template
          >
        </view>
        <view v-bind:class="['item', { active: codeIndex == 6 }]">
          <view class="line"></view>
          <template v-if="isPwd && codeArr.length >= 6">
            <text class="dot">·</text>
          </template>
          <template v-else>
            {{ codeArr[5] ? codeArr[5] : "" }}</template
          >
        </view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    //最大长度 值为4或者6
    maxlength: {
      type: Number,
      default: 4
    },
    //是否是密码
    isPwd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codeIndex: 1, //下标
      codeArr: [],
      val:null,
    };
  },
  methods: {
    //取值
    setVal(e) {
      let { value } = e.detail;
      let arr = value.split("");
      this.codeIndex = arr.length + 1;
      this.codeArr = arr;
    },
    getVal(){
      if (this.codeIndex > Number(this.maxlength)) {
        //输入完成
        return this.codeArr.join("")
      }
      return false;
    },
    clearVal(){
      this.val = null;
      this.codeIndex = 1;
      this.codeArr = [];
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./valid-code.less");
</style>
