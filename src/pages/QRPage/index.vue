<template>
  <div class="lv_qr_page">
    <div class="lv_center">
      <div class="lv_tab_box">
        <div :class="['lv_tab', {'lv_pitch_on': tab === '0'}]" @click="tab = '0'">图文收款码</div>
        <div :class="['lv_tab', {'lv_pitch_on': tab === '1'}]" @click="tab = '1'">仅收款码</div>
      </div>
      <!--{{newQrImg}}-->
      <div class="lv_qr_box">
        <div :class="['lv_image_text', {'lv_pitch_on': tab === '0'}]">
          <div class="lv_img_box">
            <img :src="newQrImg" mode="aspectFill">
            <!--<canvas
              canvas-id="qrCanvas"
              style="width: 100%; height: 100%;"
              type="2d"
              id="qrCanvas"
            ></canvas>-->
          </div>
          <!-- <div class="lv_f_tab">
             <span></span>
             <span></span>
             <span></span>
           </div> -->
        </div>
        <div :class="['lv_qr', {'lv_pitch_on': tab === '1'}]">
          <img :src="qrUrl" mode="widthFix">
        </div>
      </div>
      <div class="lv_f_text">*当权益审核通过后，权益即可上架使用</div>
      <button class="lv_f_btn" @click="saveQrCode(qrUrl)">保存到手机</button>
    </div>

    <div class="lv_canvas" :style="{width: bigImg.width + 'px', height: bigImg.height + 'px'}">
      <canvas
        :style="{width: bigImg.width + 'px', height: bigImg.height + 'px'}"
        canvas-id="firstCanvas"
      ></canvas>
    </div>
    <!-- <div class="lv_canvas" style="width: 1299px; height: 1713px;">
       <canvas
         style="width: 1299px; height: 1713px;"
         canvas-id="firstCanvas"
         type="2d"
         id="downQr"
       ></canvas>
     </div>-->

  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        tab: '0',
        qrUrl: '', // 二维码
        shopId: '',
        bigImg: {},
        qrImg: {},
        newQrImg: null
      }
    },
    onLoad () {
      wx.showLoading({
        title: '加载中...'
      })
      this.squareCode()
      wx.getStorage({
        key: 'USER_MSG',
        success: (res) => {
          let data = res.data
          this.shopId = data.userId
          this.squareCode(data.userId)
        }
      })
    },
    methods: {
      squareCode (id) {
        let params = {
          'shopId': id
        }
        this.getRequest({
          url: '/appequity/qrcode/squareCode',
          data: params
        }).then(res => {
          if (res.status === 200) {
            this.qrUrl = res.t
            console.log(res.t)
            // this.downloadImg(res.t)
            this.getCanvasImg()
          }
        })
      }, // 获取二维码
      saveQrCode () {
        let that = this
        wx.getSetting({
          success () {
            wx.showLoading({
              title: '图片下载中...'
            })
            switch (that.tab) {
              case '0':
                wx.saveImageToPhotosAlbum({
                  filePath: that.newQrImg,
                  success: function () {
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存成功',
                      icon: 'success',
                      duration: 2000
                    })
                  },
                  fail: function (err) {
                    wx.hideLoading()
                    wx.showToast({
                      title: '保存失败',
                      icon: 'error',
                      duration: 2000
                    })
                    console.log(err)
                  }
                })
                break
              case '1':
                wx.downloadFile({
                  url: that.qrUrl,
                  success: function (res) {
                    wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: function () {
                        wx.hideLoading()
                        wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 2000
                        })
                      },
                      fail: function (err) {
                        console.log(err)
                      },
                      complete () {
                        wx.hideLoading()
                      }
                    })
                  },
                  fail: function () {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'error',
                      duration: 2000
                    })
                  }
                })
                break
            }
          }
        })
      }, // 保存纯二维码
      getCanvasImg () {
        let that = this
        wx.getImageInfo({
          src: 'https://oss-zonda-lyb.oss-cn-shenzhen.aliyuncs.com/min/QR_code.png',
          success (res) {
            let bg = {
              width: res.width,
              height: res.height,
              path: res.path
            }
            that.bigImg = bg
            wx.getImageInfo({
              src: that.qrUrl,
              success (child) {
                let qr = {
                  width: child.width,
                  height: child.height,
                  path: child.path
                }
                that.qrImg = qr
                that.setCanvas(bg, qr)
              }
            })
          },
          complete () {
          }
        })
      },
      setCanvas (bg, qr) {
        let that = this
        let ctx = wx.createCanvasContext('firstCanvas')
        ctx.drawImage(bg.path, 0, 0, bg.width, bg.height)
        ctx.drawImage(qr.path, 304, 390, 688, 688)
        ctx.draw()
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          canvasId: 'firstCanvas',
          success (res) {
            that.newQrImg = res.tempFilePath
            wx.hideLoading()
          },
          fail (err) {
            console.log(err)
            wx.hideLoading()
          }
        })
      }
      /*,
      downloadImg (qrUrl) {
        let that = this
        const query = wx.createSelectorQuery()
        query.select('#downQr').fields({ node: true, size: true }).exec((res) => {
          const canvas = res[0].node
          canvas.width = res[0].width
          canvas.height = res[0].height
          const can = canvas.getContext('2d')
          let img = canvas.createImage()
          let img2 = canvas.createImage()
          img2.src = qrUrl
          img.onload = () => {
            can.drawImage(img, 0, 0, res[0].width, res[0].height)
            can.drawImage(img2, 304, 390, 688, 688)

            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              canvas: canvas,
              fileType: 'png',
              quality: 1,
              success (cc) {
                that.newQrImg = cc.tempFilePath
                wx.hideLoading()
              },
              fail (err) {
                console.log(err)
                wx.hideLoading()
              }
            })
          }
          img.src = 'https://oss-zonda-lyb.oss-cn-shenzhen.aliyuncs.com/min/QR_code.png'
        })
      } */
    },
    components: {},
    mounted () {
    },
    computed: {}
  }
</script>

<style scoped lang="less">
  .lv_qr_page {
    min-height: 100vh;
    background: #118CFD;
    padding: unit(30, rpx) unit(32, rpx);
    box-sizing: border-box;

    .lv_center {
      width: 100%;
      background: #fff;
      border-radius: unit(8, rpx);
      padding-bottom: unit(40, rpx);
      min-height: unit(1142, rpx);

      .lv_tab_box {
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-bottom: unit(2, rpx) solid #E8E8E8;

        .lv_tab {
          height: unit(88, rpx);
          line-height: unit(88, rpx);
          color: #333;
          font-size: unit(28, rpx);
          font-weight: bold;
          transition: color .3s;
          position: relative;

          &::after {
            content: '';
            height: unit(2, rpx);
            width: unit(80, rpx);
            display: inline-block;
            background: transparent;
            position: absolute;
            bottom: unit(-1, rpx);
            left: calc(50% - 40rpx);
            transition: background .3s;
          }

          &.lv_pitch_on {
            color: #118CFD;

            &::after {
              background: #118CFD;
            }
          }
        }
      }

      .lv_qr_box {
        height: unit(867, rpx);
        margin: unit(32, rpx) unit(32, rpx) 0;
        box-sizing: border-box;
        position: relative;

        .lv_image_text {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity .3s;

          .lv_img_box {
            width: unit(622, rpx);
            height: unit(771, rpx);
            border: 1px solid #E8E8E8;

            img {
              width: unit(622, rpx);
              height: unit(771, rpx);
            }
          }

          .lv_f_tab {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: unit(24, rpx);

            span {
              height: unit(16, rpx);
              width: unit(16, rpx);
              background: #E8F4FF;
              border-radius: 50%;
              margin: 0 unit(8, rpx);
            }
          }
        }

        .lv_qr {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          margin-top: unit(88, rpx);
          display: flex;
          justify-content: center;
          transition: opacity .3s;

          img {
            width: unit(560, rpx);
            min-height: unit(560, rpx);
            border: 1px solid #E8E8E8;
          }
        }

        .lv_pitch_on {
          opacity: 1;
          z-index: 2;
        }
      }

      .lv_f_text {
        text-align: center;
        color: #999;
        font-size: unit(24, rpx);
      }

      .lv_f_btn {
        margin: unit(32, rpx);
        background: #118CFD;
        border: none;
        color: #fff;
        font-size: unit(28, rpx);
        height: unit(88, rpx);
        line-height: unit(88, rpx);
      }
    }

    .lv_canvas {
      position: absolute;
      top: -999999999999999px;
      left: -100000000000px;
    }
  }
</style>
