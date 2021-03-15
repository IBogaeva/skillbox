<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in data.items" :key="item.id" :item="item">
        <h3>{{ item.product.title }}}</h3>
        <b>{{ item.amount * item.product.price | numberFormat }} ₽</b>
        <span>Артикул: {{ item.product.id }}</span>
      </li>
    </ul>
    <div class="cart__total">
      <p>Доставка: <b>500 ₽</b></p>
      <p>Итого: <b>{{ data.totalAmount }}</b> товара на сумму
        <b>{{ data.totalPrice | numberFormat }} ₽</b></p>
    </div>
    <slot/>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  filters: {
    numberFormat,
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        items: [],
        totalAmount: null,
        totalPrice: null,
      }),
    },
  },
};
</script>
