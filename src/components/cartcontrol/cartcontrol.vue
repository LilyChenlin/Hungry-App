<template>
  <div class="cartControl-wrapper">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="descCount ">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCount"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCount (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target);
      },
      descCount (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartControl-wrapper
    font-size: 0
    .cart-decrease
      display: inline-block
      /*padding: 6px*/
      transition: all 0.4s linear
      .inner
        display: inline-block
        font-size: 24px
        color: rgb(0,160,220)
        line-height: 24px
        transition: all 0.5s linear
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3D(24px,0,0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      padding-top: 6px
      width: 12px
      font-size: 10px
      line-height: 24px
      text-align: center
      color: rgb(147,153,159)
    .cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      color: rgb(0,160,220)
      line-height: 24px
</style>
