import { msg } from '@/utils/index.js';
import config from './config';
const toLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};
const request = (data, header, method = 'post', url = config.commonUrl) => {
  // console.log(`${config.baseUrl}${url}`, '--------url');
  return new Promise((resolve, reject) => {
    uni.request({
      // url: 'http://10.99.50.134:8000/index.php?store_id=1&store_type=2',
      // url: 'http://10.99.50.40:800/index.php?store_id=1&store_type=2',
      // url: 'http://47.56.126.222/index.php?store_id=1&store_type=2',
      // url: 'http://47.56.126.222:8099/index.php?store_id=1&store_type=2',
      // url: 'http://47.89.33.253/index.php?store_id=1&store_type=2',
      // url: 'http://10.99.50.48/index.php?store_id=1&store_type=2',
      url: `${config.baseUrl}${url}`,
      data: {
        module: 'app',
        access_id: uni.getStorageSync('token'),
        ...data
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        ...header
      },
      method,
      success(res) {
        console.log(res, '--------------------------------res')
        if (res.data.code === 404 || res.data.code === 401) {
          uni.removeStorageSync('token');
          toLogin();
          return false;
        }
        if (res.data.code !== 200) {
          reject(res.data.message);
          return false;
        }
        resolve(res.data);
      },
      fail(e) {
        reject(e);
      }
    });
  });
};

const Http = {
  async get(data, header = {}, url) {
    return await request(data, header, 'get', url);
  },
  async post(data, header = {}) {
    return await request(data, header);
  }
};

export default Http;
