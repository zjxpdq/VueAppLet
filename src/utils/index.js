export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export const forEachs = (arr, fn) => {
  if (!arr.length || !fn) {
    return
  }
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * 深拷贝
 * @param obj
 * @return
 */
export const deepClone = obj => {
  let _obj = JSON.stringify(obj)
  return JSON.parse(_obj)
}

/**
 * 计算折扣后的价格
 * @param price 原价
 * @param rate 折扣率
 */
export const countRate = (price, rate) => {
  if (price && rate && rate < 10 && rate > 0) {
    let r = rate / 10
    return MONEY(price * r)
  } else {
    return '0.00'
  }
}

/**
 * 金额转换
 * @param money 需要转换的金额
 * @returns {string} 返回转换后的金额
 */
export const MONEY = money => {
  if (isNaN(parseFloat(money))) {
    return '0.00'
  }
  let f = Math.round(money * 100) / 100
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

export const isNumber = number => {
  if (!isNaN(parseFloat(number))) {
    return parseFloat(number)
  } else {
    return null
  }
}
