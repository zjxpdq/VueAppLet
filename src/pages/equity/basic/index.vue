<template>
  <view class="lv_shops_box">
    <lv-speed :index="0"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <div class="lv_center">
          <view class="logo-box">
            <view>
              <div class="lv_title">权益图片</div>
              <div class="lv_text">请上传权益相关的图片。</div>
            </view>
            <view class="logo-img">
              <upload-component @click="getStoreEntrancePic" :init="true"/>
              <img :src="queryList.equityImage"/>
            </view>
          </view>
          <div class="lv_title" style="margin-top: 40rpx;">权益名称</div>
          <div class="lv_input">
            <input type="text" v-model="queryList.equityTitle" placeholder="请输入权益名称"/>
          </div>
          <div class="lv_title lv_title_tab">
            <em>是否有固定原价</em>
            <view class="lv_btn_box">
              <span :class="[{pitchOn: queryList.existPrice===0}]" @click="putAre(0)">是</span>
              <span :class="[{pitchOn: queryList.existPrice===1}]" @click="putAre(1)">否</span>
            </view>
          </div>
          <div class="lv_text">有固定原价表示商品可明码标价，否则以实际消费金额为准。</div>
          <div class="lv_pitch_box" v-if="queryList.existPrice===0">
            <div class="lv_title">
              <em>商品原价</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.price" placeholder="请输入价格"/>
                <em class="lv_end_text">元</em>
              </div>
            </div>
            <div class="lv_title">
              <em>其他平台竞价</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.levelPrice" placeholder="请输入价格"/>
                <em class="lv_end_text">元</em>
              </div>
            </div>
            <div class="lv_text">表示顾客可在其他平台（团购平台等）购买的最低价格。</div>
            <div class="lv_title">
              <em>商家期望的平均价格</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.expectPrice" placeholder="请输入平均价格"/>
                <em class="lv_end_text">元</em>
              </div>
            </div>
            <div class="lv_text">表示商家期望顾客每次履约的平均价格。</div>
          </div>

          <div class="lv_pitch_box" v-if="queryList.existPrice===1">
            <div class="lv_title">
              <em>最低消费金额</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.price" placeholder="请输入价格"/>
                <em class="lv_end_text">元</em>
              </div>
            </div>
            <div class="lv_title">
              <em>其他平台最低折扣</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.levelPrice" placeholder="请输入价格"/>
                <em class="lv_end_text">折</em>
              </div>
            </div>
            <div class="lv_text">有固定原价表示商品可明码标价，否则以实际消费金额为准。</div>
            <div class="lv_title">
              <em>商家期望的平均折扣</em>
              <div class="lv_input lv_end">
                <input type="text" v-model="queryList.expectPrice" placeholder="请输入平均价格"/>
                <em class="lv_end_text">折</em>
              </div>
            </div>
            <div class="lv_text">表示商家期望顾客每次履约的平均折扣。</div>
          </div>
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
  import { forEachs } from '../../../utils'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        queryList: {
          equityImage: '', // (string, optional): 权益图片 ,
          equityTitle: '', // (string, optional): 权益名称 ,
          existPrice: 0, // (integer, optional): 是否设置原价0表示是 1表示否 ,
          id: '', // (string, optional): 权益id ,
          price: null, // (number, optional): 商品原价/最低消费 ,
          levelPrice: null, // (number, optional): 其他平台竞价/其它平台最低折扣 ,
          expectPrice: null,
          shopId: '' // (string, optional): 店铺id
        },
        WxValidate: null
      }
    },
    onLoad (query) {
      if (query.shopId) {
        Object.assign(this.queryList, {
          shopId: query.shopId,
          id: query.shopId
        })
        this.getList(query.equityId)
      }
      // this.getList('1577934548363')
      this.initValidate()
    },
    created () {
    },
    methods: {
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
      getList (id) {
        this.getRequest({
          url: `/appequity/helperEquity/getEquityById/${id}`
        }).then(res => {
          if (res.status === 200) {
            let list = res.t
            let keys = [
              'equityImage',
              'equityTitle',
              'existPrice',
              'price',
              'levelPrice',
              'expectPrice'
            ]
            forEachs(keys, item => {
              this.queryList[item] = list[item]
            })
          }
        })
      }
    },
    components: {
      uploadComponent,
      LvSpeed
    },
    computed: {
      getNext () {
        return this.WxValidate.ext(this.queryList)
      }
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import url('./../../../styles/lv_style');

  .lv_shops_box .lv_content {
    height: 100%;
    width: 100%;
    position: relative;

    .lv_center {
      padding: unit(40, rpx) unit(40, rpx) 0;

      .lv_title {
        margin-top: unit(40, rpx);
      }

      .logo-box {
        display: flex;
        justify-content: space-between;

        .lv_title {
          margin-bottom: unit(16, rpx);
          margin-top: 0;
        }

        .logo-img {
          width: unit(160, rpx);
          height: unit(160, rpx);
          background: url('https://oss-zonda-lyb.oss-cn-shenzhen.aliyuncs.com/min_we_icon/sign_icon_add%402x%402x%20%281%29.png') no-repeat center center;
          background-size: unit(80, rpx) unit(80, rpx);
          border: 1px solid #E8E8E8;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .lv_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: unit(16, rpx);

        .lv_btn_box {
          font-weight: normal;

          span {
            width: unit(144, rpx);
            height: unit(56, rpx);
            margin-left: unit(24, rpx);
            background: #F9F9F9;
            display: inline-block;
            text-align: center;
            line-height: unit(56, rpx);
            color: #333;
            border-radius: unit(8, rpx);

            &.pitchOn {
              background: #E8F4FF;
              color: #118CFD;
            }
          }
        }
      }

      .lv_pitch_box {
        .lv_input {
          width: unit(312, rpx);
        }
      }
    }
  }
</style>
