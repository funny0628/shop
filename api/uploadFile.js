//这里暂时只做单张上传,如果多张,是每次选择一张
//
import { msg } from '@/utils/index.js';
import config from './config';

const upload = options => {
  console.log('既然怒s');
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      // url: 'http://10.99.50.40:800/index.php?store_id=1&store_type=2',
      // url: 'http://47.56.126.222/index.php?store_id=1&store_type=2',
      success(res) {
        uni.uploadFile({
          url: `${config.baseUrl}${config.commonUrl}`,
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            access_id: uni.getStorageSync('token'),
            src_img: res.tempFilePaths[0],
            module: 'app',
            ...options
          },
          success(uploadFileRes) {
            const data = JSON.parse(uploadFileRes.data);
            console.log(data);
            const { code, message } = data;
            if (code === 200) {
              msg('上传成功');
              resolve(data);
            } else {
              msg(message || '上传失败,请重新上传');
              reject(data);
            }
          },
          fail() {
            msg('上传失败,网络异常，请稍后上传');
          }
        });
      }
    });
  });
};

export default upload;
