import Vue, { VNode } from 'vue';
import { default as iconsMap } from './icons-map.json';

export default Vue.extend({
  name: 's3-icon',

  functional: true,

  props: {
    value: {
      type: String,
      required: true,
    },
  },

  render(h, { props }): VNode {
    const parts = props.value.split('.');
    const ext = parts.length > 1 ? `.${parts[parts.length - 1]}` : props.value || '';
    // @ts-ignore
    const icon = iconsMap[ext] || iconsMap[''];

    return h('img', {
      attrs: {
        src: `/svg/${icon}.svg`,
        title: props.value,
        alt: props.value,
      },
    });
  },
});
