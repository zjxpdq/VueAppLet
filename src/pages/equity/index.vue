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

<style lang="less">
  .lv_title {
    font-size: unit(28, rpx);
    color: #333;
    font-weight: bold;
  }

  .lv_text {
    font-size: unit(22, rpx);
    color: #999;
  }

  .lv_input {
    font-weight: normal;

    input {
      font-size: unit(28, rpx);
      padding: unit(16, rpx) 0;
      border-bottom: 1px solid #E8E8E8;
    }

    &.lv_end {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .lv_end_text {
        width: unit(40, rpx);
        font-size: unit(28, rpx);
        display: inline-block;
        text-align: center;
        margin-left: unit(28, rpx);
      }
    }
  }

  .lv_footer_next_btn {
    height: unit(128, rpx);
    width: 100%;
    border-top: 1px solid #E8E8E8;
    border-radius: 0 0 unit(8, rpx) unit(8, rpx);
    background: #FAFAFA;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E8E8E8;
    font-size: unit(40, rpx);
    font-weight: bold;
    transition: color .3s;
    position: absolute;
    bottom: 0;
    left: 0;

    &.lv_pitch_on {
      color: #118CFD;
    }
  }
</style>

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
