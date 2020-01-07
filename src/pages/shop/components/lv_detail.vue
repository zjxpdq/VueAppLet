<template>
  <view class="lv_detail">
    <div class="lv_center">
      <div class="lv_up_logo_box">
        <div>
          <div class="lv_title">店铺logo</div>
          <div class="lv_text">请上传店铺logo或门店招牌照片。</div>
        </div>
        <div class="lv_add_img">
          <upload-component @click="getImage" :init="true"/>
          <img v-if="queryList.image" :src="queryList.image"/>
        </div>
      </div>
      <div class="lv_input_box">
        <div class="lv_title">店铺电话</div>
        <div class="lv_input">
          <input type="text" v-model="queryList.mobile" placeholder="请输入电话号码"/>
        </div>
      </div>
      <div class="lv_input_box" v-for="(item, index) of shopMobileList" :key="index">
        <div class="lv_title">{{mobileText[item.type]}}</div>
        <div class="lv_input lv_end_del">
          <input type="text" v-model="item.mobile" placeholder="请输入电话号码"/>
          <span class="lv_del_icon" @click="delMobile(item.type)"></span>
        </div>
      </div>
      <div class="lv_add_mobile" v-if="showMobileBtn">
        <span @click="addMobile(0)"><i class="lv_min_add_icon"></i>预约电话</span>
        <span @click="addMobile(2)"><i class="lv_min_add_icon"></i>服务电话</span>
      </div>

      <div class="lv_input_box">
        <div class="lv_title">营业时间</div>
        <div class="lv_input">
          <input type="text" v-model="queryList.mobile" placeholder="请输入电话号码"/>
        </div>
      </div>


      <div class="lv_title">行业</div>
      <div class="lv_input">
        <picker class="lv_picker" @change="changeInd" :value="ind" :range="indList.option">
          <input type="text" v-model="product_desc" disabled="true" placeholder="请选择行业"/>
        </picker>
      </div>
      <div class="lv_title">门店省市</div>
      <div class="lv_input">
        <picker class="lv_picker" mode="region" @change="changeRegion" :value="region">
          <input type="text" v-model="regionText" disabled placeholder="请选择门店省市"/>
        </picker>
      </div>
      <div class="lv_title">详细地址</div>
      <div class="lv_input">
        <input type="text" v-model="queryList.detailAddress" placeholder="请输入详细地址"/>
      </div>
      <div class="lv_title">位置坐标</div>
      <div class="lv_input" @click="onGetLocation">
        <input class="lv_picker" type="text" v-model="store_street" disabled placeholder="请选择店铺位置坐标"/>
      </div>
      <div class="lv_title">位置备注</div>
      <div class="lv_input">
        <input type="text " v-model="queryList.addressMarks" placeholder="请输入店铺位置备注（非必填）"/>
      </div>
      <div class="lv_text">例：国际会展中心路口北400米。</div>
      <div class="lv_text" style="color: #E56B65; text-align: center; margin-top: 40rpx; font-weight: bold;">
        *以上资料设置后无法由商家自主修改，请仔细核对
      </div>
    </div>

    <div class="lv_pop_up_box">

    </div>

    <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
  </view>
</template>

<script>
  import uploadComponent from './../../../components/uploadfile'
  import validate from '../../../utils/validate'
  import { mobile } from '../../../utils/verify'

  export default {
    name: 'lv_detail',
    data () {
      return {
        queryList: {
          companyId: '', // (string, optional): 企业id ,
          id: '', // (string, optional): id ,
          image: '', // (string): 店铺logo ,
          introduce: '', // (string, optional): 店铺介绍 ,
          mobile: '', // (string): 店铺电话 ,
          notice: '', // (string, optional): 店铺标语 ,
          shopLabelList: [], // (Array[InsertShopLabelDTO]): 服务设施 ,
          shopMobileList: [], // (Array[InsertShopMobileDTO], optional): 服务电话、售后电话或其他电话 ,
          time: '', // (string): 营业时间 格式（营业开始时间-营业结束时间） ,
          workDateList: [] // (Array[InsertWorkDateDTO]): 营业时间 周期
        },
        rule: {
          image: { required: true, message: '店铺logo必须的' }, // (string): 店铺logo ,
          mobile: { required: true, validator: mobile }, // (string): 店铺电话 ,
          introduce: '', // (string, optional): 店铺介绍 ,
          shopLabelList: '', // (Array[InsertShopLabelDTO]): 服务设施 ,
          shopMobileList: '', // (Array[InsertShopMobileDTO], optional): 服务电话、售后电话或其他电话 ,
          time: '', // (string): 营业时间 格式（营业开始时间-营业结束时间） ,
          workDateList: [] // (Array[InsertWorkDateDTO]): 营业时间 周期
        },
        mobileText: {
          0: '服务电话',
          2: '其他电话'
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
    props: {
      query: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      query () {
        Object.assign(this.queryList, this.query)
      }
    },
    created () {
      Object.assign(this.queryList, this.query)
      this.initValidate()
      this.getShopType()
    },
    methods: {
      getImage (val) {
        this.queryList.image = val.fileurl
      }, // 获取上传的图片
      addMobile (type) {
        this.queryList.shopMobileList.push({
          type,
          mobile: ''
        })
      }, // 增加备用电话号码
      delMobile (type) {
        this.queryList.shopMobileList = this.queryList.shopMobileList.filter(item => item.type !== type)
      }, // 删除备用号码

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
            url: '/appequity/helperShop/insertShopOne',
            data: this.queryList
          }).then(res => {
            if (res.status === 200) {
              this.$emit('on-next', 1)
            } else {
              this.Toast(res.t.msg)
            }

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
      },
      showMobileBtn () {
        return this.queryList.shopMobileList.length < 2
      },
      shopMobileList () {
        return this.queryList.shopMobileList
      }
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import "./../../../styles/lv_style.less";

  .lv_detail {
    height: 100%;
    width: 100%;
    position: relative;

    .lv_center {
      padding: unit(1, rpx) unit(40, rpx) 0;

      .lv_up_logo_box {
        display: flex;
        justify-content: space-between;
        padding-top: unit(40, rpx);

        .lv_title {
          margin-top: 0;
        }
      }

      .lv_add_mobile {
        padding-left: unit(136, rpx);
        margin-top: unit(16, rpx);
        display: flex;

        span {
          height: unit(56, rpx);
          width: unit(168, rpx);
          font-size: unit(24, rpx);
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          border: 1px solid rgba(232, 232, 232, 1);
          border-radius: unit(8, rpx);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: unit(24, rpx);
        }
      }
    }
  }
</style>
