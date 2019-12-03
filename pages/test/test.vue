<template>
  <view>
    <!-- <web-view></web-view> -->
    <!-- <web-view></web-view> -->
    正在加载页面
  </view>
</template>

<script>
export default {
  data() {
    return {
      webViewUrl: "https://l1.245256.cn/html/static/h5/MTGAME23/index.html?openid=49293fd63a5e0d3e375fecf27246ba37&lang=ZH_CN"
    };
  },
  created() {
    // plus.globalEvent.addEventListener("plusready", this.plusready);
    plus.globalEvent.addEventListener("newintent", this.newintent);
  },
  onLoad() {
       const  wv = plus.webview.create(this.webViewUrl,"custom-webview",{
            plusrequire:"none", //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
            'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
            background:'#000',
            popGesture:'none',
            //  progress: { //WebviewProgressStyles类型,标题栏控件的进度条样式.设置此属性则在标题栏控件的底部显示进度条,可配置进度条颜色值即高度.设置此属性值为                undefined或null则隐藏进度条.默认不显示底部进度条.  
            //     color: '#FF0000', //String类型,进度条颜色.可取值:"#RRGGBB"格式字符串,如"#FF0000"表示绘制红色分割线;"rgba(R,G,B,A)",其中R/G/B分别代表红色值/绿色值/蓝色值,正整数类型,取值范围为0-255,A为透明度,浮点数类型,取值范围为0-1(0为全透明,1为不透明),如"rgba(255,0,0,0.5)",表示红色半透明.默认值为"#00FF00".  
            //     height: '100px', //String类型,进度条高度.可取值:像素值(逻辑像素),支持小数点,如"1px"表示1像素高;百分比,如"1%",相对于标题栏控件的高度.默认值为"2px".  
            // }, 
        })
        wv.setStyle({popGesture:"none",opacity:0.3 });
        wv.setStyle({popGesture:"none",opacity:1 });
        // wv.setStyle({opacity:1});
        // const currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
        // currentWebview.setStyle({popGesture:"none"})
        // currentWebview.append(wv);//一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
        // currentWebview.hide();
        // setTimeout(()=>{
        //   wv.setStyle({opacity:1})
        // },5000)
        // console.log(8888888888,currentWebview);
         wv.onloaded = (e)=>{
          console.log('loaded加载完毕',new Date().getTime());
          // 
        };
        console.log('开始加载',new Date().getTime());
        const currentWebview = this.$mp.page.$getAppWebview()
        // currentWebview.setStyle({opacity:0})
        currentWebview.append(wv);
        // currentWebview.setStyle({opacity:0})
    },
  mounted(){
    // this.titleNViewWebview();
  },
  methods: {
  //   plusready() {
  //     console.log("plusready-------------------------plusready");
  //   },
  //   newintent(e) {
  //     var args = plus.runtime.arguments;
  //     if (args === "haitao://closeWebView") {
  //       uni.navigateBack();
  //     }
  //     console.log("newintent-------------------------newintent", args);
  //   },
  //  titleNViewWebview() {
  //    console.log(plus.webview.create,999999)
  //     const webview = plus.webview.create(this.webViewUrl, 
  //      'test', {'titleNView':{'backgroundColor':'#000',autoBackButton:false}});
  //     webview.addEventListener('close', function(){
  //       webview=null;
  //     });
  //     webview.addEventListener('titleUpdate', function(){
  //       webview.show();
  //     });
  //   }
  // },
  // destroyed() {
  //   // plus.globalEvent.removeEventListener("plusready", this.plusready);
  //   plus.globalEvent.removeEventListener("newintent", this.newintent);
  // }
  }
};
</script>
