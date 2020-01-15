<template>
  <view class="lv_shops_box">
    <lv-speed :index="2"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <div class="lv_center">
          <div class="lv_up_permit_box">
            <div class="lv_title">
              <em>营业执照正面照片</em>
              <div class="lv_camera_icon">
                <upload-component
                  @click="getImage"
                  :config="{count: 1, sizeType: ['original'],sourceType: ['camera']}"
                  type="3"
                />
              </div>
            </div>

            <div :class="['lv_add_img', {'bg000': !!queryList.busImage}]">
              <upload-component @click="getImage" type="3"/>
              <img v-if="queryList.busImage" mode="aspectFit" :src="queryList.busImage"/>
            </div>
          </div>
          <div class="lv_text">请上传清晰的彩色照片。</div>
          <div class="lv_title">企业名称</div>
          <div class="lv_input">
            <input type="text" v-model="queryList.companyName" placeholder="请输入营业执照上的企业名称"/>
          </div>
          <div class="lv_title">统一社会信用代码</div>
          <div class="lv_input">
            <input type="text" v-model="queryList.qyCode" placeholder="请输入统一社会信用代码"/>
          </div>
          <div class="lv_title">履约保服务费率</div>
          <div class="lv_input">
            <picker class="lv_picker" @change="changeRate" :value="index" :range="ratedList">
              <input type="text" v-model="ratedText" disabled placeholder="请选择履约保服务费率"/>
            </picker>
          </div>
        </div>
        <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">完成</div>
      </view>
    </view>
  </view>
</template>

<script>
  import validate from '../../../utils/validate'
  import uploadComponent from '../../../components/uploadfile'
  import LvSpeed from './../../../components/speed'

  export default {
    name: 'lv_shops_box',
    data () {
      const qyCode = (r, v, c) => {
        if (!v) {
          c(new Error('统一社会信用代码是必须的'))
        } else if (!/[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(v)) {
          c(new Error('请输入合法的统一社会信用代码'))
        } else {
          c()
        }
      }
      return {
        queryList: {
          busImage: '', // (string, optional): 营业执照照片 ,
          companyId: '1210370501906530304', // (string, optional): 企业id ,
          companyName: '', // (string, optional): 企业名称 ,
          qyCode: '', // (string, optional): 统一社会信用代码 ,
          rate: '', // (string, optional): 服务费率 ,
          shopId: '1210370501906530304' // (string, optional): 店铺id
        },
        rule: {
          busImage: { required: true, message: '营业执照照片是必须的' },
          companyName: [{ required: true, message: '企业名称是必须的' }, { min: 3, max: 40, message: '企业名称不能小于3个或大于40个字符' }],
          qyCode: { required: true, validator: qyCode },
          rate: { required: true, message: '服务费率是必须的' }
        },
        ratedList: ['0', '0.2', '0.6', '1.0', '2.0', '5.0'], // 费率列表
        ratedText: '',
        WxValidate: null
      }
    },
    onLoad (query) {
      if (query.shopId) {
        Object.assign(this.queryList, {
          companyId: query.shopId,
          id: query.shopId
        })
        this.getList(query.shopId)
      }
      // this.getList('1210370501906530304')
      this.initValidate()
    },
    created () {
    },
    methods: {
      getImage (e) {
        let t = e.t
        console.log(e)
        if (t.errcode === 0) {
          Object.assign(this.queryList, {
            busImage: e.fileurl,
            companyName: t.enterprise_name,
            qyCode: t.reg_num
          })
        } else {
          this.Toast(t.errmsg)
          Object.assign(this.queryList, {
            busImage: '',
            companyName: '',
            qyCode: ''
          })
        }
      }, // 获取上传的图片
      changeRate (e) {
        let val = this.ratedList[e.mp ? e.mp.detail.value : e]
        this.queryList.rate = val
        this.ratedText = val
        console.log(e.mp.detail.value)
      },
      initValidate () {
        this.WxValidate = new validate(this.rule)
      },
      submit () {
        this.WxValidate.checkForm(this.queryList).then(() => {
          this.postRequest({
            url: '/appequity/helperShop/insertShopThree',
            data: this.queryList
          }).then(res => {
            if (res.status === 200) {
              wx.navigateTo({ url: `../success/main?shopId=${this.queryList.companyId}` })
            } else {
              this.Toast(res.msg)
            }
          })
        })
      },
      getList (id) {
        this.getRequest({
          url: `/appequity/helperShop/echoQyShopThree/${id}`
        }).then(res => {
          if (res.status === 200) {
            let list = res.t
            Object.assign(this.queryList, list)
            this.$nextTick(() => {
              this.ratedText = list.rate
            })
          }
        })
      } // 获取回显数据
    },
    components: {
      uploadComponent,
      LvSpeed
    },
    computed: {
      getNext () {
        return this.WxValidate.ext(this.queryList)
      } // 获取实时验证结果
    }
  }
</script>

<style scoped lang="less">
  @import url('../../../styles/lv_style.less');

  .lv_shops_box .lv_content_box .lv_content {
    height: 100%;
    width: 100%;
    position: relative;

    .lv_center {
      padding: unit(1, rpx) unit(40, rpx) 0;

      .lv_up_permit_box {
        .lv_title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .lv_camera_icon {
            position: absolute;
            right: unit(40, rpx);
          }
        }

        .lv_add_img {
          width: 100%;
          height: unit(340, rpx);
          margin-top: unit(24, rpx);

          img {
            height: unit(340, rpx);
          }

          &.bg000 {
            background: #333;
            border-color: #333;
          }
        }
      }

    }
  }
</style>
