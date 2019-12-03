<template>
  <view class="set-info">
    <min-header title="个人资料"></min-header>
    <view class="content-wrap">
      <list-cell
        title="头像"
        border="b-b b-b-a"
        textSize="30upx"
        iconColor="#afafaf"
        textColor="#414141"
        class="list-avatar"
        @eventClick="editAvatar"
      >
        <image class="avatar" :src="avatar"></image>
      </list-cell>
      <list-cell
        title="昵称"
        border="b-b b-b-a"
        textSize="30upx"
        iconColor="#afafaf"
        textColor="#414141"
        class="list-avatar"
        @eventClick="editUsername"
      >
        <text class="username">{{ username }}</text>
      </list-cell>
    </view>
    <uni-popup ref="popup" custom type="center">
      <view class="pop-wrap">
        <view class="input-wrap">
          <input
            type="text"
            placeholder-style="color: #999999;"
            :maxlength="20"
            v-model="editUser"
            placeholder="输入新昵称"
          />
        </view>
        <view class="border"></view>
        <view class="button-list">
          <view class="cancel" @tap="cancelUsername">取消</view>
          <view class="submit" @tap="handleUsername">确认</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import listCell from "@/components/mix-list-cell";
import minHeader from "@/components/min-header";
import upload from "../../api/uploadFile";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import { mapActions } from "vuex";
export default {
  components: { minHeader, listCell, uniPopup },
  data() {
    return { avatar: "", username: "", editUser: "", mobile: "" };
  },
  onLoad() {
    this.getInfo();
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    getInfo() {
      this.getUserInfo()
        .then(res => {
          this.avatar = res.data.user.headimgurl;
          this.username = res.data.user.user_name;
          this.editUser = this.username;
          this.mobile = res.data.user.mobile || "";
        })
        .catch(err => {
          this.$shwoMsg(err || "");
        });
    },
    editAvatar() {
      var me = this;
      upload({ action: "user", app: "set_user" }).then(res => {
        this.getInfo();
      });
    },
    editUsername() {
      this.editUser = this.username;
      this.$refs.popup.open();
    },
    cancelUsername() {
      this.$refs.popup.close();
    },
    handleUsername() {
      const body = {
        action: "user",
        app: "set_user",
        Nickname: this.editUser
      };
      this.$Http
        .post(body)
        .then(res => {
          this.getInfo();
          this.$showMsg("设置昵称成功");
          this.$refs.popup.close();
        })
        .catch(e => {
          this.$showMsg(e || "");
        });
    }
  }
};
</script>
<style scoped lang='less'>
.page,
.set-info {
  height: 100%;
  background: #f6f6f6;
  // /deep/ .uni-popup__wrapper-box {
  //   transform: translateY(-120upx);
  // }
  // /deep/ .wx-popup__wrapper-box {
  //   transform: translateY(-120upx);
  // }
  .pop-wrap {
    width: 660upx;
    height: 300upx;
    background-color: #ffffff;
    border-radius: 10upx;
    display: flex;
    flex-direction: column;
    .input-wrap {
      height: 138upx;
      display: flex;
      justify-content: center;
      input {
        margin: 71upx auto 41upx;
        text-align: center;
      }
    }
    .border {
      width: 600upx;
      height: 2upx;
      background: #e5e5e5;
      margin: 0 auto;
    }
    .button-list {
      flex: 1;
      display: flex;
      padding: 50upx 60upx 0;
      justify-content: space-between;
      view {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cancel {
        width: 200upx;
        height: 80upx;
        border-radius: 40upx;
        border: solid 2upx #818181;
        font-size: 30upx;
        letter-spacing: 2upx;
        color: #818181;
      }
      .submit {
        width: 200upx;
        height: 80upx;
        background-image: linear-gradient(145deg, #f78c87 0%, #ec597c 100%),
          linear-gradient(#000000, #000000);
        border-radius: 40upx;
        opacity: 0.9;
        font-size: 30upx;
        line-height: 88upx;
        letter-spacing: 1upx;
        color: #ffffff;
      }
    }
  }
}
.content-wrap {
  margin: 30upx auto 0;
  width: 690upx;
  background-color: #fff;
  border-radius: 10upx;
  .list-avatar {
    position: relative;
    .avatar {
      width: 120upx;
      height: 120upx;
      border-radius: 50%;
      margin-right: 20upx;
    }
    .username {
      font-size: 28upx;
      color: #818181;
      margin-right: 20upx;
    }
  }
}
</style>
