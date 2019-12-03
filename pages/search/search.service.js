import Http from '@/api/request.js';
export default {
  // 模糊搜索关键词
  async searchKeyword(keyword) {
    return await Http.post({
      action: 'search',
      app: 'input_search',
      type: 0,
      keyword
    });
  },
  //  搜索
  async search(keyword, num = 1) {
    return await Http.post({
      // 当前页数
      num,
      action: 'search',
      app: 'search',
      type: 0,
      // 关键词
      keyword
    });
  },
  // 热门搜索
  async hotSearch() {
    return await Http.post({
      action: 'search',
      app: 'hot_search',
      type: 0
    });
  },
  // 历史搜索
  historySearch: {
    save(keyword) {
      // 存入历史搜索列表
      const historyList = uni.getStorageSync('historyList')
        ? uni.getStorageSync('historyList').split(',')
        : [];
      const index = historyList.indexOf(keyword);
      // 存在先删除
      if (index > -1) {
        historyList.splice(index, 1);
      }
      // 添加到最前面
      historyList.unshift(keyword);
      // 大于10条删除最后一条
      if (historyList.length > 10) {
        historyList.pop();
      }
      uni.setStorageSync('historyList', historyList.toString());
      return historyList;
    },
    clear() {
      uni.removeStorageSync('historyList');
      return [];
    }
  }
};
