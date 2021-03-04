<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter :price-from.sync="customFilters.filterPriceFrom"
                     :price-to.sync="customFilters.filterPriceTo"
                     :category-id.sync="customFilters.filterCategoryId"
                     :color-id.sync="customFilters.filterColorId"/>
      <section class="catalog">
        <Loader v-if="productsLoading"/>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>
        <ProductList :products="products"/>
        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage"/>
      </section>

    </div>
  </main>
</template>

<script>
import ProductList from '@/components/product/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/product/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import Loader from '@/components/common/Loader.vue';

export default {
  components: {
    ProductList, BasePagination, ProductFilter, Loader,
  },
  data() {
    return {
      customFilters: {
        filterCategoryId: 0,
        filterPriceFrom: 0,
        filterPriceTo: 0,
        filterColorId: 0,
      },
      productsPerPage: 3,
      page: 1,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.customFilters.filterCategoryId,
              colorId: this.customFilters.filterColorId,
              minPrice: this.customFilters.filterPriceFrom,
              maxPrice: this.customFilters.filterPriceTo,
            },
          })
          .then((response) => { this.productsData = response.data; })
          .catch(() => { this.productsLoadingFailed = true; })
          .then(() => { this.productsLoading = false; });
      }, 0);
    },
  },
  watch: {
    page: 'loadProducts',
    customFilters: {
      handler() {
        this.loadProducts();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
