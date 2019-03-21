<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper" >
      <ul >
        <li v-for="(item,index) in goods" :key="item.num" class="menu-item" :class="{'current':currentIndex === index}"
        @click="scrollTo(index)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="goods-wrapper" ref="goodWrapper">
      <ul>
        <li v-for="item in goods" :key="item.num" class="good-list good-list-hood">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.num" class="food-item">
              <div class="icon"  @click="selectFood(food)">
                <img width="57px" height="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <span class="sellCount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="desPrice">￥{{food.price}}</span><span></span>
                  <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartWrapper">
                  <cartControl :food="food" @cart-add="cartAdd"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopCart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopCart from '../shopcart/shopcart';
  import cartControl from '../cartcontrol/cartcontrol';
  import food from '../food/food';
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods);
          this.$nextTick(() => {
            this.initScroll();
            this.calculateHeight();
          });
        }
      });
    },
    methods: {
      initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.goodScroll = new BScroll(this.$refs.goodWrapper, {
          probeType: 3,
          click: true
        });
        this.goodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      calculateHeight () {
        let goodList = this.$refs.goodWrapper.getElementsByClassName('good-list-hood');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < goodList.length; i++) {
          let item = goodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      scrollTo (index) {
        let target = this.listHeight[index];
        this.goodScroll.scrollTo(0, -target, 300);
      },
      cartAdd (el) {
        this.$nextTick(() => {
          this.$refs.shopCart.drop(el);
        });
      },
      selectFood (food) {
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      shopCart,
      cartControl,
      food
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styles/mixin.styl"
  .goods
    width: 100%
    overflow: hidden
    display: flex
    position: absolute
    top: 40px
    bottom: 46px
    height:414px
    .menu-wrapper
      flex:0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        width: 56px
        height: 54px
        padding: 0 12px
        display: table
        line-height: 14px
        &.current
          background: #fff
          position: relative
          margin-top: -1px
          z-index: 10
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          background-size: 12px 12px
          background-repeat: no-repeat
          margin-right: 2px
          vertical-align: top
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          font-size: 12px
          color: #000
          display: table-cell
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
    .goods-wrapper
      flex: 1
      .title
        font-size: 12px
        line-height: 26px
        color: rgb(147,153,159)
        border-left: 2px solid #d9dde1
        background: #f3f5f7
        height: 26px
        padding-left: 14px
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &.last-child
          border-none()
          padding-bottom: 0px
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex:1
          .name
            margin: 2px 0 8px 0
            font-size: 14px
            line-height: 14px
            color: rgb(7,17,27)
            height: 14px
          .description,.extra
            font-size: 10px
            line-height: 10px
            color: rgb(147,153,159)
          .description
            margin-bottom: 8px
            line-height: 12px
          .extra
            .sellCount
              margin-right: 12px
          .price
            line-height: 24px
            font-weight: 700
            .desPrice
              color: rgb(240,20,20)
              font-size: 14px
              /*margin-right: 8px*/
            .oldPrice
              color: rgb(147,153,159)
              text-decoration: line-through
              font-size: 10px
          .cartWrapper
            position: absolute;
            bottom: 0px
            right: -5px
</style>
