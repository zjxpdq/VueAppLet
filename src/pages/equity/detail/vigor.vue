<template>
  <div class="lv_vigor_box">
    <!-- 按次设置 -->
    <div
      class="lv_vigor_num"
      v-if="!cutStatus"
      v-for="(num, index) of list"
      :key="index"
    >
      <div class="lv_num_left">
        <span>第<em>{{index + 1}}</em>次：</span>
        <div class="lv_input">
          <input type="number" @change="keyupUnt(index, num.discount)" v-model="num.discount" placeholder="请输入"/>
        </div>
        <span>折</span>
      </div>
      <div class="lv_num_right">{{num.price || '0.00'}} 元</div>
    </div>

    <!-- 快捷设置 -->
    <div
      class="lv_vigor_cut"
      v-if="cutStatus"
      v-for="(item, index) of list"
      :key="index"
    >
      <div class="lv_cut_left">
        <span>第<em>{{setText['B' + index]}}</em>次 - </span>
        <div class="lv_input lv_cut_input">
          <picker
            class="lv_picker"
            @change="onPicker($event, index, options[index])"
            :range="options[index]"
            v-if="setText['IS' + index]"
          >
            <input type="text" :value="item.size ? '第' + setText['E' + index] + '次' : ''" disabled placeholder="请选择">
          </picker>
          <input
            v-else type="text"
            :value="item.size ? item.size === -1 ?setText['E' + index] : '第' + setText['E' + index] + '次' : ''"
            disabled
            placeholder="请选择">
        </div>
        <div class="lv_input">
          <input
            type="text"
            v-model="item.discount"
            @change="keyupUnt(index, item.discount)"
            placeholder="请输入"/>
        </div>
        <span>折</span>
      </div>
      <div class="lv_num_right" v-if="price">{{item.price || '0.00'}} 元</div>
    </div>
  </div>
</template>

<script>

  import { countRate, deepClone, forEachs, isNumber } from '../../../utils'

  const OneToNine = /^[1-9](\.\d{1})?$/

  export default {
    name: 'vigor',
    data () {
      return {
        cutDomList: [],
        options: {
          0: []
        }
      }
    },
    props: {
      value: Array,
      cutStatus: Boolean, // 快捷设置还是次数设置 true 为快捷设置
      count: [Number, String], // 总条数
      price: [Number, String, Object], // 商品原价
      boxIndex: String // 方案几
    },
    watch: {
      value: {},
      count () {
        if (this.count) {
          this.setList()
        }
      },
      cutStatus () {
        this.setList()
      },
      cutDomList: {
        handler () {
          let list = deepClone(this.cutDomList)
          let newList = []
          forEachs(list, (item, i) => {
            newList[i] = {
              discount: item.discount, // (number, optional): 折扣 ,
              price: item.price, // (number, optional): 折扣后价格 ,
              size: i <= 1 ? item.E - item.B + 1 : this.count === '不限' ? -1 : this.count - item.B + 1, // (integer, optional): 权益使用次数默认0 ,
              weight: i + 1 // (integer, optional): 顺序
            }
          })
          this.putValue = newList
        },
        deep: true
      }
    },
    methods: {
      setList () {
        let cut = this.cutStatus
        if (cut) {
          this.getOptions(0)
          this.putValue = [
            {
              discount: '', // (number, optional): 折扣 ,
              price: '', // (number, optional): 折扣后价格 ,
              size: null, // (integer, optional): 权益使用次数默认0 ,
              weight: 1 // (integer, optional): 顺序
            }
          ]
        } else {
          let num = this.count === '不限' ? 50 : isNumber(this.count)
          let arr = []
          for (let i = 0; i < num; i++) {
            arr.push({
              discount: '', // (number, optional): 折扣 ,
              price: '', // (number, optional): 折扣后价格 ,
              size: 1, // (integer, optional): 权益使用次数默认0 ,
              weight: i + 1 // (integer, optional): 顺序
            })
          }
          this.putValue = arr
        }
      }, // 获取列表
      keyupUnt (index, discount) {
        if (!discount && discount !== 0) {
          this.Toast('折扣是必须的')
        } else if (!OneToNine.test(discount)) {
          this.Toast('请输入合理的折扣')
        } else if (!this.price) {
          return false
        } else {
          this.putValue[index].price = countRate(this.price, discount)
        }
      }, // 获取折后价格
      cutInit () {
        this.cutDomList = [{ B: '1', E: '', price: '', discount: '' }] // 初始化快捷设置项
        this.options = { 0: [] } // 初始化所有下拉选择项
        let list = this.value || []
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
      }, // 处理回显数据
      onPicker (e, index, list) {
        /**
         * e: event 事件
         * index: 快捷设置项的下标
         * list: 下拉选择项列表
         */
        let val = list[e.mp.detail.value] // 获取选中的值
        let count = this.count === '不限' ? 50 : isNumber(this.count) // 获取总条数
        let newVal = this.putValue
        if (val < count) {
          this.getOptions(index + 1, val + 1)
          this.putValue[index].size = val - this.setText[`B${index}`] + 1
          if (newVal[index + 1]) {
            this.putValue[index + 1] = {
              discount: '', // (number, optional): 折扣 ,
              price: '', // (number, optional): 折扣后价格 ,
              size: index === 1 ? this.count === '不限' ? -1 : count - this.setText[`B${index + 1}`] + 1 : null, // (integer, optional): 权益使用次数默认0 ,
              weight: index + 1 // (integer, optional): 顺序
            }
            this.putValue = this.putValue.filter((m, i) => i <= index + 1)
          } else if (index <= 1) {
            this.putValue.push({
              discount: '', // (number, optional): 折扣 ,
              price: '', // (number, optional): 折扣后价格 ,
              size: index === 1 ? this.count === '不限' ? -1 : count - this.setText[`B${index + 1}`] + 1 : null, // (integer, optional): 权益使用次数默认0 ,
              weight: index + 2 // (integer, optional): 顺序
            })
          }
        } else {
          this.putValue[index].size = this.count === '不限' ? -1 : val - this.setText[`B${index}`] + 1
          this.putValue = this.putValue.filter((m, i) => i <= index)
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
      getValue () {
        if (this.cutStatus) {
          let list = deepClone(this.cutDomList)
          let newList = []
          forEachs(list, (item, i) => {
            newList[i] = {
              discount: item.discount, // (number, optional): 折扣 ,
              price: item.price, // (number, optional): 折扣后价格 ,
              size: i <= 1 ? item.E - item.B + 1 : this.count === '不限' ? -1 : this.count - item.B + 1, // (integer, optional): 权益使用次数默认0 ,
              weight: i + 1 // (integer, optional): 顺序
            }
          })
          return newList
        } else {
          return this.value
        }
      }
    },
    components: {},
    computed: {
      putValue: {
        get: function () {
          return this.value
        },
        set: function (value) {
          console.log(value)


          this.$emit('input', value)
        }
      },
      setText () {
        let obj = {
          B0: 1,
          E0: '',
          IS0: true
        }
        let list = this.putValue
        forEachs(list, (item, i) => {
          switch (i) {
            case 0:
              obj[`B${i}`] = 1
              obj[`E${i}`] = item.size ? item.size - 1 + 1 : null
              if (item.size) {
                obj[`B${i + 1}`] = item.size + 1
                obj[`IS${i + 1}`] = true
              }
              break
            case 1:
              obj[`E${i}`] = item.size ? item.size + obj[`E${i - 1}`] : null
              if (item.size) {
                obj[`B${i + 1}`] = item.size + obj[`E${i - 1}`] + 1
                obj[`IS${i + 1}`] = false
              }
              break
            case 2:
              obj[`E${i}`] = item.size ? item.size === -1 ? '及以上' : this.count : null
              break
          }
        })
        return obj
      },
      list () {
        return this.putValue
      }
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
