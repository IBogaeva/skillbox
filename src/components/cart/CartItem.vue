<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.product.image" width="120" height="120" alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code">
                  Артикул: {{ item.product.id }}
                </span>

    <AmountChange :current-amount.sync="amount" class="product__counter form__counter"/>

    <b class="product__price">
      {{ item.amount * item.product.price | numberFormat }} ₽
    </b>

    <button class="product__del button-del" type="button"
            aria-label="Удалить товар из корзины" @click.prevent="deleteProduct()">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import AmountChange from '@/components/common/AmountChange.vue';

export default {
  filters: {
    numberFormat,
  },
  props: ['item'],
  components: { AmountChange },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.updateCartProductAmount({ id: this.item.productId, amount: value });
      },
    },
  },
  methods: {
    ...mapActions(['updateCartProductAmount', 'deleteCartProduct']),
    deleteProduct() {
      this.deleteCartProduct(this.item.productId);
    },
  },
};
</script>
