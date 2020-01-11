<template>
  <view class="lv_shops_box">
    <lv-speed :index="1"></lv-speed>
    <view class="lv_content_box">
      <div class="lv_price_box" v-if="price">
        <span>商品原价</span>
        <span>{{price}} 元</span>
      </div>

      <view class="lv_content">
        <!-- 顶部切换部分 -->
        <div class="lv_tab_box">
          <div class="lv_tab">
            <span
              v-for="(item, index) of equityList"
              :class="{'lv_pitch_on': index === equityIndex}"
              @click="equityIndex = index"
              :key="index"
            >{{'方案' + numZh[index]}}</span>

            <span class="lv_end_add_icon" @click="addBtn('box')"><i class="lv_min_add_icon"></i></span>
          </div>
        </div>
        <!-- 内容设置部分 -->
        <div class="lv_center" v-for="(item, index) of equityList" :key="index" v-if="equityIndex === index">
          <!-- 消费频次部分 -->
          <div class="lv_title" style="margin-top: 40rpx;">
            消费频次
            <span @click="delBtn('box', index)" v-if="index > 0"><i class="lv_del_icon"></i>删除本方案</span>
          </div>
          <div class="lv_expense_num">
            <div class="lv_input">
              <input type="text" v-model="item.sizeObject.one" placeholder="请输入"/>
            </div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'day', index)"
                :range="options.days"
              >
                <input type="number" v-model="item.sizeObject.two" disabled placeholder="请选择"/>
              </picker>
            </div>
            <span>内消费</span>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'cont', index)"
                :range="options.countList"
              >
                <input type="text" v-model="item.sizeObject.three" disabled placeholder="请选择"/>
              </picker>
            </div>
            <span>次</span>
          </div>
          <!-- 折扣部分头部 -->
          <div class="lv_title">
            折扣力度
            <span
              v-if="item.sizeObject.three > 6 && item.sizeObject.three !== '不限'"
              @click="cutBtn('boxCut', index, !item.cut)"
              style="color: #118CFD;"><i
              class="lv_del_icon"></i>{{!item.cut ? '快捷设置' : '按次设置'}}</span>
          </div>
          <!-- 折扣设置 -->
          <vigor
            :value="item.equityCountDTOS"
            :cut-status="item.cut"
            :count="item.sizeObject.three"
            :box-index="numZh[index]"
            :price="price"
            ref="vigor"
          />
          <!-- 限制设置 -->
          <div
            :class="['lv_title', 'lv_title_down_icon', {'lv_open': item.openLimit}]"
            @click="cutBtn('openLimit', index, !item.openLimit)">限制设置
          </div>
          <div :class="['lv_down_box', {'lv_open': item.openLimit}]">
            <div class="lv_title">客户最低履约等级</div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'level', index)"
                :range="options.level"
              >
                <input type="text" :value="options.level[item.level - 1]" disabled placeholder="请选择"/>
              </picker>
            </div>
            <div class="lv_title">客户最低履约等级</div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'integral', index)"
                :range="options.integral"
              >
                <input type="text" :value="options.integral[options.integralText[item.integral]]" disabled
                       placeholder="请选择"/>
              </picker>
            </div>
            <div class="lv_title">客户发起解约时</div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'rescissionStatus', index)"
                :range="options.rescissionStatus"
              >
                <input type="text" :value="options.rescissionStatus[item.rescissionStatus]" disabled
                       placeholder="请选择"/>
              </picker>
            </div>
            <div class="lv_title">客户发起延期时</div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'delayStatus', index)"
                :range="options.delayStatus"
              >
                <input type="text" :value="options.delayStatus[item.delayStatus]" disabled
                       placeholder="请选择"/>
              </picker>
            </div>
            <div class="lv_title">领取数量上限</div>
            <div class="lv_input">
              <input type="text" v-model="item.number" placeholder="请输入领取数量上限(非必填)"/>
            </div>
            <div class="lv_title">领取截止时间</div>
            <div class="lv_input lv_time">
              <picker
                class="lv_picker"
                mode="date"
                @change="onPicker($event, 'date', index)"
              >
                <input type="text" :value="item.activityTime.date" disabled
                       placeholder="请选择"/>
              </picker>
              <picker
                class="lv_picker lv_p_end"
                mode="time"
                @change="onPicker($event, 'time', index)"
              >
                <input type="text" :value="item.activityTime.time" disabled
                       placeholder="请选择"/>
              </picker>
            </div>
            <div class="lv_title">勋章限制</div>
            <div class="lv_input">
              <picker
                class="lv_picker"
                @change="onPicker($event, 'medalLevel', index)"
                :range="options.medalLevel"
              >
                <input
                  type="text"
                  :value="options.medalLevelText[item.medalLevel]" disabled
                  placeholder="暂无设置（非必填）"
                />
              </picker>
            </div>
          </div>
        </div>
        <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../../components/speed'
  import validate from '../../../utils/validate'
  import vigor from './vigor'
  import { forEachs } from '../../../utils'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        WxValidate: null,
        queryList: {
          equityDetailDTOS: [
            {
              cut: false, // cut (true) 表示开启快捷设置
              openLimit: false, // true 表示打开限制设置
              activityTime: {
                date: '',
                time: ''
              }, // (string, optional): 权益活动截止时间 ,
              delayStatus: 0, // (integer, optional): 延期状态0发起自动通过1发起需要商户统一 ,
              equityCountDTOS: [
                /* {
                   discount: '', // (number, optional): 折扣 ,
                   price: '', // (number, optional): 折扣后价格 ,
                   size: '', // (integer, optional): 权益使用次数默认0 ,
                   weight: '' // (integer, optional): 顺序
                 } */
              ], // (Array[权益明细次数入场封装], optional),
              equityId: '', // (string, optional): 权益主表id ,
              integral: 100, // (integer, optional): 履约积分要求 ,
              level: 1, // (integer, optional): 履约等级要求 ,
              medalLevel: '', // (integer, optional): 勋章要求0表示无要求1表示必须是A级纳税企业 ,
              number: null, // (integer, optional): 领取数量上限 ,
              realNumber: null, // (integer, optional): 实际领取数量 ,
              rescissionStatus: 0, // (integer, optional): 解约状态0发起自动解约1发起需要商户统一当次数不限次数时默认0 ,
              size: '', // (string, optional): 权益消费周期 譬如：一個月3次 ,
              sizeObject: {
                one: null,
                two: '天',
                three: ''
              }, // (object, optional),
              status: '', // (integer, optional): 权益履约方案状态 0未变更 1已变更 -1不可领取 ,
              weight: '' // (integer, optional): 权益明细顺序
            }
          ], // (Array[商户添加权益明细入参参数封装], optional),
          id: '', // (string, optional): 权益id ,
          shopId: '' // (string, optional): 店铺id
        },
        equityIndex: 0,
        numZh: { 0: '一', 1: '二', 2: '三', 3: '四', 4: '五', 5: '六', 6: '七', 7: '八', 8: '九', 9: '十' },
        options: {
          days: ['天', '个月'],
          countList: [],
          level: ['履约等级1'],
          integral: ['履约积分100'],
          integralText: { 100: 0 },
          rescissionStatus: ['可以立即自动解约', '需要我同意才可以解约'],
          delayStatus: ['可以立即延期总时长的20%', '需要我同意才可以延期总时长的20%'],
          medalLevel: ['纳税A级企业专属优惠（暂未开放）'],
          medalLevelText: { 1: '纳税A级企业专属优惠（暂未开放）' }
        },
        price: 100, // 商品原价

        BTime: null
      }
    },
    onLoad (query) {
      let list = ['不限']
      for (let i = 2; i <= 50; i++) {
        list.push(i)
      }
      this.options.countList = list

      Object.assign(this.queryList, {
        shopId: query.shopId,
        id: query.shopId
      })
      // this.initValidate()
    },
    methods: {
      initValidate () {
        let rule = {}
        let list = this.queryList.equityDetailDTOS
        forEachs(list, (item, index) => {
          let countDTOS = {}
          forEachs(item.equityCountDTOS, (child, k) => {
            countDTOS[k] = {
              type: 'object',
              fields: {
                discount: {
                  required: true,
                  validator: (rules, value, callback) => {
                    if (!value && value !== 0) {
                      callback(new Error(`方案${this.numZh[index]} 的有未填写的折扣`))
                    } else if (!OneToNine.test(value)) {
                      callback(new Error(`方案${this.numZh[index]} 的有不合理的折扣`))
                    } else {
                      callback()
                    }
                  }
                }
              }
            }
          })

          rule[index] = {
            type: 'object',
            fields: {
              sizeObject: {
                required: true,
                type: 'object',
                fields: {
                  one: {
                    required: true,
                    validator: (rules, value, callback) => {
                      if (!value) {
                        callback(new Error(`${item.sizeObject.two === '天' ? '天数' : '月数'}是必须的`))
                      } else if (value < 1) {
                        callback(new Error(`${item.sizeObject.two === '天' ? '天数' : '月数'}不能小于1`))
                      } else {
                        callback()
                      }
                    }
                  },
                  two: { required: true, message: '单位是必须的' },
                  three: { required: true, message: '次数是必须的' }
                }
              }, // (object, optional),
              delayStatus: { required: true, type: 'number', message: '客户发起延期时是必选的' }, // (integer, optional): 延期状态0发起自动通过1发起需要商户统一 ,
              equityCountDTOS: { required: true, type: 'array', fields: countDTOS }, // (Array[权益明细次数入场封装], optional),
              integral: { required: true, type: 'number', message: '履约积分要求是必须的' }, // (integer, optional): 履约积分要求 ,
              level: { required: true, type: 'number', message: '履约积分要求是必须的' }, // (integer, optional): 履约等级要求 ,
              rescissionStatus: { required: true, type: 'number', message: '客户发起解约时是必须的' } // (integer, optional): 解约状态0发起自动解约1发起需要商户统一当次数不限次数时默认0 ,

            }
          }
        })
        this.WxValidate = new validate(rule)
      },
      submit () {
        this.initValidate()
        console.log(this.queryList.equityDetailDTOS)
        this.WxValidate.checkForm(this.queryList.equityDetailDTOS).then(() => {
          this.$refs.vigor[0].vali().then(res => {
            console.log(res)
          })
        })
      },
      onPicker (e, type, index) {
        switch (type) {
          case 'day':
            this.queryList.equityDetailDTOS[index].sizeObject['two'] = this.options.days[e.mp.detail.value]
            break
          case 'cont':
            let val = this.options.countList[e.mp.detail.value]
            let obj = {
              sizeObject: {},
              cut: false,
              equityCountDTOS: []
            }
            Object.assign(obj.sizeObject, this.queryList.equityDetailDTOS[index].sizeObject)
            obj.sizeObject['three'] = val.toString()
            if (val === '不限') {
              obj.cut = true
              obj.equityCountDTOS = [
                {
                  discount: '', // (number, optional): 折扣 ,
                  price: '', // (number, optional): 折扣后价格 ,
                  size: '', // (integer, optional): 权益使用次数默认0 ,
                  weight: '' // (integer, optional): 顺序
                }
              ]
            } else {
              obj.cut = false
              for (let i = 0; i < val; i++) {
                obj.equityCountDTOS.push({
                  discount: '', // (number, optional): 折扣 ,
                  price: '', // (number, optional): 折扣后价格 ,
                  size: 1, // (integer, optional): 权益使用次数默认0 ,
                  weight: i + 1 // (integer, optional): 顺序
                })
              }
            }
            Object.assign(this.queryList.equityDetailDTOS[index], obj)
            break
          case 'level':
            this.queryList.equityDetailDTOS[index].level = e.mp.detail.value + 1
            break
          case 'integral':
            this.queryList.equityDetailDTOS[index].integral = { 0: 100 }[e.mp.detail.value]
            break
          case 'rescissionStatus':
            this.queryList.equityDetailDTOS[index].rescissionStatus = e.mp.detail.value
            break
          case 'delayStatus':
            this.queryList.equityDetailDTOS[index].delayStatus = e.mp.detail.value
            break
          case 'date':
            this.queryList.equityDetailDTOS[index].activityTime.date = e.mp.detail.value
            break
          case 'time':
            this.queryList.equityDetailDTOS[index].activityTime.time = e.mp.detail.value
            break
          case 'medalLevel':
            this.queryList.equityDetailDTOS[index].medalLevel = e.mp.detail.value + 1
            break
        }

        console.log(e)
        console.log(type)
      }, // 下拉选中
      delBtn (type, e) {
        switch (type) {
          case 'box':
            this.equityIndex = e - 1
            this.queryList.equityDetailDTOS.splice(e, 1)
            break
        }
      }, // 删除按钮
      addBtn (type) {
        switch (type) {
          case 'box':
            this.queryList.equityDetailDTOS.push({
              activityTime: '', // (string, optional): 权益活动截止时间 ,
              delayStatus: '', // (integer, optional): 延期状态0发起自动通过1发起需要商户统一 ,
              equityCountDTOS: [
                {
                  discount: '', // (number, optional): 折扣 ,
                  price: '', // (number, optional): 折扣后价格 ,
                  size: '', // (integer, optional): 权益使用次数默认0 ,
                  weight: '' // (integer, optional): 顺序
                }
              ], // (Array[权益明细次数入场封装], optional),
              equityId: '', // (string, optional): 权益主表id ,
              integral: '', // (integer, optional): 履约积分要求 ,
              level: '', // (integer, optional): 履约等级要求 ,
              medalLevel: '', // (integer, optional): 勋章要求0表示无要求1表示必须是A级纳税企业 ,
              number: '', // (integer, optional): 领取数量上限 ,
              realNumber: '', // (integer, optional): 实际领取数量 ,
              rescissionStatus: '', // (integer, optional): 解约状态0发起自动解约1发起需要商户统一当次数不限次数时默认0 ,
              size: '', // (string, optional): 权益消费周期 譬如：一個月3次 ,
              sizeObject: {}, // (object, optional),
              status: '', // (integer, optional): 权益履约方案状态 0未变更 1已变更 -1不可领取 ,
              weight: '' // (integer, optional): 权益明细顺序
            })
            break
        }
      }, // 新增按钮
      cutBtn (type, index, status) {
        switch (type) {
          case 'boxCut':
            this.queryList.equityDetailDTOS[index].cut = status
            break
          case 'openLimit':
            this.queryList.equityDetailDTOS[index][type] = status
            console.log(this.queryList.equityDetailDTOS[index][type])
            break
        }
      } // 快捷切换
    },
    components: {
      LvSpeed,
      vigor
    },
    computed: {
      getNext () {
        this.initValidate()
        return this.WxValidate.ext(this.queryList.equityDetailDTOS)
      },
      equityList () {
        return this.queryList.equityDetailDTOS
      }
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import url('./../../../styles/lv_style.less');

  .lv_shops_box {
    .lv_price_box {
      display: flex;
      justify-content: space-between;
      color: #fff;
      font-size: unit(32, rpx);
      margin-bottom: unit(32, rpx);
    }

    .lv_content {
      height: 100%;
      width: 100%;
      position: relative;

      .lv_tab_box {
        width: 100%;

        .lv_tab {
          display: flex;
          align-items: center;
          overflow-x: auto;
          border-bottom: 1px solid #E8E8E8;
          padding-right: unit(60, rpx);

          span {
            display: inline-block;
            padding: unit(24, rpx) unit(50, rpx);
            font-size: unit(28, rpx);
            color: #333;
            font-weight: bold;
            white-space: nowrap;

            &.lv_pitch_on {
              position: relative;
              color: #118CFD;

              &::before {
                content: '';
                height: unit(1, rpx);
                width: unit(84, rpx);
                background: #118CFD;
                position: absolute;
                bottom: unit(1, rpx);
                left: unit(48, rpx);
                z-index: 10;
              }
            }

            &.lv_end_add_icon {
              padding: unit(24, rpx) unit(24, rpx);
              display: flex;
              align-items: center;
            }
          }


        }

      }

      .lv_center {
        padding: 0 unit(40, rpx);

        .lv_title {
          margin-top: unit(40, rpx);
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-size: unit(22, rpx);
            color: #999;
            font-weight: normal;
            display: flex;
            align-items: center;
          }

          &.lv_title_down_icon {
            &::after {
              transition: all .3s;
            }

            &.lv_open {
              &::after {
                transform: rotate(-90deg);
              }
            }
          }
        }

        .lv_expense_num {
          display: flex;
          align-items: center;
          margin: 0 unit(-10, rpx);

          .lv_input {
            padding: 0 unit(10, rpx);

            .lv_picker::before {
              transform: rotate(90deg);
            }
          }

          span {
            white-space: nowrap;
            padding: 0 unit(10, rpx);
            font-size: unit(28, rpx);
          }
        }

        .lv_vigor_box {
          max-height: unit(500, rpx);
          margin-top: unit(15, rpx);
          box-sizing: border-box;
          overflow-y: auto;

          .lv_vigor_num, .lv_vigor_cut {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: unit(28, rpx);
            color: #333;
            padding: unit(10, rpx) 0;

            .lv_num_left, .lv_cut_left {
              width: 50%;
              display: flex;
              align-items: center;

              .lv_input {
                width: unit(96, rpx);
                margin-left: unit(24, rpx);
                margin-right: unit(10, rpx);
              }

              span {
                white-space: nowrap;
              }

              .lv_picker::before {
                transform: rotate(90deg);
              }
            }

            .lv_cut_left {
              width: 80%;

              .lv_input.lv_cut_input {
                width: unit(136, rpx);
              }
            }
          }
        }

        .lv_down_box {
          transition: all .3s;
          overflow: hidden;
          height: unit(0, rpx);

          &.lv_open {
            height: unit(1190, rpx);
          }

          .lv_time {
            display: flex;

            .lv_picker {
              flex: 1;

              &::before {
                transform: rotate(90deg);
              }
            }

            .lv_p_end {
              margin-left: unit(20, rpx);
              flex: 0.6;
              width: 30%;
            }
          }
        }
      }
    }
  }
</style>
