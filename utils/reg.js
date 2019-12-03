const regs = {
  phone: /^1(3|4|5|6|7|8|9)\d{9}$/,
  user: /^[A-Za-z0-9]{6,16}$/, //6-16位数字或者字母
  password: /^[A-Za-z0-9]{6,16}$/, //6-16位数字或者字母
  withdraw: /^[0-9]{6}$/,
  bankCard: /^[1-9]{1}[0-9]{9,39}$/
};

export default (v, type) => {
  return regs[type].test(v);
};
