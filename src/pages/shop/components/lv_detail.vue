<template>
  <view class="lv_detail">
    <button @click="aa">dianji</button>
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
        <div class="lv_input lv_end_arrows" @click="openPopup('day')">
          <input type="text" disabled v-model="daysText" placeholder="请选择营业时间"/>
        </div>
      </div>
      <div class="lv_add_mobile lv_time_box">
        <div class="lv_input">
          <picker class="lv_picker" mode="time" @change="getTime($event, 'B')">
            <input type="text" v-model="BTime" disabled placeholder="开始时间"/>
          </picker>
        </div>
        <div class="lv_line">-</div>
        <div class="lv_input">
          <picker class="lv_picker" mode="time" @change="getTime($event, 'E')">
            <input type="text" v-model="ETime" disabled placeholder="结束时间"/>
          </picker>
        </div>
      </div>


      <!--<div class="lv_title">行业</div>
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
      </div>-->
    </div>

    <bgfilter :show="popup === 'day'" @click="onClose"/>

    <div :class="['lv_fixed_bottom_box', {'lv_show_popup': popup === 'day'}]">
      <div class="lv_popup_title">
        <div class="cancel" @click="onClose">取消</div>
        <div class="title">选择营业时间</div>
        <div class="determine" @click="onOk('day')">确定</div>
      </div>
      <div class="lv_popup_center">
        <div :class="['lv_one_day', {'lv_pitch_on': allDays}]" @click="getDays('all')">每天</div>
        <div class="lv_one_day_list">
          <span
            :class="{'lv_pitch_on': item.pitchOn}"
            v-for="item of oneDay"
            :key="item.dateId"
            @click="getDays(item)"
          >{{item.name}}</span>
        </div>
      </div>
    </div>

    <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
  </view>
</template>

<script>
  import uploadComponent from './../../../components/uploadfile'
  import validate from '../../../utils/validate'
  import { mobile } from '../../../utils/verify'
  import bgfilter from '../../../components/bgfilter'

  export default {
    name: 'lv_detail',
    data () {
      return {
        queryList: {
          companyId: '', // (string, optional): 企业id ,
          id: '', // (string, optional): id ,
          image: '1232', // (string): 店铺logo ,
          introduce: '', // (string, optional): 店铺介绍 ,
          mobile: '', // (string): 店铺电话 ,
          notice: '', // (string, optional): 店铺标语 ,
          shopLabelList: [], // (Array[InsertShopLabelDTO]): 服务设施 ,
          shopMobileList: [], // (Array[InsertShopMobileDTO], optional): 服务电话、售后电话或其他电话 ,
          time: [], // (string): 营业时间 格式（营业开始时间-营业结束时间） ,
          workDateList: [] // (Array[InsertWorkDateDTO]): 营业时间 周期
        },
        rule: {
          image: { required: true, message: '店铺logo必须的' }, // (string): 店铺logo ,
          mobile: { required: true, validator: mobile }, // (string): 店铺电话 ,
          workDateList: { required: true, type: 'array', message: '营业时间是必须的' }, // (Array[InsertWorkDateDTO]): 营业时间 周期
          time: { required: true, type: 'array', min: 2, message: '开始/结束时间是必须的' }, // 营业时间 格式（营业开始时间-营业结束时间）
          introduce: '', // (string, optional): 店铺介绍 ,
          shopLabelList: '', // (Array[InsertShopLabelDTO]): 服务设施 ,
          shopMobileList: '' // (Array[InsertShopMobileDTO], optional): 服务电话、售后电话或其他电话 ,
        },
        mobileText: {
          0: '服务电话',
          2: '其他电话'
        },
        popup: '',
        dayList: [
          {
            dateId: 1,
            name: '周一'
          },
          {
            dateId: 2,
            name: '周二'
          },
          {
            dateId: 3,
            name: '周三'
          },
          {
            dateId: 4,
            name: '周四'
          },
          {
            dateId: 5,
            name: '周五'
          },
          {
            dateId: 6,
            name: '周六'
          },
          {
            dateId: 7,
            name: '周日'
          }
        ],
        allDays: false,
        daysText: '',
        BTime: '',
        ETime: '',

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
      getDays (type) {
        if (type === 'all') {
          this.allDays = !this.allDays
          this.queryList.workDateList = []
        } else {
          this.allDays = false
          this.queryList.workDateList.push(type)
        }
      }, // 获取每天数据
      onClose () {
        this.popup = ''
      }, // 点击弹窗取消
      onOk (type) {
        this.onClose()
        switch (type) {
          case 'day':
            if (this.allDays) {
              this.daysText = '每天'
            } else {
              this.daysText = this.queryList.workDateList.map(item => item.name).join('，')
            }
            break
          case 'cc':
            break
        }
      }, // 点击弹窗确认键
      openPopup (type) {
        this.popup = type
      }, // 打开弹窗
      getTime (e, type) {
        this.queryList.time[type === 'B' ? 0 : 1] = e.mp.detail.value
        let time = this.queryList.time
        this.BTime = time[0]
        this.ETime = time[1]
      }, // 点击确定获取时间


      close () {
        console.log('c')
      },
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
      uploadComponent,
      bgfilter
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
      },
      oneDay () {
        let on = this.queryList.workDateList.map(item => item.name)
        return this.dayList.map(item => {
          item.pitchOn = on.includes(item.name)
          return item
        })
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

        &.lv_time_box {
          align-items: center;

          .lv_line {
            margin: 0 unit(18, rpx);
            color: #333;
          }

          .lv_picker::before {
            transform: rotate(90deg);
          }
        }
      }
    }

    .lv_popup_center {
      .lv_one_day {
        height: unit(80, rpx);
        line-height: unit(80, rpx);
        text-align: center;
        background: #fff;
        border-radius: unit(8, rpx);
        font-weight: bold;
        font-size: unit(28, rpx);
      }

      .lv_pitch_on {
        background: #E8F4FF !important;
        color: #118CFD;
      }

      .lv_one_day_list {
        padding: unit(40, rpx) 0;
        margin: 0 unit(-8, rpx);

        span {
          width: unit(160, rpx);
          height: unit(80, rpx);
          display: inline-block;
          background: #fff;
          border-radius: unit(8, rpx);
          line-height: unit(80, rpx);
          text-align: center;
          font-weight: bold;
          font-size: unit(28, rpx);
          margin: unit(8, rpx);
        }
      }
    }
  }
</style>
