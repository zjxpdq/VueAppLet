export function Toast (text, type) {
  wx.showToast({
    title: text,
    icon: type || 'none',
    duration: 2000
  })
}
