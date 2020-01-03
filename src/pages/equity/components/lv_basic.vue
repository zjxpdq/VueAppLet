<template>
  <view class="lv_basic">
    <div class="lv_center">
      <view class="logo-box">
        <view>
          <div class="lv_title">权益图片</div>
          <div class="lv_text">请上传权益相关的图片。</div>
        </view>
        <view class="logo-img">
          <upload-component @click="getStoreEntrancePic" :init="true"/>
          <img :src="questData.equityImage"/>
        </view>
      </view>
      <div class="lv_title" style="margin-top: 40rpx;">权益名称</div>
      <div class="lv_input">
        <input type="text" v-model="questData.equityTitle" placeholder="请输入权益名称"/>
      </div>
      <div class="lv_title lv_title_tab">
        <em>是否有固定原价</em>
        <view class="lv_btn_box">
          <span :class="[{pitchOn: questData.existPrice===0}]" @click="putAre(0)">是</span>
          <span :class="[{pitchOn: questData.existPrice===1}]" @click="putAre(1)">否</span>
        </view>
      </div>
      <div class="lv_text">有固定原价表示商品可明码标价，否则以实际消费金额为准。</div>
      <div class="lv_pitch_box" v-if="questData.existPrice===0">
        <div class="lv_title">
          <em>商品原价</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.price" placeholder="请输入价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_title">
          <em>其他平台竞价</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.levelPrice" placeholder="请输入价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_text">表示顾客可在其他平台（团购平台等）购买的最低价格。</div>
        <div class="lv_title">
          <em>商家期望的平均价格</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.expectPrice" placeholder="请输入平均价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_text">表示商家期望顾客每次履约的平均价格。</div>
      </div>
      <div class="lv_pitch_box" v-if="questData.existPrice===1">
        <div class="lv_title">
          <em>最低消费金额</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.price" placeholder="请输入价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_title">
          <em>其他平台最低折扣</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.levelPrice" placeholder="请输入价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_text">有固定原价表示商品可明码标价，否则以实际消费金额为准。</div>
        <div class="lv_title">
          <em>商家期望的平均折扣</em>
          <div class="lv_input lv_end">
            <input type="text" v-model="questData.expectPrice" placeholder="请输入平均价格"/>
            <em class="lv_end_text">元</em>
          </div>
        </div>
        <div class="lv_text">表示商家期望顾客每次履约的平均折扣。</div>
      </div>
    </div>

    <div :class="['lv_footer_next_btn', {'lv_pitch_on': aa}]" @click="submit">下一步</div>
  </view>
</template>

<script>
  import uploadComponent from './../../../components/uploadfile'
  import WxValidate from '../../../utils/validate'

  const validator = (rule, value, callback)=> {
    console.log(rule)
    console.log(value)
    console.log(callback)
  }

  export default {
    name: 'lv_basic',
    data () {
      return {
        questData: {
          equityImage: '', // (string, optional): 权益图片 ,
          equityTitle: '', // (string, optional): 权益名称 ,
          existPrice: 0, // (integer, optional): 是否设置原价0表示是 1表示否 ,
          expectPrice: null, // (number, optional): existPrice为0表示期望平均价格 为1时表示期望平均折扣 ,
          id: '', // (string, optional): 权益id ,
          levelPrice: null, // (number, optional): 其他平台竞价/其它平台最低折扣 ,
          price: null, // (number, optional): 商品原价/最低消费 ,
          shopId: '' // (string, optional): 店铺id
        },
        WxValidate: null
      }
    },
    created () {
      this.WxValidate = new WxValidate()
    },
    methods: {
      getStoreEntrancePic (data) {
        this.questData.equityImage = data.fileurl
      },
      putAre (val) {
        this.questData.expectPrice = null
        this.questData.levelPrice = null
        this.questData.price = null
        this.questData.existPrice = val
      }, // 切换是 否
      initValidate () {
        const rules = {
          equityImage: {
            required: '',
            fields: {
              zip: []
            },
            validator
          },
          equityTitle: {
            required: true,
            messages: ''
          },
          existPrice: {
            required: true
          },
          expectPrice: {
            required: true
          },
          levelPrice: {
            required: true
          },
          price: {
            required: true
          },
          shopId: {
            required: true
          }
        }
        const messages = {
          equityImage: {
            required: '权益图片是必须的'
          },
          equityTitle: {
            required: '权益名称是必须的'
          },
          existPrice: {
            required: '是否有原价是必须的'
          },
          expectPrice: {
            required: '期望平均价格是必须的'
          },
          levelPrice: {
            required: '他平台竞价是必须的'
          },
          price: {
            required: '商品原价/最低消费是必须的'
          },
          shopId: {
            required: '请输入权益图片'
          }
        }
        this.WxValidate = new WxValidate(rules, messages)
      },
      submit () {

      }
    },
    components: {
      uploadComponent
    },
    computed: {},
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import "./../../../styles/lv_style.less";

  .lv_basic {
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
