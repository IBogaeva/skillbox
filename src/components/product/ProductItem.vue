<template>
  <div>
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
                {{ product.price  | numberFormat}} ₽
              </span>
    <ColorList :colors="filteredColors" :current-color-id.sync="currentColorId"
               class="colors colors--black"/>
  </div>
</template>

<script>
import ColorList from '@/components/common/ColorList.vue';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';

export default {
  components: { ColorList },
  filters: {
    numberFormat,
  },
  data() {
    return {
      currentColorId: 0,
      colorsData: null,
    };
  },
  props: ['product'],
  computed: {
    filteredColors() {
      return this.product.colors;
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
  },
  methods: {
    loadColors() {
      axios.get('http://vue-study.dev.creonit.ru/api/colors')
        .then((response) => { this.colorsData = response.data; });
    },
  },
  watch: {
    colorId(value) {
      this.currentColorId = value;
    },
  },
  created() {
    this.loadColors();
  },
};
</script>
