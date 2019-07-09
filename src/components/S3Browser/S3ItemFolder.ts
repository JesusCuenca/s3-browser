import Vue, { VNode } from 'vue';
import S3Icon from '@/components/S3Icon/S3Icon';

export default Vue.extend({
  name: 's3-browser-item-folder',

  components: {
    's3-icon': S3Icon,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
  },

  methods: {
    onDbClick(e: Event) {
      this.$emit('click', e);
    },
    onClick(e: Event) {
      e.stopPropagation();
      this.$emit('click', e);
    },
  },

  render(h): VNode {
    return h(
      'div',
      {
        staticClass: 's3-browser__item s3-browser__item-folder',
        on: {
          dbClick: this.onDbClick,
        },
      },
      [
        h(
          'div',
          {
            staticClass: 's3-browser__item__avatar',
          },
          [
            h('s3-icon', {
              props: {
                value: 'folder',
              },
            }),
          ],
        ),
        h(
          'div',
          {
            staticClass: 's3-browser__item__description',
          },
          [
            h(
              'a',
              {
                domProps: {
                  href: '#',
                },
                on: {
                  click: this.onClick,
                },
              },
              [this.name],
            ),
          ],
        ),
        h('div', {
          staticClass: 's3-browser__item__actions',
        }),
      ],
    );
  },
});
