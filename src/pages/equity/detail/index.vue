<template>
  <view class="lv_shops_box">
    <lv-speed :index="1"></lv-speed>
    <view class="lv_content_box">
      <div class="lv_price_box">
        <span>商品原价</span>
        <span>1000元</span>
      </div>

      <view class="lv_content">
        <div class="lv_tab_box">
          <div class="lv_tab">
            <span
              v-for="(item, index) of equityList"
              :class="{'lv_pitch_on': index === equityIndex}"
              @click="equityIndex = index"
            >{{'方案' + numZh[index]}}</span>

            <span class="lv_end_add_icon" @click="addBtn('box')"><i class="lv_min_add_icon"></i></span>
          </div>
        </div>

        <div class="lv_center" v-for="(item, index) of equityList" :key="item" v-if="equityIndex === index">
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
                <input type="text" v-model="item.sizeObject.two" disabled placeholder="请选择"/>
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
          <div class="lv_title">折扣力度</div>

          <div class="lv_title lv_title_down_icon">限制设置</div>


        </div>
        <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">下一步</div>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../../components/speed'
  import validate from '../../../utils/validate'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        WxValidate: null,
        queryList: {
          equityDetailDTOS: [
            {
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
              sizeObject: {
                one: null,
                two: '天',
                three: null
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
          countList: []
        },
        index: 0,
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
      this.initValidate()
    },
    methods: {
      initValidate () {
        this.WxValidate = new validate({
          /* equityImage: { required: true, message: '权益图片是必须的' },
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
          } */
        })
      },
      submit () {
        this.WxValidate.checkForm(this.queryList).then(res => {
          console.log(res)
        })
      },
      onPicker (e, type, index) {
        switch (type) {
          case 'day':
            this.queryList.equityDetailDTOS[index].sizeObject['two'] = this.options.days[e.mp.detail.value]
            break
          case 'cont':
            this.queryList.equityDetailDTOS[index].sizeObject['three'] = this.options.countList[e.mp.detail.value]
            break
        }

        console.log(e)
        console.log(type)
      },
      delBtn (type, e) {
        switch (type) {
          case 'box':
            this.equityIndex = e - 1
            this.queryList.equityDetailDTOS.splice(e, 1)
            break
        }
      },
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
      }

    },
    components: {
      LvSpeed
    },
    computed: {
      getNext () {
        return this.WxValidate.ext(this.queryList)
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
      }
    }
  }
</style>
