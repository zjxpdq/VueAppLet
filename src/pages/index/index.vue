<template>
  <div>
    <!--<view class="userinfo-avatar">我是小盒子</view>
    <view class="avatar">我是盒子</view>-->
    <view v-for="item in text" :key="item.a">
      <text :class="[{on: item.on}]">{{item.a}}</text>
    </view>

    <button @click="tab">点击验证</button>
    <button @click="ss('我是第一个')">切换</button>
    <button @click="ss('我是第二个')">点击验证</button>

    <!--<map
      id="map"
      :longitude="113.324520"
      :latitude="23.099994"
      scale="14"
      :controls="controls"
      :bindcontroltap="controltap"
      :markers="markers"
      :bindmarkertap="markertap"
      :polyline="polyline"
      :bindregionchange="regionchange"
      show-location
      style="width: 100%; height: 300px;"
    ></map>-->

    <!-- <div class="userinfo">
       <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
       <img class="userinfo-avatar" src="/static/images/user.png" background-size="cover" />


       <div class="userinfo-nickname">
         <card :text="userInfo.nickName"></card>
       </div>
     </div>

     <div class="usermotto">
       <div class="user-motto">
         <card :text="motto"></card>
       </div>
     </div>

     <form class="form-container">
       <input type="text" class="form-control" :value="motto" placeholder="v-model" />
       <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
       <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
     </form>

     <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>

     <div class="all">
         <div class="left">
         </div>
         <div class="right">
         </div>
     </div>-->
  </div>
</template>

<script>
  import card from './../../components/card'
  import WxValidate from '../../utils/WxValidate'

  export default {
    data () {
      return {
        motto: 'Hello miniprograme',
        userInfo: {
          nickName: 'mpvue',
          avatarUrl: 'http://mpvue.com/assets/logo.png'
        },
        params: {
          businessType: '123',
          limitedAt: '',
          boxType: '',
          boxCount: '',
          weight: '',
          store: '',
          harbour: '',
          freight: '',
          freshInterval: '',
          linkman: ''
        },
        markers: [
          {
            iconPath: '/resources/others.png',
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
          }],
        polyline: [
          {
            points: [
              {
                longitude: 113.3245211,
                latitude: 23.10229
              }, {
                longitude: 113.324520,
                latitude: 23.21229
              }],
            color: '#FF0000DD',
            width: 2,
            dottedLine: true
          }],
        controls: [
          {
            id: 1,
            iconPath: '/resources/location.png',
            position: {
              left: 0,
              top: 300 - 50,
              width: 50,
              height: 50
            },
            clickable: true
          }],
        text: []
      }
    },

    components: {
      card
    },

    methods: {
      bindViewTap () {
        const url = '../logs/main'
        if (mpvuePlatform === 'wx') {
          mpvue.switchTab({ url })
        } else {
          mpvue.navigateTo({ url })
        }
      },
      clickHandle (ev) {
        console.log('clickHandle:', ev)
        // throw {message: 'custom test'}
      },
      initValidate () {
        const rules = {
          businessType: {
            required: true
          },
          limitedAt: {
            required: true
          },
          boxType: {
            required: true
          },
          boxCount: {
            required: true,
            intType: true
          },
          weight: {
            required: true,
            weight: true
          },
          store: {
            required: true
          },
          harbour: {
            required: true
          },
          freight: {
            required: true,
            money: true
          },
          freshInterval: {
            required: true
          },
          linkman: {
            required: true
          }
        }
        const messages = {
          businessType: {
            required: '请选择业务类型'
          },
          limitedAt: {
            required: '请选择到厂时间'
          },
          boxType: {
            required: '请选择箱型'
          },
          boxCount: {
            required: '请输入发单数量',
            intType: '发单数量请输入10以内'
          },
          weight: {
            required: '请输入箱重',
            weight: '箱重请填写100以内整数或两位小数'
          },
          store: {
            required: '请输入门点地址'
          },
          harbour: {
            required: '请输入港区'
          },
          freight: {
            required: '请输入运费金额',
            money: '请输入正确的金额'
          },
          freshInterval: {
            required: '请选择重发间隔'
          },
          linkman: {
            required: '请选择联系人'
          }
        }
        this.WxValidate = new WxValidate(rules, messages)
      },
      verify () {
        let params = this.params
        console.log(params)
        if (!this.WxValidate.checkForm(params)) {
          const error = this.WxValidate.errorList[0]
          console.log(error)
          return false
        }
      },
      ss (title) {
        wx.setNavigationBarTitle({
          title: title
        })
      },
      tab () {
        this.text = [
          {
            a: 1,
            on: true
          },
          {
            a: 2,
            on: false
          },
          {
            a: 3,
            on: false
          },
          {
            a: 4,
            on: false
          }
        ]
        // this.$forceUpdate()
      },

      regionchange (e) {
        console.log(e.type)
      },
      markertap (e) {
        console.log(e.markerId)
      },
      controltap (e) {
        console.log(e.controlId)
      }
    },

    mounted () {
      this.text = [
        {
          a: 1,
          on: false
        },
        {
          a: 2,
          on: false
        },
        {
          a: 3,
          on: false
        },
        {
          a: 4,
          on: false
        }
      ]
    },
    created () {
      // let app = getApp()
      this.initValidate()
    }
  }
</script>

<style scoped lang="less">
  .on {
    background-color: #000;
    color: #fff;
  }


  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userinfo-avatar {
    width: 200PX; /*px*/
    height: 128px;
    /*border-radius: 50%;*/
    background-color: #ccc;
  }

  .avatar {
    width: 200px; /*px*/
    height: 128px;
    /*border-radius: 50%;*/
    background-color: #000;
  }

  .userinfo-nickname {
    color: #aaa;
  }

  .usermotto {
    margin-top: 150px;
  }

  .form-control {
    display: block;
    padding: 0 12px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
  }

  .all {
    width: 7.5rem;
    height: 1rem;
    background-color: blue;
  }

  .all:after {
    display: block;
    content: '';
    clear: both;
  }

  .left {
    float: left;
    width: 3rem;
    height: 1rem;
    background-color: red;
  }

  .right {
    float: left;
    width: 4.5rem;
    height: 1rem;
    background-color: green;
  }
</style>
