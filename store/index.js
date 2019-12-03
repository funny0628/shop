import Vue from 'vue';
import Vuex from 'vuex';
import Http from '@/api/request';
import { msg } from '../utils/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // hasLogin: false,
    // userInfo: {},
    test: false,

    // 确认订单去选地址
    selectAddress: {},
    // 逛逛菜单类型
    strollMenuType: 0,
    // 是否打开更新提示
    visibleUpdateTips: false,
    updateInfo: {}, // 版本更新信息
    withdrawInfo: {}, //提现的信息
    isShowLink: false,
    gameLink: ''
  },
  mutations: {
    setSelectAddress(state, payload) {
      state.selectAddress = payload;
    },
    setStrollType(state, payload) {
      state.strollMenuType = payload;
    },
    setVisibleUpdateTips(state, payload) {
      console.log(payload);
      state.visibleUpdateTips = payload;
    },
    setUpdateInfo(state, payload) {
      console.log(payload);
      state.updateInfo = payload;
    },
    setWithdrawInfo(state, payload) {
      state.withdrawInfo = payload;
    },
    setIsShowLink(state, payload) {
      state.isShowLink = payload;
    },
    setGameLink(state, payload) {
      state.gameLink = payload;
    }
    // login(state, provider) {
    // 	state.hasLogin = true;
    // 	state.userInfo = provider;
    // 	uni.setStorage({//缓存用户登录状态
    // 	    key: 'userInfo',
    // 	    data: provider
    // 	})
    // 	console.log(state.userInfo);
    // },
    // logout(state) {
    // 	state.hasLogin = false;
    // 	state.userInfo = {};
    // 	uni.removeStorage({
    //             key: 'userInfo'
    //         })
    // }
  },
  actions: {
    // 添加购物车
    addShopCart({}, payload) {
      payload = payload || {
        pro_id: 416,
        attribute_id: 1240,
        num: 1,
        type: 'addcart'
      };
      const token = uni.getStorageSync('token');
      Http.post('', {
        ...payload,
        module: 'app',
        action: 'product',
        app: 'add_cart',
        access_id: token
      }).then(res => {
        if (res.code === 200) {
          console.log(res);
        }
      });
    },
    goWithdraw({ commit }, payload) {
      const token = uni.getStorageSync('token');
      const body = {
        module: 'app',
        action: 'user',
        app: 'goWithdraw',
        access_id: token
      };
      return Http.post(body)
        .then(res => {
          commit('setWithdrawInfo', res.data);
        })
        .catch(error => {
          commit('setWithdrawInfo', {});
          msg(error);
        });
    },
    async getCode({}, payload) {
      try {
        uni.showLoading({
          title: '',
          mask: true
        });
        const res = await Http.post({
          action: 'user',
          app: 'secret_key',
          phone: payload.phone
        });

        uni.hideLoading();
        return res;
      } catch (error) {
        uni.hideLoading();
        msg(error || '短信请求有误');
      }

      return false;
    },
    async getUserInfo({}, payload) {
      return Http.post({
        action: 'user',
        app: 'index'
      });
    },
    // 获取游戏链接
    getGameLink({ commit }, payload) {
      const token = uni.getStorageSync('token');
      const body = {
        module: 'app',
        action: 'game',
        app: 'getUrl',
        access_id: token
      };
      return Http.post(body)
        .then(res => {
          console.log(res.data.gameUrl);
          commit('setGameLink', res.data.gameUrl);
        })
        .catch(error => {
          commit('setGameLink', '');
          msg(error);
        });
    },
    // 是否显示游戏链接
    getShowLink({ commit }, payload) {
      const token = uni.getStorageSync('token');
      const body = {
        module: 'app',
        action: 'game',
        app: 'getConfig',
        access_id: token
      };
      return Http.post(body)
        .then(res => {
          commit('setIsShowLink', Boolean(+res.status));
        })
        .catch(error => {
          msg(error);
        });
    },
    unLinkGold({ commit }, payload) {
      const token = uni.getStorageSync('token');
      if (!token) return;

      const body = {
        module: 'app',
        action: 'game',
        app: 'unLock',
        access_id: token
      };
      return Http.post(body)
        .then(res => {
          console.log('解锁金币的请求调用了', res);
        })
        .catch(error => {
          console.log(error, '出错了');
          msg(error);
        });
    }
  },
  getters: {
    visibleUpdateTips(state) {
      return state.visibleUpdateTips;
    },
    updateInfo(state) {
      return state.updateInfo;
    }
  }
});

export default store;
