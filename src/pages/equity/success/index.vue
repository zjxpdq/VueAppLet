<template>
  <view class="lv_shops_box">
    <lv-speed :index="3"></lv-speed>
    <view class="lv_content_box">
      <view class="lv_content">
        <div class="lv_center">
          <div class="lv_logo">
            <img :src="User_logo">
          </div>
          <p>权益审核提交成功</p>
          <p class="lv_f_text">预计1-3个工作日内完成审核</p>

          <div class="lv_btn_box">
            <button class="lv_btn" @click="nextPage">再添加一个权益</button>
            <button class="lv_btn lv_go" @click="nextPage">查看进度</button>
          </div>
        </div>
      </view>
    </view>
  </view>
</template>

<script>
  import LvSpeed from './../../../components/speed'

  export default {
    name: 'lv_shops_box',
    data () {
      return {
        User_logo: 'https://oss-zonda-lyb.oss-cn-shenzhen.aliyuncs.com/card/85151578539604228.png',
        queryList: {}
      }
    },
    onLoad (query) {
      Object.assign(this.queryList, {
        companyId: query.shopId,
        id: query.shopId
      })
    },
    created () {},
    methods: {
      nextPage () {
        wx.navigateTo({ url: `../success/main?shopId=${this.queryList.companyId}` })
      }
    },
    components: {
      LvSpeed
    },
    computed: {}
  }
</script>

<style scoped lang="less">
  @import url('../../../styles/lv_style.less');

  .lv_shops_box .lv_content_box .lv_content {
    height: 100%;
    width: 100%;

    .lv_center {
      height: calc(100vh - 150rpx);
      padding-top: 1px;
      position: relative;

      .lv_logo {
        height: unit(240, rpx);
        display: flex;
        justify-content: center;
        margin-top: unit(160, rpx);

        img {
          width: unit(240, rpx);
          height: unit(240, rpx);
          border-radius: 50%;
        }
      }

      p {
        color: #333;
        font-size: unit(40, rpx);
        font-weight: bold;
        margin-top: unit(40, rpx);
        text-align: center;

        &.lv_f_text {
          font-size: unit(28, rpx);
          font-weight: normal;
          margin-top: unit(8, rpx);
        }
      }

      .lv_btn_box {
        position: absolute;
        bottom: unit(40, rpx);
        left: 0;
        width: 100%;
        height: auto;
      }

      .lv_btn {
        width: unit(606, rpx);
        height: unit(88, rpx);
        margin: unit(20) unit(40, rpx);
        background: #118CFD;
        border: none;
        color: #fff;

        &.lv_go {
          border: 1px solid #118CFD;
          background: #fff;
          color: #118CFD;
          margin-top: unit(40, rpx);
        }
      }
    }
  }
</style>
