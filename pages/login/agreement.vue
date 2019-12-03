<template>
  <view class="content">
    <min-header title="用户协议"></min-header>
    <view class="load" v-if="load">
      <image :src="loadImg" />
      <text>加载中…</text>
    </view>
    <rich-text
      v-else
      class="richtext"
      :nodes="contentNodes"
      style="font-size: 14px;"
    ></rich-text>
  </view>
</template>

<script>
import minHeader from "../../components/min-header/index";
import htmlParser from "../../utils/html-parser.js";
export default {
  data() {
    return {
      title: "用户协议",
      content: "",
      contentNodes: [],
      load: true,
      loadImg: "../../static/login/loading.gif"
    };
  },
  components: {
    minHeader
  },
  onLoad() {
    var me = this;
    this.$Http
      .post({
        action: "login",
        app: "register_agreement"
      })
      .then(res => {
        if (res.content) {
          //吧view标签替换为html的P标签
          me.content =
            "<div style='padding-left:8px;padding-right:8px;'>" +
            res.content
              .replace(new RegExp("<view", "gm"), "<p")
              .replace(new RegExp("</view>", "gm"), "</p>") +
            "</div>";
          var htmlString = me.content
            .replace(/\\/g, "")
            .replace(/<img/g, '<img style="display:none;"');
          htmlString = htmlString.replace(
            "<div style='padding-left:8px;padding-right:8px;'>",
            '<div style="padding: 0 15px;">'
          );
          me.contentNodes = htmlParser(htmlString);
          this.load = false;
        }
      });
  },
  computed: {
    halfWidth() {
      var gru = this.$store.state.data_height;
      var heigh = parseInt(gru);
      var he = heigh * 2;
      return uni.upx2px(he) + "px";
    }
  }
};
</script>

<style scoped lang='less' scoped>
.content {
  height: 100vh;
  position: relative;
  .load {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 300upx;
    flex-wrap: wrap;
    align-content: flex-start;
    image {
      width: 80upx;
      height: 80upx;
    }
    text {
      flex-basis: 100%;
      text-align: center;
    }
  }
}
</style>