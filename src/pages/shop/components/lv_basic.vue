<template>
  <view class="lv_basic">
    <div class="lv_center">
      <div class="lv_title" style="margin-top: 40rpx;">店铺名称</div>
      <div class="lv_input">
        <input type="text" v-model="queryList.name" placeholder="请输入门店名称"/>
      </div>
      <div class="lv_text">店铺名称在履约保小程序中展示。</div>
      <div class="lv_title" style="margin-top: 40rpx;">行业</div>
      <div class="lv_input">
        <picker class="lv_picker" @change="changeInd" :value="ind" :range="indList.option">
          <input type="text" v-model="product_desc" disabled="true" placeholder="请选择行业"/>
        </picker>
      </div>
      <div class="lv_title" style="margin-top: 40rpx;">门店省市</div>
      <div class="lv_input">
        <picker class="lv_picker" mode="region" @change="changeRegion" :value="region">
          <input type="text" v-model="regionText" disabled placeholder="请选择门店省市"/>
        </picker>
      </div>
      <div class="lv_title" style="margin-top: 40rpx;">详细地址</div>
      <div class="lv_input">
        <input type="text" v-model="queryList.detailAddress" placeholder="请输入详细地址"/>
      </div>
      <div class="lv_title" style="margin-top: 40rpx;">位置坐标</div>
      <div class="lv_input" @click="onGetLocation">
        <input class="lv_picker" type="text" v-model="store_street" disabled placeholder="请选择店铺位置坐标"/>
      </div>
      <div class="lv_title" style="margin-top: 40rpx;">位置备注</div>
      <div class="lv_input">
        <input type="text " v-model="queryList.addressMarks" placeholder="请输入店铺位置备注（非必填）"/>
      </div>
      <div class="lv_text">例：国际会展中心路口北400米。</div>
      <div class="lv_text" style="color: #E56B65; text-align: center; margin-top: 40rpx; font-weight: bold;">
        *以上资料设置后无法由商家自主修改，请仔细核对
      </div>
    </div>

    <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
  </view>
</template>

<script>
  import uploadComponent from './../../../components/uploadfile'
  import validate from '../../../utils/validate'

  export default {
    name: 'lv_basic',
    data () {
      return {
        queryList: {
          province: '', // (string): 省份id ,
          area: '', // (string): 区id ,
          city: '', // (string): 城市id ,
          companyId: '', // (string, optional): 企业id ,
          detailAddress: '', // (string): 详细地址 ,
          id: '', // (string, optional): 店铺id ,
          location: '', // (string, optional): 详细地址经纬度 ,
          name: '', // (string): 店铺名称 ,
          addressMarks: '', // (string, optional): 位置备注 ,
          shopTypeId: '' // (string): 行业id
        },
        rule: {
          name: { required: true, message: '店铺名称必须的' }, // (string): 店铺名称 ,
          province: { required: true, message: '省份是必须的' }, // (string): 省份id ,
          city: { required: true, message: '市是必须的' }, // (string): 城市id ,
          detailAddress: { required: true, message: '详细地址是必须的' }, // (string): 详细地址 ,
          location: { required: true, message: '坐标位置是必须的' }, // (string, optional): 详细地址经纬度 ,
          shopTypeId: { required: true, message: '行业是必须的' } // (string): 行业id
        },
        indList: {
          option: [],
          list: []
        }, // 行业数据
        product_desc: '', // 显示行业
        ind: 0, // 行业回显下标
        region: [], // 回显城市
        regionText: '', // 显示省市区
        store_street: '', // 坐标位置

        WxValidate: null
      }
    },
    created () {
      this.getShopType()
      this.initValidate()
    },
    methods: {
      getShopType () {
        this.getRequest({
          url: '/appequity/helperShop/getShopType',
          data: {}
        }).then(res => {
          if (res.status === 200) {
            this.indList = {
              option: res.t.map(item => item.name),
              list: res.t
            }
          }
        })
      }, // 获取行业数据
      changeInd (e) {
        let data = this.indList.list[e.mp ? e.mp.detail.value : e]
        this.queryList.shopTypeId = data.id
        this.product_desc = data.name
      }, // 选中的行业
      changeRegion (e) {
        let val = e.mp.detail
        Object.assign(this.queryList, {
          province: val.code[0], // (string): 省份id ,
          city: val.code[1], // (string): 城市id ,
          area: val.code[2] // (string): 区id ,
        })
        this.regionText = val.value.join(',')
      }, // 选中的省市区
      onGetLocation () {
        let that = this
        wx.chooseLocation({
          success: function (res) {
            if (res.errMsg === 'chooseLocation:ok') {
              that.store_street = res.name
              that.queryList.location = `${res.latitude},${res.longitude}`
            }
          }
        })
      }, // 位置坐标
      initValidate () {
        this.WxValidate = new validate(this.rule)
      },
      submit () {
        this.WxValidate.checkForm(this.queryList).then(() => {
          this.postRequest({
            url: '/helperShop/insertShopOne',
            data: this.queryList
          }).then(res => {
            console.log(res)
          })
        })
      }
    },
    components: {
      uploadComponent
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

      .lv_text {
        margin-top: unit(16, rpx);
      }

      .lv_pitch_box {
        .lv_input {
          width: unit(312, rpx);
        }
      }
    }
  }
</style>
