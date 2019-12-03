
<script>
import config from "@/api/config";
import { mapMutations, mapActions } from "vuex";
export default {
  onLaunch: function() {
    console.log("App Launch");
    // #ifdef APP-PLUS
    this.widgetinfo();
    this.unLinkGold();
    // #endif
  },
  onShow: function() {
    console.log("App Show");
    // console.log(plus.runtime.appid, "plus.runtime.appid 1");
  },
  onHide: function() {
    console.log("App Hide");
  },
  onLoad() {
    console.log("走了APP");
  },
  onReady() {
    console.log("mounted");
  },
  methods: {
    ...mapMutations(["setVisibleUpdateTips", "setUpdateInfo"]),
    ...mapActions(["unLinkGold"]),
    widgetinfo() {
      // var me = this;
      plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
        console.log(widgetInfo.version, widgetInfo.name, "widgetInfo");
        this.$Http
          .get(
            {
              version: widgetInfo.version,
              name: widgetInfo.name
            },
            {},
            config.checkoutHotUrl
          )
          .then(res => {
            console.log(res, "res");
            this.updateInfo = res;
            if (res.status === 1) {
              const platform = uni.getSystemInfoSync().platform;
              const curVersion = widgetInfo.version.split(".");
              // this.curVersion = widgetInfo.version.split(".");
              // const curVersion = "0.0.0";
              const hotVersion = res.version.split(".");
              // this.hotVersion = res.version.split(".");
              // const wgtUrl = res[`${platform}_url`];
              const wgtUrl = res[`${platform}_url`];

              // 是否大版本
              const isBigVersion = curVersion[0] !== hotVersion[0];

              // 打开更新提示
              // this.openUpdate(); // 这个没用了

              // 这里有设置数据就会弹窗
              this.setUpdateInfo({
                url: wgtUrl,
                isBigVersion: isBigVersion,
                source_url: res.source_url
              });
              console.log("我弹窗了");

              if (platform === "ios") {
              } else if (platform === "android") {
              }
            }
          })
          .catch(err => {
            console.error(err, "err");
          }); // 1.0.0  2.0. 1
      });
    },
    openUpdate() {
      //
      this.setVisibleUpdateTips(true);
    }
  }
};
</script>
<style lang="less">
// @import url("./iconfont.css");
/*每个页面公共css */
view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
  box-sizing: border-box;
}
page {
  height: 100%;
}
// .mask {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background-color: #ccc;
//   opacity: 0.5;
//   z-index: 99;
// }
/*边框*/
.b-b:after,
.b-t:after {
  position: absolute;
  z-index: 3;
  left: 0;
  right: 0;
  height: 0;
  content: "";
  transform: scaleY(0.5);
  border-bottom: 1px solid #e4e7ed;
}

.b-b:after {
  bottom: 0;
}

.b-t:after {
  top: 0;
}

/* button样式改写 */
uni-button,
button {
  &.no-border:before,
  &.no-border:after {
    border: 0;
  }
}
/* 图片载入替代方案 */
.image-wrapper {
  font-size: 0;
  background: #f3f3f3;
  border-radius: 4px;

  image {
    width: 100%;
    height: 100%;
    transition: 0.6s;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }
}
// mescroll 外层高度
.mescroll-wrap {
  height: calc(100% - (var(--status-bar-height) + 88upx));
}

.clamp {
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
