<template>
  <div class="speed">
    <div class="speed-radius" :class="{'active': $index == index}" v-for="(item, $index) in 4" :key="$index"></div>
  </div>
</template>

<script>
  export default {
    props: {
      index: Number
    }
  }
</script>

<style lang="less" scoped>
  .speed {
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;

    .speed-radius {
      display: inline-block;
      width: 24rpx;
      height: 24rpx;
      margin-right: 144rpx;
      background: rgba(1, 109, 209, 1);
      border-radius: 50%;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 24rpx;
        top: 11rpx;
        width: 144rpx;
        height: 2rpx;
        background: rgba(1, 109, 209, 1);
      }

      &:last-child {
        margin-right: 0;

        &::after {
          display: none;
        }
      }

      &.active {
        border: 2rpx solid #fff;
      }
    }
  }
</style>
