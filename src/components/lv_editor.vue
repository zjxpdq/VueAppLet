<template>
  <view class="lv_editor">
    <div class='lv_toolbar' @click="format">
      <i
        v-if="config.bold"
        :class="['iconfont', 'icon-zitijiacu', {'lv_ql_active': formats.bold}]"
        data-name="bold"
      ></i>
      <i
        v-if="config.italic"
        :class="['iconfont', 'icon-zitixieti', {'lv_ql_active': formats.italic}]"
        data-name="italic"
      ></i>
      <i
        v-if="config.underline"
        :class="'iconfont icon-zitixiahuaxian ' + (formats.underline ? 'lv_ql_active' : '')"
        data-name="underline"
      ></i>
      <i
        v-if="config.strike"
        :class="'iconfont icon-zitishanchuxian ' + (formats.strike ? 'lv_ql_active' : '')"
        data-name="strike"
      ></i>
      <i
        v-if="config.alignLeft"
        :class="'iconfont icon-zuoduiqi ' + (formats.align === 'left' ? 'lv_ql_active' : '')"
        data-name="align"
        data-value="left"
      ></i>
      <i
        v-if="config.alignCenter"
        :class="'iconfont icon-juzhongduiqi  ' + (formats.align === 'center' ? 'lv_ql_active' : '')"
        data-name="align"
        data-value="center"
      ></i>
      <i
        v-if="config.alignRight"
        :class="'iconfont icon-youduiqi  ' + (formats.align === 'right' ? 'lv_ql_active' : '')"
        data-name="align"
        data-value="right"
      ></i>
      <i
        v-if="config.justify"
        :class="'iconfont icon-zuoyouduiqi  ' + (formats.align === 'justify' ? 'lv_ql_active' : '')"
        data-name="align"
        data-value="justify"
      ></i>
      <i
        v-if="config.lineHeight"
        :class="'iconfont icon-line-height ' + (formats.lineHeight ? 'lv_ql_active' : '')"
        data-name="lineHeight"
        data-value="2"
      ></i>
      <i
        v-if="config.letterSpacing"
        :class="'iconfont icon-Character-Spacing  ' + (formats.letterSpacing ? 'lv_ql_active' : '')"
        data-name="letterSpacing"
        data-value="2em"
      ></i>
      <i
        v-if="config.marginTop"
        :class="'iconfont icon-722bianjiqi_duanqianju ' + (formats.marginTop ? 'lv_ql_active' : '')"
        data-name="marginTop"
        data-value="20px"
      ></i>
      <i
        v-if="config.marginBottom"
        :class="'iconfont icon-723bianjiqi_duanhouju ' + (formats.micon-previewarginBottom ? 'lv_ql_active' : '')"
        data-name="marginBottom"
        data-value="20px"
      ></i>
      <i
        v-if="config.removeFormat"
        class="iconfont icon-clearedformat"
        @click="removeFormat"
      ></i>
      <i
        v-if="config.fontFamily"
        :class="'iconfont icon-font ' + (formats.fontFamily ? 'lv_ql_active' : '')"
        data-name="fontFamily"
        data-value="Pacifico"
      ></i>
      <i
        v-if="config.fontSize"
        :class="'iconfont icon-fontsize ' + (formats.fontSize === '24px' ? 'lv_ql_active' : '')"
        data-name="fontSize"
        data-value="24px"
      ></i>
      <i
        v-if="config.color"
        :class="'iconfont icon-text_color ' + (formats.color === '#0000ff' ? 'lv_ql_active' : '')"
        data-name="color"
        data-value="#0000ff"
      ></i>
      <i
        v-if="config.backgroundColor"
        :class="'iconfont icon-fontbgcolor ' + (formats.backgroundColor === '#00ff00' ? 'lv_ql_active' : '')"
        data-name="backgroundColor"
        data-value="#00ff00"
      ></i>
      <i v-if="config.insertDate" class="iconfont icon-date" @click="insertDate"></i>
      <i v-if="config.listCheck" class="iconfont icon--checklist" data-name="list" data-value="check"></i>
      <i
        v-if="config.listOrdered"
        :class="'iconfont icon-youxupailie ' + (formats.list === 'ordered' ? 'lv_ql_active' : '')" data-name="list"
        data-value="ordered"
      ></i>
      <i
        v-if="config.listBullet"
        :class="'iconfont icon-wuxupailie ' + (formats.list === 'bullet' ? 'lv_ql_active' : '')"
        data-name="list"
        data-value="bullet"
      ></i>
      <i v-if="config.undo" class="iconfont icon-undo" @click="undo"></i>
      <i v-if="config.redo" class="iconfont icon-redo" @click="redo"></i>
      <i v-if="config.indentReduce" class="iconfont icon-outdent" data-name="indent" data-value="-1"></i>
      <i v-if="config.indentAdd" class="iconfont icon-indent" data-name="indent" data-value="+1"></i>
      <i v-if="config.insertDivider" class="iconfont icon-fengexian" @click="insertDivider"></i>
      <i v-if="config.insertImage" class="iconfont icon-charutupian" @click="insertImage"></i>
      <i
        v-if="config.header"
        :class="'iconfont icon-format-header-1  ' + (formats.header === 1 ? 'lv_ql_active' : '')"
        data-name="header"
        data-value="1"
      ></i>
      <i
        v-if="config.scriptSub"
        :class="'iconfont icon-zitixiabiao  ' + (formats.script === 'sub' ? 'lv_ql_active' : '')"
        data-name="script"
        data-value="sub"
      ></i>
      <i
        v-if="config.scriptSuper"
        :class="'iconfont icon-zitishangbiao  ' + (formats.script === 'super' ? 'lv_ql_active' : '')"
        data-name="script"
        data-value="super"
      ></i>
      <i v-if="config.clear" class="iconfont icon-shanchu" @click="clear"></i>
      <i
        v-if="config.direction"
        :class="'iconfont icon-direction-rtl  ' + (formats.direction === 'rtl' ? 'lv_ql_active' : '')"
        data-name="direction"
        data-value="rtl"
      ></i>
    </div>
    <div class="lv_editor_box">
      <editor
        id="editor"
        class="lv_ql_container"
        :placeholder="placeholder"
        showImgSize
        showImgToolbar
        showImgResize
        @statuschange="onStatusChange"
        @ready="onEditorReady"
        @input="onInput"
      ></editor>
    </div>
  </view>
</template>

<script>
  import httpRequest from './../utils/config'

  export default {
    data () {
      return {
        editorCtx: null, // 富文本编辑器
        placeholder: '请输入权益详情',
        formats: {},
        config: {
          bold: true,
          italic: true,
          underline: true,
          strike: true,
          alignLeft: true,
          alignCenter: true,
          alignRight: true,
          justify: true,
          lineHeight: true,
          letterSpacing: true,
          marginBottom: true,
          removeFormat: true,
          fontFamily: true,
          fontSize: true,
          color: true,
          backgroundColor: true,
          insertDate: true,
          listCheck: true,
          listOrdered: true,
          listBullet: true,
          undo: true,
          redo: true,
          indentReduce: true,
          indentAdd: true,
          insertDivider: true,
          insertImage: true,
          header: true,
          scriptSub: true,
          scriptSuper: true,
          clear: true,
          direction: true
        }
      }
    },
    props: {
      value: String
    },
    watch: {
      value () {
        if (this.value && this.editorCtx) {
          this.editorCtx.setContents({ html: this.value })
        }
      }
    },
    methods: {
      format (e) {
        let { name, value } = e.target.dataset
        if (name) {
          this.editorCtx.format(name, value)
        }
      },
      onEditorReady () {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
          that.editorCtx = res.context
        }).exec()
      }, // 编辑器准备好后调用
      onStatusChange (e) {
        this.formats = e.mp.detail
      }, // 编辑器改变后调用
      removeFormat () {
        this.editorCtx.removeFormat()
      },
      insertDate () {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
          text: formatDate
        })
      }, // 获取时间
      undo () {
        this.editorCtx.undo()
      }, // 撤销
      redo () {
        this.editorCtx.redo()
      }, // 重做
      insertDivider () {
        this.editorCtx.insertDivider({
          success: function () {
            console.log('insert divider success')
          }
        })
      }, // 插入分割
      clear () {
        this.editorCtx.clear({
          success: function (res) {
            console.log(res)
          }
        })
      }, // 清除
      insertImage () {
        wx.chooseImage({
          count: 1,
          success: res => {
            const resFile = res.tempFiles[0].path
            wx.uploadFile({
              url: `${httpRequest.url}/appequity/oss/uploadImage`,
              filePath: resFile,
              name: 'file',
              success: r => {
                const data = JSON.parse(r.data)
                if (data.status === 200) {
                  wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                  this.editorCtx.insertImage({
                    src: data.t,
                    data: {},
                    success: function () {
                      console.log('图片插入成功')
                    }
                  })
                } else {
                  wx.showToast({
                    title: data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        })
      }, // 上传相片
      onInput (e) {
        this.newValue = e.mp.detail.html
      } // 内容改变时触发
    },
    onLoad () {
      // console.log('onLoad')
    },
    onShow () {
      // console.log('onShow')
    },
    computed: {
      newValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      }
    },
    mounted () {
      const that = this
      wx.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
      }).exec()
    } /** 页面加载完成时调用函数 */
  }
</script>

<style scoped lang="less">
  @import url('./../styles/icon');

  .lv_editor {
    height: 100%;
    display: flex;
    flex-direction: column;


    .lv_toolbar {
      box-sizing: border-box;
      /*border-bottom: 0;*/
      font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      padding-bottom: unit(20, rpx);
      border-bottom: 1px solid #ccc;

      .iconfont {
        display: inline-block;
        padding: unit(10, rpx) unit(10, rpx);
        width: unit(32, rpx);
        height: unit(32, rpx);
        cursor: pointer;
        font-size: unit(32, rpx);
      }

      .lv_ql_active {
        color: #06c;
      }
    }

    .lv_editor_box {
      flex: 1;
      overflow-y: auto;

      .lv_ql_container {
        box-sizing: border-box;
        padding: unit(12, rpx) 0;
        width: 100%;
        min-height: 100%;
        height: auto;
        font-size: unit(28, rpx);
        line-height: 1.5;
        background: #FBFBFB;
        border-radius: unit(8, rpx);
      }
    }
  }
</style>
