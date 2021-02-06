<template>
  <div>
    <a class="catalog__pic" href="#">
      <img :src="product.image" :alt="product.title">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
                {{ product.price }}
              </span>
    <ColorList :colors="filteredColors" :current-color-id.sync="currentColorId"
               class="colors colors--black"/>
  </div>
</template>

<script>
import ColorList from './ColorList.vue';
import colors from '../data/colors';

export default {
  components: { ColorList },
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
