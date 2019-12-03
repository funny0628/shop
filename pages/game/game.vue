<template>
  <view> </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      wv: null
    };
  },
  computed: {
    ...mapState({
      webViewUrl: s => s.gameLink
    })
  },
  created() {
    plus.globalEvent.addEventListener("newintent", this.newintent);
  },
  onLoad() {
    // console.log(this.webViewUrl, "这是走入的链接");
    this.initWv();
  },
  mounted() {},
  methods: {
    ...mapActions(["unLinkGold"]),
    initWv() {
      this.wv = plus.webview.create(this.webViewUrl, "custom-webview", {
        plusrequire: "none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
        "uni-app": "none", //不加载uni-app渲染层框架，避免样式冲突
        background: "#000",
        popGesture: "none"
      });

      const currentWebview = this.$mp.page.$getAppWebview();
      currentWebview.setStyle({ popGesture: "none" });

      currentWebview.append(this.wv);

      this.wv.checkRenderedContent(
        {},
        success => {
          console.log(success, "vw加载完成了");
          this.addBackButton(currentWebview);
        },
        err => {
          console.log(err);
        }
      );
    },
    newintent(e) {
      const args = plus.runtime.arguments;
      if (args === "hbuilder://closeWebView") {
        this.unLinkGold();
        uni.navigateBack();
      }
    },
    addBackButton(currentWebview) {
      const backButton = new plus.nativeObj.View(
        "",
        {
          top: "30px",
          right: "16px",
          height: "50px",
          width: "50px"
        },
        [
          {
            tag: "img",
            id: "img",
            src: "/static/back.png",
            position: { width: "50px", height: "50px" }
          }
        ]
      );
      backButton.bitmap = new plus.nativeObj.Bitmap("BitImg");
      backButton.addEventListener(
        "click",
        () => {
          this.unLinkGold();
          uni.navigateBack();
        },
        false
      );
      currentWebview.append(backButton);
    }
  },
  destroyed() {
    plus.globalEvent.removeEventListener("newintent", this.newintent);
  }
};
</script>
