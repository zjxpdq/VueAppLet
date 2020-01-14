<template>
  <view class="lv_shops_box">
    <lv-speed :index="2"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <div class="lv_center">
          <div class="lv_title" style="margin-top: 0;">权益详情</div>
          <div class="lv_editor_box">
            <lv-editor v-model="queryList.equityDesc"></lv-editor>
          </div>
          <div class="lv_title">商家承诺</div>
          <div class="lv_promise_box">
            <div class="lv_promise_center" v-for="(item, index) of promiseList[0]" :key="index">
              <div class="lv_p_title">{{item.name}}</div>
              <div class="lv_p_text">{{item.subName}}</div>
            </div>
            <div class="lv_promise_add">
              <div class="lv_p_add_input" v-if="add">
                <div class="lv_input lv_p_add_title">
                  <input type="text" v-model="exitPromise.name" placeholder="承诺标题"/>
                </div>
                <div class="lv_input lv_p_add_text">
                  <input type="text" v-model="exitPromise.subName" placeholder="请输入承诺描述"/>
                  <i class="lv_del_icon" @click="delData('add')"></i>
                </div>
              </div>
              <div class="lv_p_add_btn" v-if="promiseList[0] && promiseList[0].length < 6" @click="addData">
                <i class="lv_min_add_icon"></i>
                自定义添加承诺
              </div>
            </div>
          </div>
          <div class="lv_title">消费者承诺</div>
          <div class="lv_promise_box">
            <div class="lv_promise_center" v-for="(item, index) of promiseList[1]" :key="index">
              <div class="lv_p_title">{{item.name}}</div>
              <div class="lv_p_text">{{item.subName}}</div>
            </div>
          </div>
          <div class="lv_title">上架时间</div>
        </div>
        <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../../components/speed'
  import uploadComponent from './../../../components/uploadfile'
  import validate from '../../../utils/validate'
  import LvEditor from './../../../components/lv_editor'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        queryList: {
          id: '', // (string, optional): 权益id ,
          shopId: '', // (string, optional): 店铺id ,
          equityDesc: '', // (string, optional): 权益明细说明 ,
          shopPromiesIds: '', // (Array[PromiseLabelListVO], optional): 商家承诺IDs ,
          userPromiesIds: '', // (Array[PromiseLabelListVO], optional): 用户承诺IDs
          releaseStatus: '' // (integer, optional): 上架时间 0立即上架 1放入仓库商家手动上架 ,
        },
        promise: [[], []],
        add: null,
        exitPromise: {
          name: '',
          subName: ''
        },
        WxValidate: null
      }
    },
    onLoad (query) {
      Object.assign(this.queryList, {
        shopId: query.shopId || '1210370501906530304',
        id: query.shopId || '1210370501906530304'
      })
      this.getEquityList()
      this.initValidate()
    },
    created () {
    },
    methods: {
      getEquityList () {
        this.getRequest({
          url: `/appequity/helperEquity/all/${this.queryList.shopId}`,
          data: {}
        }).then(res => {
          if (res.status === 200) {
            this.promise = res.t
          }
        })
      },
      addData () {
        this.add = true
      },
      delData (type) {
        console.log(type)
        switch (type) {
          case 'add':
            this.add = false
            this.exitPromise = { name: '', subName: '' }
            break
          case 'list':
            break
        }
      },

      getStoreEntrancePic (data) {
        this.queryList.equityImage = data.fileurl
      },
      putAre (val) {
        this.queryList.expectPrice = null
        this.queryList.levelPrice = null
        this.queryList.price = null
        this.queryList.existPrice = val
      }, // 切换是 否
      initValidate () {
        this.WxValidate = new validate({
          equityImage: { required: true, message: '权益图片是必须的' },
          equityTitle: { required: true, message: '权益名称是必须的' },
          price: {
            required: true,
            validator: (rule, value, callback) => {
              switch (this.queryList.existPrice) {
                case 0:
                  if (!value) {
                    callback(new Error('商品原价是必须的'))
                  } else if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
                    callback(new Error('请输入正整数，可以保留两位小数'))
                  } else if (value < 1) {
                    callback(new Error('金额不能低于1元'))
                  } else if (!/^([1-9][\d]{0,5})(\.[\d]{1,2})?$/.test(value)) {
                    callback(new Error('输入金额不能超过999999.99元'))
                  } else {
                    callback()
                  }
                  break
                case 1:
                  if (value && !/^-?\d+\.?\d{0,2}$/.test(value)) {
                    callback(new Error('最低消费金额必须是数字，最多可带两位小数'))
                  } else {
                    callback()
                  }
                  break
              }
            }
          },
          levelPrice: {
            validator: (rule, value, callback) => {
              switch (this.queryList.existPrice) {
                case 0:
                  if (value && !/^-?\d+\.?\d{0,2}$/.test(value)) {
                    callback(new Error('其他平台竞价必须是数字，最多可带两位小数'))
                  } else {
                    callback()
                  }
                  break
                case 1:
                  if (value && !/^[1-9](\.\d{1})?$/.test(value)) {
                    callback(new Error('请输入合理的其它平台最低折扣'))
                  } else {
                    callback()
                  }
                  break
              }
            }
          },
          expectPrice: {
            validator: (rule, value, callback) => {
              switch (this.queryList.existPrice) {
                case 0:
                  if (value && !/^-?\d+\.?\d{0,2}$/.test(value)) {
                    callback(new Error('期望平均价格必须是数字，最多可带两位小数'))
                  } else {
                    callback()
                  }
                  break
                case 1:
                  if (value && !/^[1-9](\.\d{1})?$/.test(value)) {
                    callback(new Error('请输入合理的期望平均折扣'))
                  } else {
                    callback()
                  }
                  break
              }
            }
          }
        })
      },
      submit () {
        this.WxValidate.checkForm(this.queryList).then(() => {
          this.postRequest({
            url: '/appequity/helperEquity/addEquityOne',
            data: this.queryList
          }).then(res => {
            if (res.status === 200) {
              wx.navigateTo({ url: `../detail/main?shopId=${this.queryList.companyId}` })
            } else {
              this.Toast(res.msg)
            }
          })
        })
      },
      changeEditor (e) {
        console.log(e)
      },
      format () {}
    },
    components: {
      uploadComponent,
      LvSpeed,
      LvEditor
    },
    computed: {
      getNext () {
        return this.WxValidate.ext(this.queryList)
      },
      promiseList () {
        return this.promise
      }
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import url('./../../../styles/lv_style');
  @import url('../../../styles/icon');

  .lv_shops_box .lv_content {
    height: 100%;
    width: 100%;
    position: relative;

    .lv_center {
      padding: unit(40, rpx) unit(40, rpx) 0;

      .lv_title {
        margin-top: unit(40, rpx);
      }

      .lv_editor_box {
        width: 100%;
        height: unit(606, rpx);
        margin-top: unit(40, rpx);

        .lv_editor {
          background: #FBFBFB;
          border-radius: unit(8, rpx);
          height: 100%;
          padding: unit(10, rpx) unit(20, rpx);
        }
      }

      .lv_promise_box {
        margin-top: unit(12, rpx);

        .lv_promise_center {
          display: flex;
          font-size: unit(28, rpx);
          padding: unit(12, rpx) 0;
          color: #333;

          .lv_p_title {
            width: unit(130, rpx);
          }

          .lv_p_text {

          }
        }

        .lv_promise_add {
          .lv_p_add_input {
            display: flex;
            margin-bottom: unit(12, rpx);

            .lv_p_add_title {
              width: unit(115, rpx);
              margin-right: unit(24, rpx);
            }

            .lv_p_add_text {
              flex: 1;
              position: relative;

              .lv_del_icon {
                position: absolute;
                top: unit(24, rpx);
                right: 0;
                display: inline-block;
                width: unit(32, rpx);
                height: unit(32, rpx);
                z-index: 99;
              }
            }

          }

          .lv_p_add_btn {
            width: unit(240, rpx);
            height: unit(56, rpx);
            margin: unit(12, rpx) auto 0;
            color: #333;
            font-size: unit(24, rpx);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(232, 232, 232, 1);
            border-radius: unit(8, rpx);
          }
        }
      }
    }
  }
</style>
