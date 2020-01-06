<template>
  <view class="lv_equity">
    <lv-speed :index="speedIndex"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <lv-basic></lv-basic>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../components/speed'
  import LvBasic from './components/lv_basic'

  export default {
    name: 'lv_equity',
    data () {
      return {
        speedIndex: 0
      }
    },
    components: {
      LvSpeed,
      LvBasic
    },
    created () {},
    methods: {},
    computed: {},
    mounted () {},
    destroyed () {}
  }
</script>

<style scoped lang="less">
  .lv_equity {
    background: #118CFD;
    height: 100vh;

    .lv_content_box {
      height: calc(100vh - 88rpx);
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
