<template>
  <view class="lv_shops_box">
    <lv-speed :index="2"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <div class="lv_center">
          <div class="lv_title" style="margin-top: 0;">权益详情</div>
          <div class="lv_editor_box">
            <lv-editor v-model="queryList.equityDesc"></lv-editor>
          </div>
          <div class="lv_title">商家承诺</div>
          <div class="lv_promise_box">
            <div class="lv_promise_center" v-for="(item, index) of promiseList[0]" :key="index">
              <div class="lv_p_title">{{item.name}}</div>
              <div class="lv_p_text">
                {{item.subName}}
                <i class="lv_del_icon" @click="delData('list', index)" v-if="!!!item.id"></i>
              </div>
            </div>
            <div class="lv_promise_add">
              <div class="lv_p_add_input" v-if="add">
                <div class="lv_input lv_p_add_title">
                  <input type="text" v-model="exitPromise.name" placeholder="承诺标题"/>
                </div>
                <div class="lv_input lv_p_add_text">
                  <input
                    type="text"
                    v-model="exitPromise.subName"
                    placeholder="请输入承诺描述"
                    @blur="addData('new')"
                  />
                  <i class="lv_del_icon" @click="delData('add')"></i>
                </div>
              </div>
              <div class="lv_p_add_btn" v-if="promiseList[0] && promiseList[0].length < 5" @click="addData('open')">
                <i class="lv_min_add_icon"></i>
                自定义添加承诺
              </div>
            </div>
          </div>
          <div class="lv_title">消费者承诺</div>
          <div class="lv_promise_box">
            <div class="lv_promise_center" v-for="(item, index) of promiseList[1]" :key="index">
              <div class="lv_p_title">{{item.name}}</div>
              <div class="lv_p_text">{{item.subName}}</div>
            </div>
          </div>
          <div class="lv_title">上架时间</div>
          <radio-group class="radio-group" @change="radioChange">
            <radio
              class="radio"
              color="#118cfd"
              v-for="(item, index) of radio"
              :key="index"
              :value="item.value"
              :checked="queryList.releaseStatus === item.value"
            >
              <text>{{item.name}}</text>
            </radio>
          </radio-group>
        </div>
        <div :class="['lv_footer_next_btn', {'lv_pitch_on': !!getNext}]" @click="submit">完成</div>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../../components/speed'
  import uploadComponent from './../../../components/uploadfile'
  import validate from '../../../utils/validate'
  import LvEditor from './../../../components/lv_editor'
  import { deepClone, forEachs } from '../../../utils'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        queryList: {
          id: '', // (string, optional): 权益id ,
          // shopId: '1191195686834536448', // (string, optional): 店铺id ,
          shopId: '', // (string, optional): 店铺id ,
          equityDesc: '', // (string, optional): 权益明细说明 ,
          shopPromiesIds: [], // (Array[PromiseLabelListVO], optional): 商家承诺IDs ,
          userPromiesIds: [], // (Array[PromiseLabelListVO], optional): 用户承诺IDs
          releaseStatus: 0 // (integer, optional): 上架时间 0立即上架 1放入仓库商家手动上架 ,
        },
        promise: [[], []],
        add: null,
        exitPromise: {
          name: '',
          subName: ''
        },
        radio: [
          {
            name: '立即上架',
            value: 0
          },
          {
            name: '放入仓库，商家手动上架',
            value: 1
          }
        ],
        WxValidate: null
      }
    },
    onLoad (query) {
      if (query.shopId) {
        Object.assign(this.queryList, {
          shopId: query.shopId,
          id: query.shopId
        })
        this.getList(query.equityId)
      }
      // this.getList('1577934548363')
      this.getEquityList()
      this.initValidate()
    },
    created () {
    },
    methods: {
      getEquityList () {
        this.getRequest({
          url: `/appequity/helperEquity/all/${this.queryList.shopId}`,
          data: {}
        }).then(res => {
          if (res.status === 200) {
            this.promise = res.t
          }
        })
      },
      addData (type) {
        switch (type) {
          case 'open':
            this.add = true
            break
          case 'new':
            if (this.exitPromise.name && this.exitPromise.subName) {
              this.promise[0].push(this.exitPromise)
              this.add = false
              this.exitPromise = {
                name: '',
                subName: ''
              }
            } else {
              this.Toast('承诺标题或承诺描述不能为空！')
            }
            break
        }
      },
      delData (type, index) {
        switch (type) {
          case 'add':
            this.add = false
            this.exitPromise = { name: '', subName: '' }
            break
          case 'list':
            this.promise[0].splice(index, 1)
            break
        }
      },
      radioChange (e) {
        this.queryList.releaseStatus = e.mp.detail.value
      },
      initValidate () {
        this.WxValidate = new validate({
          equityDesc: { required: true, message: '权益详情是必须的' },
          shopPromiesIds: { required: true, type: 'array', message: '商家承诺是必须的' },
          userPromiesIds: { required: true, type: 'array', message: '用户承诺是必须的' }
        })
      },
      submit () {
        let params = deepClone(this.queryList)
        params.shopPromiesIds = this.promise[0]
        params.userPromiesIds = this.promise[1]
        this.WxValidate.checkForm(params).then(() => {
          this.postRequest({
            url: '/appequity/helperEquity/AddEquityThree',
            data: params
          }).then(res => {
            if (res.status === 200) {
              wx.navigateTo({ url: `../detail/main?shopId=${this.queryList.companyId}` })
            } else {
              this.Toast(res.msg)
            }
          })
        })
      },
      getList (id) {
        this.getRequest({
          url: `/appequity/helperEquity/getEquityById/${id}`
        }).then(res => {
          if (res.status === 200) {
            let list = res.t
            let keys = ['equityDesc', 'shopPromiesIds', 'userPromiesIds', 'releaseStatus']
            forEachs(keys, key => {
              this.queryList[key] = list[key]
            })
          }
        })
      }
    },
    components: {
      uploadComponent,
      LvSpeed,
      LvEditor
    },
    computed: {
      getNext () {
        let params = deepClone(this.queryList)
        params.shopPromiesIds = this.promise[0]
        params.userPromiesIds = this.promise[1]
        return this.WxValidate.ext(params)
      },
      promiseList () {
        return this.promise
      }
    },
    mounted () {},
    beforeDestroy () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  @import url('./../../../styles/lv_style');
  @import url('../../../styles/icon');

  .lv_shops_box .lv_content {
    height: 100%;
    width: 100%;
    position: relative;

    .lv_center {
      padding: unit(40, rpx) unit(40, rpx) 0;

      .lv_title {
        margin-top: unit(40, rpx);
      }

      .lv_editor_box {
        width: 100%;
        height: unit(606, rpx);
        margin-top: unit(40, rpx);

        .lv_editor {
          background: #FBFBFB;
          border-radius: unit(8, rpx);
          height: 100%;
          padding: unit(10, rpx) unit(20, rpx);
        }
      }

      .lv_promise_box {
        margin-top: unit(12, rpx);

        .lv_promise_center {
          display: flex;
          font-size: unit(28, rpx);
          padding: unit(12, rpx) 0;
          color: #333;

          .lv_p_title {
            width: unit(130, rpx);
          }

          .lv_p_text {
            position: relative;
            flex: 1;

            .lv_del_icon {
              position: absolute;
              top: unit(4, rpx);
              right: 0;
              display: inline-block;
              width: unit(32, rpx);
              height: unit(32, rpx);
              z-index: 99;
            }
          }
        }

        .lv_promise_add {
          .lv_p_add_input {
            display: flex;
            margin-bottom: unit(12, rpx);

            .lv_p_add_title {
              width: unit(115, rpx);
              margin-right: unit(24, rpx);
            }

            .lv_p_add_text {
              flex: 1;
              position: relative;

              .lv_del_icon {
                position: absolute;
                top: unit(24, rpx);
                right: 0;
                display: inline-block;
                width: unit(32, rpx);
                height: unit(32, rpx);
                z-index: 99;
              }
            }
          }

          .lv_p_add_btn {
            width: unit(240, rpx);
            height: unit(56, rpx);
            margin: unit(12, rpx) auto 0;
            color: #333;
            font-size: unit(24, rpx);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(232, 232, 232, 1);
            border-radius: unit(8, rpx);
          }
        }
      }

      .radio-group {
        padding: unit(24, rpx) 0;

        .radio {
          display: block;
          padding-bottom: unit(24, rpx);
          font-size: unit(28, rpx);
        }
      }
    }
  }
</style>
