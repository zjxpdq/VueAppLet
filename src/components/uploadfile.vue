﻿
<template>
  <div class="uploadWrap" @click="uploadImg"></div>
</template>

<script>
  import httpRequest from '../utils/config.js'

  export default {
    props: {
      type: Number,
      init: Boolean,
      config: {
        type: Object,
        default () {
          return {
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera']
          }
        }
      }
    },

    methods: {
      uploadImg() {
        let that = this;
        let success_token = '';
        this.getRequest({
          url: '/appequity/jinjian/token',
          data: {}
        }).then(res => {
          if (res.status === 200) {
            success_token = JSON.parse(res.t).access_token;
            const config = {
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success: function (resc) {
                // console.log(res)
                const resfile = resc.tempFiles[0].path
                const url1 = `${httpRequest.url}/appequity/jinjian/ocr/${that.type}?accessTokens=${success_token}`
                const url2 = `${httpRequest.url}/appequity/jinjian/wxUpload`
                wx.showLoading()
                wx.uploadFile({
                  url: !that.init ? url1 : url2,
                  filePath: resfile,
                  name: 'file',
                  success (ress) {
                    const data = JSON.parse(ress.data)
                    console.log(data)
                    if (data.status === 200) {
                      that.$emit('click', data.t)
                      let msg = ''
                      try {
                        msg = data.t.t.errmsg || data.msg
                      } catch (e) {
                        msg = data.msg
                        console.log(e)
                      }
                      wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                      })
                      // that.Toast(data.msg, 'success');
                    } else {
                      // that.Toast('上传失败~~  请稍后再试!');
                      wx.showToast({
                        title: data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            }
            Object.assign(config, that.config)
            wx.chooseImage(config)
          }
        })
      }
    }
  }

</script>

<style lang="less" scoped>
  .uploadWrap {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

    &::before {
      content: '';
      position: absolute;
      top: -54rpx;
      left: 0;
      width: 100%;
      height: 28rpx;
    }
  }
</style>
