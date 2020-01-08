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
          <span class="lv_del_icon" @click="delMobile(item.mobile)"></span>
        </div>
      </div>
      <div class="lv_add_mobile" v-if="showMobileBtn">
        <span @click="addMobile(0)"><i class="lv_min_add_icon"></i>服务电话</span>
        <span @click="addMobile(2)"><i class="lv_min_add_icon"></i>其它电话</span>
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
      <div class="lv_title lv_title_end_btn">
        <span>服务设施</span>
        <em @click="openPopup('int')">自定义</em>
      </div>
      <div class="lv_int_list">
        <span
          v-for="(item, index) of intListDom"
          :key="index"
          :class="{'lv_pitch_on': item.pitchOn}"
          @click="intOperate('pitch', item.labelName)"
        >{{item.labelName}}</span>
      </div>
      <div class="lv_title">店铺标语</div>
      <div class="lv_input">
        <input type="text" v-model="queryList.notice" placeholder="请输入店铺标语（非必填）"/>
      </div>
      <div class="lv_text">例：新店开张，全场5折。</div>
      <div class="lv_title">店铺介绍</div>
      <div class="lv_input">
        <input type="text" v-model="queryList.introduce" placeholder="请输入店铺介绍"/>
      </div>
      <div class="lv_text">
        例：广州苏格拉邸酒店公寓位于广州市黄埔区大型商业中心敏捷广场（地铁21号线水西站），在黄埔区政府中心位置，地段繁华，距离宝能（广州）国际体育演艺中心1.5公里，距离万达广场只有一个地铁站（开车车程5分钟），附近有创业公园、儿童公园、市民广场、羊城八景“萝岗香雪公园”等，还有高德汇等大型商业中心。交通便利，地段繁华。本酒店致力于为顾客提供舒适、优雅、干净的休憩环境，非常适合商务出差、同伴出游及居家旅行居住，给顾客带来如同居家般的舒适感受！
      </div>
    </div>

    <bgfilter :show="popup === 'day' || popup === 'int'" @click="onClose"/>

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
            v-for="(item, index) of oneDay"
            :key="index"
            @click="getDays(item)"
          >{{item.name}}</span>
        </div>
      </div>
    </div>

    <div :class="['lv_fixed_bottom_box', {'lv_show_popup': popup === 'int'}]">
      <div class="lv_popup_title">
        <div class="cancel" @click="intOperate('close')">取消</div>
        <div class="title">自定义服务设施</div>
        <div class="determine" @click="intOperate('save')">保存</div>
      </div>
      <div class="lv_popup_center">
        <div class="lv_new_int">
          <div class="lv_input lv_end_del" v-for="(item, index) of newIntDom" :key="index" v-if="!item.del">
            <input type="text" v-model="item.labelName" placeholder="请输入服务设施"/>
            <span class="lv_del_icon" @click="intOperate('del', item.labelName)"></span>
          </div>
          <p @click="intOperate('new')"><em>+</em>添加新服务设施</p>
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
  import { deepClone, forEachs } from '../../../utils'

  export default {
    name: 'lv_detail',
    data () {
      const shopMobileList = (rule, value, callback) => {
        if (value.length > 0) {
          let text = ''
          value.forEach(item => {
            if (!/^[0-9\\-]{7,13}$/.test(item.mobile)) {
              text += `${this.mobileText[item.type]}不合法；`
            }
          })
          if (text) {
            callback(new Error(text))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
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
          time: [], // (string): 营业时间 格式（营业开始时间-营业结束时间） ,
          workDateList: [] // (Array[InsertWorkDateDTO]): 营业时间 周期
        },
        rule: {
          image: { required: true, message: '店铺logo必须的' }, // (string): 店铺logo ,
          mobile: { required: true, validator: mobile }, // (string): 店铺电话 ,
          shopMobileList: { required: true, type: 'array', validator: shopMobileList }, // (Array[InsertShopMobileDTO], optional): 服务电话、售后电话或其他电话
          workDateList: { required: true, type: 'array', message: '营业时间是必须的' }, // (Array[InsertWorkDateDTO]): 营业时间 周期
          time: { required: true, type: 'array', min: 2, message: '开始/结束时间是必须的' }, // 营业时间 格式（营业开始时间-营业结束时间）
          shopLabelList: [
            { required: true, type: 'array', message: '服务设施是必须的' },
            { min: 2, max: 12, type: 'array', message: '服务设施不能小于 2 项或大于 12 项' }
          ], // (Array[InsertShopLabelDTO]): 服务设施 ,,
          introduce: { required: true, message: '店铺介绍是必须的' } // (string, optional): 店铺介绍 ,
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
        intList: [],
        newInt: [],
        oldData: {},
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
      this.getIntList()
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
        this.queryList.shopMobileList = this.queryList.shopMobileList.filter(item => item.mobile !== type)
      }, // 删除备用号码
      getDays (type) {
        if (type === 'all') {
          this.allDays = !this.allDays
          this.queryList.workDateList = ['每天']
        } else {
          this.allDays = false
          this.queryList.workDateList.push(type)
        }
      }, // 获取每天数据
      onClose () {
        this.popup = ''
      }, // 点击弹窗取消
      onOk (type) {
        switch (type) {
          case 'day':
            this.onClose()
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
        if (type === 'int') {
          Object.assign(this.oldData, {
            intList: deepClone(this.intList),
            newInt: deepClone(this.newInt),
            shopLabelList: deepClone(this.queryList.shopLabelList)
          })
        }
        this.popup = type
      }, // 打开弹窗
      getTime (e, type) {
        this.queryList.time[type === 'B' ? 0 : 1] = e.mp.detail.value
        let time = this.queryList.time
        this.BTime = time[0]
        this.ETime = time[1]
      }, // 点击确定获取时间
      getIntList () {
        this.getRequest({
          url: '/appequity/helperShop/getSystemShopLabel',
          data: {}
        }).then(res => {
          if (res.status === 200) {
            this.intList = res.t
          }
        })
      }, // 获取服务设施
      intOperate (type, val) {
        let oldList = this.queryList.shopLabelList.map(item => item.labelName)
        switch (type) {
          case 'new':
            this.newInt.push({ labelName: '' })
            break
          case 'del':
            /* this.queryList.shopLabelList = this.queryList.shopLabelList.filter(item => item.labelName !== val)
             this.intList = this.intList.filter(item => item.labelName !== val) */
            this.newInt = this.newInt.map(item => {
              if (item.labelName === val) {
                item.del = true
              }
              return item
            })
            break
          case 'pitch':
            if (oldList.includes(val)) {
              this.queryList.shopLabelList = this.queryList.shopLabelList.filter(item => item.labelName !== val)
            } else {
              this.queryList.shopLabelList.push({ labelName: val })
            }
            break
          case 'save':
            let flag = false
            let delList = this.newInt.filter(item => item.del).map(item => item.labelName)
            this.queryList.shopLabelList = this.queryList.shopLabelList.filter(
              item => !delList.includes(item.labelName))
            this.intList = this.intList.filter(item => !delList.includes(item.labelName))
            this.newInt = this.newInt.filter(item => !delList.includes(item.labelName))

            let newList = this.newInt.filter(item => {
              if (!item.labelName) {
                flag = true
              }
              return !oldList.includes(item.labelName)
            })
            let is = [...new Set(newList.map(item => item.labelName))].length
            if (flag) {
              this.Toast('服务设施不能有空字符串')
            } else if (newList.length > is) {
              this.Toast('服务设施名称不能重复')
            } else {
              forEachs(newList, item => {
                this.queryList.shopLabelList.push(item)
                this.intList.push(item)
              })
              this.onClose()
            }
            break
          case 'close':
            this.intList = deepClone(this.oldData.intList)
            this.newInt = deepClone(this.oldData.newInt)
            this.queryList.shopLabelList = deepClone(this.oldData.shopLabelList)
            this.onClose()
            break
        }
      }, // 删除新增的服务设施
      initValidate () {
        this.WxValidate = new validate(this.rule)
      },
      submit () {
        if (this.allDays) {
          this.queryList.workDateList = deepClone(this.dayList).map(item => {
            return {
              dateId: item.dateId, // (string, optional): 周几 数字表示 ,
              name: item.name // (string, optional): 周几 文字表示
            }
          })
        }
        this.WxValidate.checkForm(this.queryList).then(() => {
          let params = deepClone(this.queryList)
          params.time = params.time.join(',')
          this.postRequest({
            url: '/appequity/helperShop/insertShopTwo',
            data: params
          }).then(res => {
            if (res.status === 200) {
              this.$emit('on-next', 2)
            } else {
              this.Toast(res.msg)
            }
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
      }, // 获取实时验证结果
      showMobileBtn () {
        return this.queryList.shopMobileList.length < 2
      }, // 显示隐藏电话按钮
      shopMobileList () {
        return this.queryList.shopMobileList
      }, // 返回电话列表
      oneDay () {
        let on = this.queryList.workDateList.map(item => item.name)
        return this.dayList.map(item => {
          item.pitchOn = on.includes(item.name)
          return item
        })
      }, // 获取天数
      intListDom () {
        let name = this.queryList.shopLabelList.map(item => item.labelName)
        return this.intList.map(item => {
          item.pitchOn = name.includes(item.labelName)
          return item
        })
      }, // 服务设施列表
      newIntDom () {
        return this.newInt
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

      .lv_title_end_btn {
        display: flex;
        justify-content: space-between;
        align-items: center;

        em:nth-child(2) {
          font-size: unit(24, rpx);
          font-weight: normal;
          color: #118CFD;
        }
      }

      .lv_int_list {
        margin-top: unit(14, rpx);
        margin-left: unit(-12, rpx);
        margin-right: unit(-12, rpx);

        span {
          display: inline-block;
          background: rgba(249, 249, 249, 1);
          border-radius: unit(8, rpx);
          padding: unit(15, rpx) unit(18, rpx);
          color: #333;
          font-size: unit(24, rpx);
          margin: unit(10, rpx) unit(12, rpx);
        }
      }
    }

    .lv_pitch_on {
      background: #E8F4FF !important;
      color: #118CFD !important;
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

      .lv_new_int {

        .lv_input {
          margin-right: unit(10, rpx);
        }

        p {
          margin-top: unit(24, rpx);
          padding-bottom: unit(40, rpx);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: unit(28, rpx);
          font-weight: 400;
          color: rgba(17, 140, 253, 1);

          em {
            font-size: unit(40, rpx);
          }
        }
      }
    }
  }
</style>
