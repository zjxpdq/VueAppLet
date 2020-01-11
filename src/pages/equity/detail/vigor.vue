<template>
  <div class="lv_vigor_box">
    <!-- 按次设置 -->
    <div
      class="lv_vigor_num"
      v-if="!cutStatus"
      v-for="(num, numIndex) of value"
      :key="numIndex"
    >
      <div class="lv_num_left">
        <span>第<em>{{numIndex + 1}}</em>次：</span>
        <div class="lv_input">
          <input type="number" @change="keyupUnt(numIndex, num.discount)" v-model="num.discount" placeholder="请输入"/>
        </div>
        <span>折</span>
      </div>
      <div class="lv_num_right" v-if="price">{{num.price || 0}} 元</div>
    </div>

    <!-- 快捷设置 -->
    <div
      class="lv_vigor_cut"
      v-if="cutStatus"
      v-for="(item, index) of cutDomList"
      :key="index"
    >
      <div class="lv_cut_left">
        <span>第<em>{{item.B}}</em>次 - </span>
        <div class="lv_input lv_cut_input">
          <picker
            class="lv_picker"
            @change="onPicker($event, index, options[index])"
            :range="options[index]"
            v-if="index < 2"
          >
            <input type="text" :value="item.E ? '第' + item.E + '次' : ''" disabled placeholder="请选择">
          </picker>
          <input v-if="index >= 2" type="text" :value="item.E ? item.E : ''" disabled placeholder="请选择">
        </div>
        <div class="lv_input">
          <input type="text" v-model="item.discount" @change="keyupUnt(index, item.discount, 'cut')" placeholder="请输入"/>
        </div>
        <span>折</span>
      </div>
      <div class="lv_num_right" v-if="price">{{item.price || 0}} 元</div>
    </div>
  </div>
</template>

<script>

  import { countRate, deepClone, forEachs } from '../../../utils'
  import validate from '../../../utils/validate'

  const OneToNine = /^[1-9](\.\d{1})?$/

  export default {
    name: 'vigor',
    data () {
      return {
        item: {
          discount: '', // (number, optional): 折扣 ,
          price: '', // (number, optional): 折扣后价格 ,
          size: '', // (integer, optional): 权益使用次数默认0 ,
          weight: '' // (integer, optional): 顺序
        },
        cutDomList: [
          {
            B: '1',
            E: '',
            price: '',
            discount: ''
          }
        ],
        options: {
          0: []
        },
        newValue: []
      }
    },
    props: {
      value: Array,
      cutStatus: Boolean, // 快捷设置还是次数设置
      count: [Number, String], // 总条数
      price: [Number, String], // 商品原价
      boxIndex: String // 方案几
    },
    watch: {
      count () {
        if (this.cutStatus) {
          this.cutInit()
        }
      },
      cutStatus (to) {
        if (to) {
          this.cutInit()
        }
      },
      value: {
        handler (to) {
          let flag = false
          if (to) {
            forEachs(to, item => {
              if (item.size && item.size !== 1) {
                flag = true
                return false
              }
            })
            if (flag) {
              console.log(flag)
              this.cutInit('init')
            }
          }
        },
        deep: true
      },
      cutDomList: {
        handler () {
          if (this.cutStatus) {
            let list = deepClone(this.cutDomList)
            let newList = []
            forEachs(list, (item, i) => {
              if (!item.E) {
                this.Toast(`方案${this.boxIndex} 的快捷设置有未选择结尾次数，请核查！`)
              }
              newList[i] = {
                discount: item.discount, // (number, optional): 折扣 ,
                price: item.price, // (number, optional): 折扣后价格 ,
                size: i <= 1 ? item.E - item.B + 1 : this.count === '不限' ? -1 : this.count - item.B + 1, // (integer, optional): 权益使用次数默认0 ,
                weight: i + 1 // (integer, optional): 顺序
              }
              /* Object.assign(this.newValue[i], {
                 discount: item.discount, // (number, optional): 折扣 ,
                 price: item.price, // (number, optional): 折扣后价格 ,
                 size: i <= 1 ? item.E - item.B + 1 : this.count === '不限' ? -1 : this.count - item.B + 1, // (integer, optional): 权益使用次数默认0 ,
                 weight: i + 1 // (integer, optional): 顺序
               }) */
            })
            this.newValue = newList
          }
        },
        deep: true
      }
    },
    methods: {
      keyupUnt (index, discount, type) {
        if (!discount && discount !== 0) {
          this.Toast('折扣是必须的')
        } else if (!OneToNine.test(discount)) {
          this.Toast('请输入合理的折扣')
        } else if (!this.price) {
          return false
        } else if (type === 'cut') {
          this.cutDomList[index].price = countRate(this.price, discount)
        } else {
          this.newValue[index].price = countRate(this.price, discount)
        }
      }, // 获取折后价格
      cutInit (type) {
        this.cutDomList = [{ B: '1', E: '', price: '', discount: '' }] // 初始化快捷设置项
        this.options = { 0: [] } // 初始化所有下拉选择项
        if (type === 'init') {
          let list = this.value
          forEachs(list, (item, i) => {
            if (i < 2) {
              this.getOptions(i)
            }
            Object.assign(this.cutDomList[i], {
              B: i === 0 ? '1' : list[0].size + 1,
              E: i === 0 ? item.size : i === 2 ? this.count : list[i - 1].size + 1,
              price: countRate(this.price, item.discount),
              discount: item.discount
            })
          })
        } else {
          this.getOptions(0)
        }

      }, // 初始化快捷设置
      onPicker (e, index, list) {
        /**
         * e: event 事件
         * index: 快捷设置项的下标
         * list: 下拉选择项列表
         */
        let val = list[e.mp.detail.value] // 获取选中的值
        let count = this.count === '不限' ? 50 : this.count // 获取总条数
        this.cutDomList[index].E = val // 把选中的值赋给 E
        if (val < count && index < 2) {
          if (this.cutDomList[index + 1]) {
            this.cutDomList[index + 1].B = val + 1
            this.cutDomList[index + 1].E = index === 1 ? '及以上' : ''
            this.cutDomList = this.cutDomList.filter((item, i) => i <= index + 1)
          } else {
            this.cutDomList.push({
              B: val + 1,
              E: index === 1 ? '及以上' : '',
              price: '',
              discount: ''
            })
          }
          this.getOptions(index + 1, val + 1)
        } else if (this.cutDomList.length - 1 > index) {
          this.cutDomList = this.cutDomList.filter((item, i) => i <= index)
        }
      }, // 下拉选中
      getOptions (type, b) {
        let arr = []
        let count = this.count === '不限' ? 50 : this.count
        switch (type) {
          case 0:
            for (let i = 2; i <= count; i++) {
              arr.push(i)
            }
            break
          case 1:
            for (let i = b + 1; i <= count; i++) {
              arr.push(i)
            }
            break
          case 2:
            for (let i = b + 1; i <= count; i++) {
              arr.push(i)
            }
            break
        }
        this.options[type] = arr
      }, // 获取下拉数据

      vali () {
        let rule = {}
        forEachs(this.newValue, (item, index) => {
          rule[index] = {
            type: 'object',
            fields: {
              discount: {
                required: true,
                validator: (rules, value, callback) => {
                  if (!value && value !== 0) {
                    callback(new Error(`方案${this.boxIndex} 的有未填写的折扣`))
                  } else if (!OneToNine.test(value)) {
                    callback(new Error(`方案${this.boxIndex} 的有不合理的折扣`))
                  } else {
                    callback()
                  }
                }
              }
            }
          }
        })
        let ctx = new validate(rule)
        return new Promise((resolve, reject) => {
          ctx.checkForm(this.newValue).then(() => {
            resolve(true)
          }).catch(() => {
            reject(false)
          })
        })
      }
    },
    components: {},
    computed: {
      /* newValue: {
        get: function () {
          return this.value
        },
        set: function (val) {
          this.$emit('input', val)
        }
      } */
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import url('./../../../styles/lv_style.less');

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

          em {
            display: inline-block;
            width: unit(40, rpx);
            text-align: center;
          }
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
</style>
