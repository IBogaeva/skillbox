import Vue from 'vue';
import Vuex from 'vuex';
import { API_BASE_URL } from '@/config';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAccessKey: null,
    cartProductsData: [],
    cartProducts: [],
    cartProductsLoading: true,
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((it) => it.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id, amount: item.quantity,
      }));
    },
    updateCartProductsLoading(state, loading) {
      state.cartProductsLoading = loading;
    },
  },
  getters: {
    orderInfo(state) {
      return state.orderInfo;
    },
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product: cartProduct } = state.cartProductsData
          .find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...cartProduct,
            image: cartProduct.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailProducts
        .reduce((acc, item) => item.amount + acc, 0);
    },
    cartProductsLoading(state) {
      return state.cartProductsLoading;
    },

  },
  actions: {
    loadCart(context) {
      context.commit('updateCartProductsLoading', true);
      return (new Promise((resolve) => setTimeout(resolve, 0)))
        .then(() => {
          axios
            .get(`${API_BASE_URL}/api/baskets`, {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            })
            .then((response) => {
              if (!context.state.userAccessKey) {
                localStorage.setItem('userAccessKey', response.data.user.accessKey);
                context.commit('updateUserAccessKey', response.data.user.accessKey);
              }
              context.commit('updateCartProductsData', response.data.items);
              context.commit('syncCartProducts');
            })
            .then(() => {
              context.commit('updateCartProductsLoading', false);
            });
        });
    },
    addProductToCart(context, { id, amount }) {
      return (new Promise((resolve) => setTimeout(resolve, 0)))
        .then(() => {
          axios.post(`${API_BASE_URL}/api/baskets/products`, {
            productId: id,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
              context.commit('syncCartProducts');
            });
        });
    },
    updateCartProductAmount(context, { id, amount }) {
      context.commit('updateCartProductAmount', { productId: id, amount });
      if (amount < 1) {
        return undefined;
      }
      return (new Promise((resolve) => setTimeout(resolve, 0)))
        .then(() => {
          axios.put(`${API_BASE_URL}/api/baskets/products`, {
            productId: id,
            quantity: amount,
          }, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items);
            })
            .catch(() => {
              context.commit('syncCartProducts');
            });
        });
    },
    deleteCartProduct(context, id) {
      context.commit('deleteCartProduct', id);
      return (new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => {
          axios.request({
            method: 'delete',
            url: `${API_BASE_URL}/api/baskets/products`,
            params: {
              userAccessKey: context.state.userAccessKey,
            },
            data: {
              productId: id,
            },
          })
            .then((response) => {
              context.commit('updateCartProductsData', response.data.items, id);
              context.commit('syncCartProducts');
            })
            .catch(() => {
              context.commit('syncCartProducts');
            });
        });
    },
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        })
        .catch((e) => {
          console.log(e);
          throw e;
        });
    },
  },
});
