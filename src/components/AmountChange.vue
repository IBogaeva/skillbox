<template>
  <div>
    <button type="button" aria-label="Убрать один товар"
            @click.prevent="changeAmount(amount - 1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="amount">

    <button type="button" aria-label="Добавить один товар"
            @click.prevent="changeAmount(amount + 1)">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>

export default {
  model: {
    prop: 'amount',
    event: 'change',
  },
  props: ['amount'],
  methods: {
    changeAmount(value) {
      if (value < 0) {
        return;
      }
      this.$emit('change', value);
    },
  },
};
</script>
