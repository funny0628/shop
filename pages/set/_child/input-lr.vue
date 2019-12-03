<template>
  <view class="input-item">
    <image :src="icons[preIcon]" v-if="preIcon"></image>
    <view class="input-pre" :class="preTextL" v-if="preText">{{
      preText
    }}</view>
    <input
      class="input-i"
      :type="type"
      maxlength="20"
      :disabled="disabled"
      v-model="valueN"
      placeholder-style="color:#999999"
      :placeholder="placeholder"
      @input="inputN($event.target.value)"
    />
    <slot class="slot"></slot>
  </view>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default() {
        return "text";
      }
    },
    preIcon: {
      type: String
    },
    preText: {
      type: String
    },
    placeholder: {
      type: String
    },
    value: {
      type: String,
      required: true
    },
    preTextL: {
      type: String,
      default() {
        return `normal-width`;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      icons: {
        //注意这里的路径相对于是login的
        account: "../../static/login/zh.png",
        phone: "../../static/login/sjh.png",
        password: "../../static/login/mm.png",
        encode: "../../static/login/yzm.png"
      },
      valueN: this.value
    };
  },
  watch: {
    value(v) {
      this.valueN = v;
    }
  },
  mounted() {
    console.log(this.icons.account, 6666);
  },
  methods: {
    inputN(v) {
      this.$emit("input", v);
    }
  }
};
</script>
<style  lang='less'>
.input-item {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 25upx;
  margin-bottom: 68upx;
  position: relative;
  image {
    padding-top: 6upx;
    width: 30upx;
    height: 36upx;
    margin-right: 33upx;
    font-size: 28upx;
    color: #414141;
    flex-shrink: 0;
  }
  .input-pre {
    color: #414141;
    width: 128upx;
    text-align: left;
    font-size: 28upx;
  }
  .normal-width {
    flex-basis: 121upx;
    flex-shrink: 0;
  }
  .max-width {
    flex-basis: 171upx;
    flex-shrink: 0;
  }
  .input-i {
    height: 36upx;
    font-size: 28upx;
    color: #303133;
    flex: 1;
    background: none;
    outline: none;
    border: 0upx;
  }
  .slot {
    z-index: 66;
  }
}
</style>
