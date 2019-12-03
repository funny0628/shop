<template>
  <view class="message">
    <StatusBarHeader title="消息" :back="true" @goback="back" />
    <template>
      <view class="content" v-show="messageList && messageList.length > 0">
        <view class="message-total">
          <view class="text">
            共有
            <text>{{ total }}</text>
            条信息,有
            <text>{{ noread }}</text>
            条未读
          </view>
          <view class="btn">
            <text @tap="readAll" v-if="noread > 0">一键已读</text>
            <text @tap="edit">{{ editState ? "完成" : "编辑" }}</text>
          </view>
        </view>
        <view class="mescroll-wrap">
          <mescroll-uni
            ref="mescroll"
            :fixed="false"
            :down="downOption"
            :up="upOption"
            @up="loadMore"
          >
            <view
              class="message-list"
              v-for="(item, i) in messageList"
              :key="i"
            >
              <view class="edit-area" v-if="editState">
                <image
                  src="../../static/message/selected.png"
                  @tap="toggleSelect(item, i)"
                  v-if="item.selected"
                />
                <image
                  src="../../static/message/unselected.png"
                  @tap="toggleSelect(item, i)"
                  v-else
                />
              </view>
              <view>
                <view class="date">{{ item.time }}</view>
                <view class="list-item" @tap="detail(item.id)">
                  <view class="title"
                    >{{ item.title }}
                    <text v-if="item.type === '1'">new</text>
                  </view>
                  <view class="text">{{ item.content }}</view>
                  <view class="btn">查看详情</view>
                </view>
              </view>
            </view>
          </mescroll-uni>
        </view>
      </view>
      <view class="btn-area" v-if="editState">
        <view class="all-checked" @tap="selectAll">
          <image src="../../static/message/selected.png" v-if="allSelected" />
          <image src="../../static/message/unselected.png" v-else />
          全选
        </view>
        <view class="del-btn" @tap="del">删除</view>
      </view>
    </template>
    <template v-if="messageList && messageList.length === 0">
      <empty content="暂无消息～" />
    </template>
  </view>
</template>
<script>
import msgService from "./message.service";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
import StatusBarHeader from "@/components/status-bar-header/status-bar-header";
import empty from "@/components/empty/empty.vue";
export default {
  name: "message",
  components: {
    MescrollUni,
    StatusBarHeader,
    empty
  },
  data() {
    return {
      downOption: {
        use: false
      },
      upOption: {
        auto: false,
        empty: {
          use: false
        },
        textNoMore: "没有更多消息了～"
      },
      // 编辑状态
      editState: false,
      // 消息列表
      messageList: null,
      // 消息总数
      total: 0,
      // 未读消息
      noread: 0
    };
  },
  computed: {
    // 是否全选
    allSelected() {
      return this.messageList && this.messageList.every(item => item.selected);
    }
  },
  mounted() {
    this.$refs.mescroll.mescroll.resetUpScroll();
  },
  methods: {
    // 提示框
    showToast(title) {
      uni.showToast({
        title,
        mask: true,
        duration: 500
      });
    },
    // 消息详情
    detail(id) {
      this.editState && (this.editState = false);
      uni.navigateTo({
        url: `/pages/message/message-detail?id=${id}`
      });
    },
    // 选择全部
    selectAll(type) {
      const state = type === "init" ? false : !this.allSelected;
      this.messageList.map((_, i) => {
        this.$set(this.messageList[i], "selected", state);
      });
    },
    // 编辑状态
    edit() {
      this.editState = !this.editState;
      this.selectAll("init");
    },
    del() {
      const list = [];
      this.messageList.map(item => {
        item.selected && list.push(item.id);
      });
      list.length && this.deleteMsg(list.toString());
    },
    back() {
      const pages = getCurrentPages();
      const prev = pages[pages.length - 2];
      prev &&
        prev.route &&
        uni.switchTab({
          url: `/${prev.route}`
        });
    },
    // 加载更多
    loadMore(mescroll) {
      const { num, size } = mescroll;
      this.getMsgList(num);
    },
    // 切换选择状态
    toggleSelect(item, i) {
      this.$set(this.messageList[i], "selected", !item.selected);
    },
    // 添加选择状态
    formatSelectStatus(list) {
      list.forEach(item => {
        item.selected = false;
      });
    },
    // 获取消息列表
    getMsgList(num) {
      msgService
        .get(num)
        .then(res => {
          this.formatSelectStatus(res.message);
          if (num === 1) {
            this.messageList = res.message;
          } else {
            this.messageList.push(...res.message);
          }
          this.total = res.total;
          this.noread = res.noread;
          this.$refs.mescroll.mescroll.endBySize(
            res.message.length,
            Number(res.total)
          );
        })
        .catch(() => {
          this.messageList = [];
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
        });
    },
    // 删除消息
    deleteMsg(id) {
      msgService
        .delete(id)
        .then(res => {
          this.showToast("删除成功");
          this.edit();
          this.$refs.mescroll.mescroll.resetUpScroll();
        })
        .catch(() => {
          this.showToast("删除失败");
          this.edit();
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
        });
    },
    // 读取全部消息
    readAll() {
      msgService
        .readAll()
        .then(res => {
          this.showToast("读取成功");
          this.$refs.mescroll.mescroll.resetUpScroll();
        })
        .catch(() => {
          this.showToast("读取失败");
          this.$refs.mescroll.mescroll.endErr &&
            this.$refs.mescroll.mescroll.endErr();
        });
    }
  }
};
</script>
<style lang="less">
@import url("./message");
</style>