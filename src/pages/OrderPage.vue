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
        3 товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
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

            <BaseFormTexarea title="Комментарий к заказу" :error="formError.comments"
                             placeholder="Ваши пожелания"
                             v-model="formData.comments"/>
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

        <div class="cart__block">
          <Loader v-if="loading"/>
          <ul class="cart__orders">
            <OrderItem v-for="item in products" :key="item.productId" :item="item"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: <b>{{ totalAmount }}</b> товара на сумму
              <b>{{ totalPrice | numberFormat }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
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
import OrderItem from '@/components/order/OrderItem.vue';

export default {
  components: {
    BaseFormText,
    BaseFormTexarea,
    Loader,
    OrderItem,
  },
  data() {
    return {
      formData: {},
      formError: {},
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalAmount: 'cartTotalAmount',
      loading: 'cartProductsLoading',
    }),
  },
};
</script>
