import Vue, { VNode } from 'vue';
import S3Icon from '@/components/S3Icon/S3Icon';

export default Vue.extend({
  name: 's3-browser-item-object',

  components: {
    's3-icon': S3Icon,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    etag: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },

  render(h): VNode {
    return h(
      'div',
      {
        staticClass: 's3-browser__item s3-browser__item-object',
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
                value: this.name,
              },
            }),
          ],
        ),
        h(
          'div',
          {
            staticClass: 's3-browser__item__description',
          },
          [h('span', {}, [this.name])],
        ),
        h(
          'div',
          {
            staticClass: 's3-browser__item__size',
          },
          [h('span', {}, [this.formatBytes(this.size)])],
        ),
        h(
          'div',
          {
            staticClass: 's3-browser__item__date',
          },
          // @ts-ignore
          [h('span', {}, [this.formatDate(this.lastModified)])],
        ),
        h(
          'div',
          {
            staticClass: 's3-browser__item__actions',
          },
          [h('button', {}, 'Hola'), h('button', {}, 'Hola')],
        ),
      ],
    );
  },

  methods: {
    formatBytes(bytes: number, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },
    formatDate(d: Date) {
      return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getSeconds()}`;
    },
  },
});
