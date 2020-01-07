<template>
  <div class="filter" :class="{'show': show}" @click="close" @touchmove.stop="clearPrevent"></div>
</template>

<script>
  export default {
    props: {
      show: Boolean
    },
    methods: {
      close () {
        this.$emit('click')
      },
      clearPrevent () {}
    }
  }
</script>

<style lang="less" scoped>
  .filter {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .2);
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: all .5s;
    z-index: -1;

    &.show {
      z-index: 10;
      opacity: 1;
    }
  }
</style>
