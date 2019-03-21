<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="description">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-content">
        <div v-for="ball in balls" :key="ball.item">
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopCart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.item">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span class="money">￥{{food.price * food.count}}</span>
                </div>
                <div class="carControl-wrapper">
                  <carControl :food="food"></carControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div>
        <div class="bg-mask" v-show="listShow" @click="hideList" ></div>
      </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import carControl from '../cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';
  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          if (food.count) {
            total += food.price * food.count;
          }
        });
        return total;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}起送`;
        } else {
          return '去结算';
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow () { // 判断是否展开详情页
        if (!this.totalCount) {
          return false;
        };
        let show = !this.fold;
        this._initScroll(show);
        return show;
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter: function (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter: function (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = `translate3d(0,0,0)`;
          el.style.transform = `translate3d(0,0,0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(0,0,0)`;
          inner.style.transform = `translate3d(0,0,0)`;
        });
      },
      afterEnter: function (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList: function () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      _initScroll: function (show) {
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      },
      empty: function () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList: function () {
        this.fold = true;
      },
      pay: function () {
        if (this.totalPrice >= this.minPrice) {
          window.alert(`需要支付${this.totalPrice}元`);
        }
      }
    },
    watch: {
      totalCount: function () {
        if (!this.totalCount) {
          this.fold = true;
        }
      }
    },
    components: {
      carControl
    }
 };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styles/mixin.styl"
  .shopCart
    position: fixed
    left: 0px
    bottom: 0px
    background: black
    width: 100%
    height: 48px
    z-index: 50
    .content
      display: flex
      background: #141d27
      font-size: 0px
      color: rgba(255,255,255,0.4)
      .content-left
        flex : 1
        .logo-wrapper
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6 px
          width: 56px
          height: 56px
          border-radius: 50%
          box-sizing: border-box
          background: #141d27
          display: inline-block
          vertical-align: top
          .logo
            width: 100%
            height: 100%
            background: #2b343c
            -webkit-border-radius: 50%
            -moz-border-radius: 50%
            border-radius: 50%
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              line-height: 44px
              color: #80858a
              &.highlight
                color: rgb(255,255,255)
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            font-weight: 700
            color: rgb(255,255,255)
            background: rgb(240,20,20)
            box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.4)
            border-radius: 16px
            font-size: 9px
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          font-size: 16px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          padding-right: 12px
          text-align: center
          font-weight: 700
          line-height: 24px
          &.highlight
            color: rgb(255,255,255)
        .description
          display: inline-block
          vertical-align: top
          font-size: 14px
          line-height: 24px
          box-sizing: border-box
          padding-left: 12px
          margin-top: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          font-size: 12px
          font-weight: 700
          line-height: 48px
          text-align: center
          background: #2b333b
          height: 48px
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-content
      .ball
        position: fixed
        bottom: 22px
        left: 32px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0,160,220)
          transition: all 0.4s linear
    .shopCart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transition: all 0.5s
      transform: translate3d(0,-100%,0);
      &.fold-enter,&.fold-leave-active
        transform: translate3d(0,0,0);
      .list-header
        height: 40px
        padding: 0 18px
        background: #f3f5f7
        line-height: 40px
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          font-size: 14px
          color: rgb(7,17,27)
          font-weight: 200
          float: left
        .empty
          font-size: 12px
          color: rgb(0,160,220)
          float: right
      .list-content
        padding: 0 18px
        background-color: #fff
        max-height: 217px
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          border-1px(rgba(7,17,27,0.1))
          box-sizing: border-box
          .name
            font-size: 14px
            line-height: 48px
            color: rgb(7,17,27)
          .price
            position: absolute;
            right: 90px
            bottom: 12px
            font-size: 14px
            color: rgb(240,20,20)
            line-height: 48px
            font-weight: 700
          .carControl-wrapper
            position: absolute;
            right: 0px
            bottom: 6px
  .bg-mask
    position: fixed;
    top: 0px
    left: 0px
    width: 100%
    height: 100%
    z-index: 40
    blur:10px
    transition: all 0.5s
    opacity: 1
    background: rgba(7,17,27,0.6)
    &.fade-enter,&.fade-leave
      opacity: 0
      background:rgba(7,17,27,0)
</style>
