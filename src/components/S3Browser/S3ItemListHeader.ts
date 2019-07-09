import Vue, { CreateElement, VNode } from 'vue';

export default Vue.extend({
  name: 's3-browser-item-list-header',

  props: {
    direction: {
      type: String,
      required: true,
    },
    sortBy: {
      type: String,
      required: true,
    },
  },

  computed: {
    reverseDirection() {
      return this.direction === 'ASC' ? 'DESC' : 'ASC';
    },
  },

  render(h) {
    return h(
      'div',
      {
        staticClass: 's3-browser__item-list s3-browser__item-list__header',
      },
      [
        h('div', { staticClass: 's3-browser__item' }, [
          h(
            'div',
            {
              staticClass: 's3-browser__item__description',
            },
            [this.genHeaderItem('Nombre', 'name')],
          ),
          h(
            'div',
            {
              staticClass: 's3-browser__item__size',
            },
            [this.genHeaderItem('Tamaño', 'size')],
          ),
          h(
            'div',
            {
              staticClass: 's3-browser__item__date',
            },
            [this.genHeaderItem('Última modificación', 'lastModified')],
          ),
          h(
            'div',
            {
              staticClass: 's3-browser__item__actions',
            },
            [h('span', {}, 'Opciones')],
          ),
        ]),
      ],
    );
  },

  methods: {
    genHeaderItem(name: string, slug: string): VNode {
      const indicator = this.direction === 'ASC' ? '🡑' : '🡓';
      const sortingByThis = this.sortBy === slug;
      return this.$createElement(
        'a',
        {
          attrs: {
            href: '#',
          },
          on: {
            click: (e: Event) => {
              e.preventDefault();
              this.$emit('change', slug, sortingByThis ? this.reverseDirection : this.direction);
            },
          },
        },
        `${name} ${sortingByThis ? indicator : ''}`,
      );
    },
  },
});
