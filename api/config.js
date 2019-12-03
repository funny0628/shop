const config = {
  test: {
    // baseUrl: 'http://47.89.33.253/',
    baseUrl: 'http://47.56.126.222:8099/',
    commonUrl: 'index.php?store_id=1&store_type=2', // 一般请求用这个
    checkoutHotUrl: 'widgetinfo/update.php?store_id=1' // 这个是检查热更新的url
  }
};

export default config['test'];
