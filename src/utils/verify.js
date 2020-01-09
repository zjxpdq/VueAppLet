/**
 * 验证公司名称
 */
export const username = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入您的公司名称（营业执照上的全称）'))
  } else if (value.length < 6) {
    callback(new Error('公司名称不能少于6个字'))
  } else if (value.length > 30) {
    callback(new Error('公司名称不能大于30个字'))
  } else {
    callback()
  }
}
/**
 * 验证手机号码
 */
export const mobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'))
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
/**
 * 验证固定电话+手机号
 */
export const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('号码不可为空'))
  } else if (!/^[0-9\\-]{7,13}$/.test(value)) {
    callback(new Error('请输入正确的号码'))
  } else {
    callback()
  }
}

// 验证输入的金额 正整数 可两位小数 金额不能超过999999.99元
export const price = (rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error('此价格是必须的'))
  } else if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
    callback(new Error('请输入正整数，可以保留两位小数'))
  } else if (value < 1) {
    callback(new Error('金额不能低于1元'))
  } else if (!/^([1-9][\d]{0,5})(\.[\d]{1,2})?$/.test(value)) {
    callback(new Error('输入金额不能超过999999.99元'))
  } else {
    callback()
  }
}
// 验证价格在10-1000内
export const PRICE = (rule, value, callback) => {
  if (!value) {
    callback(new Error('价格是必须的'))
  } else if (!/^([1-9]\d{1,5}|1000)$/.test(value)) {
    callback(new Error('价格在10-1000内'))
  } else {
    callback()
  }
}
// 1-9.9 整数 或 1-9.9 保留 1 位小数
export const OneToNine = /^[1-9](\.\d{1})?$/

// 验证价格在1-9.9内
export const RATE = (rule, value, callback) => {
  if (!value && value !== 0) {
    callback(new Error('折扣是必须的'))
  } else if (!OneToNine.test(value)) {
    callback(new Error('请输入合理的折扣'))
  } else {
    callback()
  }
}

/**
 * 验证密码
 */
function Reg (value, rStr) {
  let reg = new RegExp(rStr)
  if (reg.test(value)) {
    return true
  }
}

export const password = (rule, value, callback) => {
  let Rc = {
    lW: '[a-z]', // 小写字母
    uW: '[A-Z]', // 大写字母
    nW: '[0-9]', // 数z
    sW: '[\\u0020-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E]' // 特殊字
  }
  let tR = {
    l: Reg(value, Rc.lW),
    u: Reg(value, Rc.uW),
    n: Reg(value, Rc.nW),
    s: Reg(value, Rc.sW)
  }
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  if (value.length < 8) {
    callback(new Error('密码长度8-20位'))
  }
  if (value.length > 20) {
    callback(new Error('密码长度8-20位'))
  }
  if (tR.l && tR.u || tR.l && tR.n || tR.l && tR.s || tR.u && tR.n || tR.u &&
    tR.s || tR.s && tR.n) {
    callback()
  } else {
    callback(new Error('字母/数字/符号至少两种'))
  }
}
