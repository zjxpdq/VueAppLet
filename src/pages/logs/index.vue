<template>
  <div>
    <swiper v-if="imgUrls.length > 0" indidator-dots="imgUrls.length > 1">
      <block v-for="(item, index) in imgUrls" :key="index">
        <swiper-item>
          <image :src="item" mode="scaleToFill"></image>
        </swiper-item>
      </block>
    </swiper>

    <button @click="verify">验证</button>

     <ul class="container log-list">
       <li v-for="(log, index) in logs" :class="{ red: aa }" :key="index" class="log-item">
         <card :text="(index + 1) + ' . ' + log"></card>
       </li>
     </ul>
  </div>
</template>

<script>
  import { formatTime } from '@/utils/index'
  import card from '@/components/card'

  import WxValidate from '../../utils/WxValidate'

  export default {
    components: {
      card
    },

    data () {
      return {
        logs: [],
        imgUrls: [
          'http://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/newsPicture/05558951-de60-49fb-b674-dd906c8897a6',
          'http://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/coursePicture/0fbcfdf7-0040-4692-8f84-78bb21f3395d',
          'http://mss.sankuai.com/v1/mss_51a7233366a4427fa6132a6ce72dbe54/management-school-picture/7683b32e-4e44-4b2f-9c03-c21f34320870'
        ],
        params: {
          businessType: '',
          limitedAt: '',
          boxType: '',
          boxCount: '',
          weight: '',
          store: '',
          harbour: '',
          freight: '',
          freshInterval: '',
          linkman: ''
        }
      }
    },

    created () {
      let logs
      if (mpvuePlatform === 'my') {
        logs = mpvue.getStorageSync({ key: 'logs' }).data || []
      } else {
        logs = mpvue.getStorageSync('logs') || []
      }
      this.logs = logs.map(log => formatTime(new Date(log)))
    },

    methods: {
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
        if (!this.WxValidate.checkForm(params)) {
          const error = this.WxValidate.errorList[0]
          console.log(error)
          return false
        }

      }
    }
  }
</script>

<style>
  .log-list {
    display: flex;
    flex-direction: column;
    padding: 40rpx;
  }

  .log-item {
    margin: 10rpx;
  }
</style>
