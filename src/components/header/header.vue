<template>
  <div class="header">
    <div class="content-wrap">
      <div class="avatar">
        <img :src="seller.avatar" width="64px" height="64px">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="supports" v-if="seller.supports">
              <li class="support-item" v-for="(item,index) in seller.supports" :key="item.num">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
      <div class="detail-close" @click="hideDetail">
        <i class="icon-close"></i>
      </div>
    </div>
  </div>

</template>
<script type="text/ecmascript-6">
  import star from '../../components/star/star';
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail () {
        this.detailShow = true;
      },
      hideDetail () {
        this.detailShow = false;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styles/mixin.styl"
  .header
    color: #fff
    background: rgba(7,17,27,0.5)
    position: relative
    overflow: hidden
    .content-wrap
      padding: 24px 12px 18px 24px
      font-size: 0px
      position: relative
      .avatar
        display: inline-block
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin:2px 0px 8px 0px
          .brand
            vertical-align: top
            width: 30px
            height: 18px
            display: inline-block
            bg-image(brand)
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            font-size: 16px
            color: rgb(255,255,255)
            font-weight: bold
            line-height: 18px
            display: inline-block
            margin-left: 6px
        .description
          font-size: 12px
          color: rgb(255,255,255)
          line-height: 12px
          margin-bottom: 10px
        .support
          margin-bottom: 2px
          .icon
            display: inline-block
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            margin-right: 4px
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            vertical-align: top
            font-size: 10px
            color: rgb(255,255,255)
            line-height: 12px
      .support-count
        position: absolute
        right: 24px
        bottom: 14px
        padding: 0px 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        color: rgb(255,255,255)
        background-color: rgba(0,0,0,0.2)
        .count
          font-size: 10px
          vertical-align: top
        .icon-keyboard_arrow_right
          line-height: 24px
          margin-left: 2px
          font-size: 10px

    .bulletin-wrapper
      height: 28px
      padding: 0px 22px 0px 12px
      /*font-size: 0px*/
      background-color:rgba(7,17,27,0.2)
      line-height: 28px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      position: relative
      .bulletin-title
        width: 22px
        height: 12px
        display: inline-block
        background-size: 22px 12px
        background-repeat: no-repeat
        bg-image('bulletin')
        vertical-align: top
        margin-top: 8px
      .bulletin-text
        font-size: 10px
        color: rgb(255,255,255)
        margin: 0px 4px;
        vertical-align: top
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        top: 8px
        right: 12px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      filter: blur(10px)
      z-index: -1
    .detail
      width: 100%
      height: 100%
      position: fixed
      top: 0
      left: 0
      z-index: 100
      overflow: auto
      background: rgba(7,17,27,0.8)
    .detail-wrapper
      min-height: 100%
      width: 100%
      .detail-main
        margin-top: 64px
        padding-bottom: 64px
        .name
          font-size: 16px
          font-weight: 700
          line-height: 16px
          text-align: center
        .star-wrapper
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 28px auto 24px auto
          .line
            flex: 1
            position: relative
            top: -6px
            border-bottom: 1px solid rgba(255,255,255,0.2)
          .text
            padding: 0px 24px
            font-size: 14px
            font-weight: 700
        .supports
          width: 80%
          margin: 0 auto
          .support-item
            padding: 0 12px
            margin-bottom: 12px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              width: 16px
              height: 16px
              display: inline-block
              margin-right: 6px
              background-size: 12px 12px
              background-repeat: no-repeat
              vertical-align: top
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              font-size: 12px
              line-height: 12px
        .bulletin
          width: 80%
          margin: 0 auto
          .content
            padding: 0px 12px
            font-size: 12px
            line-height: 24px
    .detail-close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      font-size: 32px
      color: rgba(255,255,255,0.5)
      clear: both
</style>
