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
import colors from '@/data/colors';
import numberFormat from '@/helpers/numberFormat';

export default {
  components: { ColorList },
  filters: {
    numberFormat,
  },
  data() {
    return {
      currentColorId: 0,
    };
  },
  props: ['product', 'colors'],
  computed: {
    filteredColors() {
      return colors.filter((color) => this.product.colors.includes(color.id));
    },
  },
  watch: {
    colorId(value) {
      this.currentColorId = value;
    },
  },
};
</script>
