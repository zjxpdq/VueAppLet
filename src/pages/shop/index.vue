<template>
  <view class="lv_equity" id="body">
    <lv-speed :index="speedIndex"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <lv-basic :query="query" v-if="speedIndex === 0" @on-next="onNext"></lv-basic>
        <lv-detail :query="query" v-else-if="speedIndex === 1" @on-next="onNext"></lv-detail>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../components/speed'
  import LvBasic from './components/lv_basic'
  import LvDetail from './components/lv_detail'

  export default {
    name: 'lv_equity',
    data () {
      return {
        speedIndex: 1,
        query: {
          id: '1210370501906530304', // 店铺ID
          companyId: '1210370501906530304' // 企业ID
        },
        title: {
          0: '请填写店铺基本信息',
          1: '请填写店铺基本信息'
        }
      }
    },
    components: {
      LvSpeed,
      LvBasic,
      LvDetail
    },
    created () {
      this.putTitle(this.title[this.speedIndex])
    },
    methods: {
      onNext (e) {
        this.speedIndex = e
        this.putTitle(this.title[this.speedIndex])
      },
      putTitle (title) {
        wx.setNavigationBarTitle({
          title: title
        })
      }
    },
    computed: {},
    mounted () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  .lv_equity {
    background: #118CFD;
    min-height: 100vh;

    .lv_content_box {
      padding: 0 unit(32, rpx) unit(58, rpx);
      box-sizing: border-box;

      .lv_content {
        background: #fff;
        width: 100%;
        height: 100%;
        border-radius: unit(8, rpx);
      }
    }
  }
</style>
