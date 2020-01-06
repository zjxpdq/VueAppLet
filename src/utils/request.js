import Store from '../store/index'
import httpRequest from './config.js'

const host = httpRequest.url

function _showErr () {
  wx.showToast({
    title: '出现了一个错误,稍后再试~~',
    icon: 'none',
    duration: 20000
  })
}

function request (url, method, data/*, header = {} */) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': Store.state.SUCCESS_TOKEN !== '' ? 'Bearer' + ' ' +
          Store.state.SUCCESS_TOKEN : ''
      },
      success: function (res) {
        wx.hideLoading()
        const code = res.statusCode.toString()
        if (code.startsWith('2')) {
          resolve(res.data)
        } else {
          reject()
          _showErr()
        }
      },
      fail: err => {
        wx.hideLoading()
        reject()
        _showErr()
        console.log(err)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  })
}

export function getRequest (obj) {
  return request(obj.url, 'GET', obj.data)
}

export function postRequest (obj) {
  return request(obj.url, 'POST', obj.data)
}
