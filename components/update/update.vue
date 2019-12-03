<template>
  <view class="pop">
      <image class="bigPic" src="../../static/update/pop.png" v-if="poppic"></image>
      <image class="progress" src="../../static/update/progress.png" v-else></image>
      <text class="download" v-if="!poppic">{{ downloadtip }}</text>
      <template slot-scope="" v-if="updateData.updateBigVersion===update[0]">
            <text class="find">{{find[0]}}</text>
            <text class="fast">{{fast[0]}}</text>
            <text class="update" @tap="sonEvent">{{ update[0] }}</text>
      </template>
      <template slot-scope="" v-if="updateData.downloadSmallVersion===update[1]">
            <text  class="find">{{find[1]}}</text>
            <text class="fast">{{fast[1]}}</text>
            <text class="update" @tap="sonEvent">{{ update[1] }}</text>
      </template>
      <!-- <text v-if="updateData.updateBigVersion===update[0]" class="find">{{find[0]}}</text>
      <text v-if="updateData.downloadSmallVersion===update[1]" class="find">{{find[1]}}</text>
      <text v-if="updateData.updateBigVersion===update[0]" class="fast">{{fast[0]}}</text>
      <text v-if="updateData.downloadSmallVersion===update[1]" class="fast">{{fast[1]}}</text>
      <text v-if="updateData.updateBigVersion===update[0]" class="update" @tap="sonEvent">{{ update[0] }}</text>
      <text v-if="updateData.downloadSmallVersion===update[1]" class="update" @tap="sonEvent">{{ update[1] }}</text> -->
  </view>
</template>
<script>
export default {
    props: {
        updateData: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            find: ['发现新的版本','发现更新内容'],
            fast: ['有新的版本，是否立即更新？','发现更新内容，是否立即下载?'],
            update: ['立即更新','立即下载'],
            poppic: true,
            downloadtip: '正在下载,请稍后......',
      }
    },
    methods: {
        sonEvent() {
           this.poppic = false
           this.find = ''
           this.fast = ''
           this.$emit('handle',this.update) 
           this.update = []
       }
    }
}
</script>
<style scoped lang="less">

.pop {
    width: 550upx;
    height: 698upx;
    margin: 234upx 105upx 690upx 95upx;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    position: fixed;
    z-index: 10000000000000000000000000;
    .bigPic { 
        width: 100%;      
        height: 100%;
        border-radius: 10upx;
        display: block;
    } 
    .progress {
        width: 500upx;
        height: 40upx;
        border-radius: 16upx;
        margin-top: 400upx;
        margin-left: 50%;
        transform: translateX(-50%);
    }
    .download {
        display: block;
        font-size: 40upx;
        color: #ffffff;
        text-align: center;
        margin-top: 20upx;
    }
    .find {
        position: absolute;
        top: 200upx;
        left: 30upx;
        color: #ffffff;
        font-size: 40upx;
    }
    .fast {
        position: absolute;
        top: 450upx;
        left: 60upx;
        font-size: 32upx;
    }
    .update {
        position: absolute;
        bottom: 60upx;
        left: 206upx;
        color: #ffffff;
    }
}

</style>