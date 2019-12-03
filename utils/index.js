export const msg = (title, complete = () => {}, duration = 1500, mask = true, icon = 'none') => {
  //统一提示方便全局修改
  if (Boolean(title) === false) {
    return;
  }
  //调用成功之后的回调

  setTimeout(() => {
    complete();
  }, duration);
  return uni.showToast({
    title,
    duration,
    mask,
    icon
  });
};

export const getElSize = query => {
  //得到元素的size
  return new Promise((res, rej) => {
    uni
      .createSelectorQuery()
      .select(query)
      .fields(
        {
          size: true,
          scrollOffset: true
        },
        data => {
          res(data);
        }
      )
      .exec();
  });
};

//这里得到登陆成功之后返回的操作.
//找到每一个路由  ,然后逐个查询不是login中的页面,返回到那一个页面
export const loginBack = () => {
  const specailRoutes = ['pages/user/user', 'pages/set/setPassword'];
  const routes = getCurrentPages().map(x => x.route);
  //从右往左找找到不包含 pages/login的route
  const index = routes.reverse().findIndex(x => x.indexOf('pages/login') === -1);
  console.log(index, routes, '当前的路由ß');
  if (index === -1 || specailRoutes.findIndex(x => x === routes[index]) !== -1) {
    uni.switchTab({ url: '/pages/user/user' });
  } else {
    //这里减2的原因是自己占了一个
    // const _index = routes.length - index - 2;
    // uni.navigateBack({ delta: _index });
    uni.navigateBack();
  }
};
