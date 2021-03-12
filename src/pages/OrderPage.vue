<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ totalAmount }} товара
      </span>
    </div>

    <section class="cart">
      <Loader v-if="orderSending"/>
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText title="ФИО" placeholder="Введите ваше полное имя"
                          v-model="formData.name" :error="formError.name"/>

            <BaseFormText title="Адрес доставки" placeholder="Введите ваш адрес"
                          v-model="formData.address" :error="formError.address"/>

            <BaseFormText title="Телефон" placeholder="Введите ваш телефон"
                          v-model="formData.phone" :error="formError.phone" type="tel"/>

            <BaseFormText title="Email" placeholder="Введи ваш Email"
                          v-model="formData.email" :error="formError.email" type="email"/>

            <BaseFormTexarea title="Комментарий к заказу" :error="formError.comment"
                             placeholder="Ваши пожелания"
                             v-model="formData.comment"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only"
                         type="radio" name="delivery" value="0" checked="">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="card">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

       <OrderSummary :data="total">
           <button class="cart__button button button--primery" type="submit">
                Оформить заказ
           </button>
        </OrderSummary>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/formfield/BaseFormText.vue';
import BaseFormTexarea from '@/components/formfield/BaseFormTexarea.vue';
import Loader from '@/components/common/Loader.vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import OrderSummary from '@/components/order/OrderSummary.vue';

export default {
  components: {
    BaseFormText,
    BaseFormTexarea,
    Loader,
    OrderSummary,
  },
  filters: {
    numberFormat,
  },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      orderSending: false,
      cartTotal: {
        items: [],
        totalPrice: null,
        totalAmount: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalAmount: 'cartTotalAmount',
      loading: 'cartProductsLoading',
    }),
    total() {
      this.fillCartTotal();
      return this.cartTotal;
    },
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.orderSending = true;
      clearTimeout(this.orderSendingTimer);
      this.orderSendingTimer = setTimeout(() => {
        axios
          .post(`${API_BASE_URL}/api/orders`, {
            ...this.formData,
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          })
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
          })
          .then(() => {
            this.orderSending = false;
          });
      }, 1000);
    },
    fillCartTotal() {
      this.cartTotal.items = this.products;
      this.cartTotal.totalPrice = this.totalPrice;
      this.cartTotal.totalAmount = this.totalAmount;
    },
  },
};
</script>
