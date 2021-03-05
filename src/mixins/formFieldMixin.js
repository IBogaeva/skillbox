import BaseFormField from '@/components/formfield/BaseFormField.vue';

export default {
  props: ['title', 'error', 'placeholder', 'value'],
  components: { BaseFormField },
  computed: {
    dataValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
