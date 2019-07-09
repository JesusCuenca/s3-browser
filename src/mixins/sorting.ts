import Vue from 'vue';
import { S3FolderOrObject, sortByOptions, sortDirection } from '..';

export default Vue.extend({
  data() {
    const data: {
    sortBy: sortByOptions;
    direction: sortDirection;
    } = {
      sortBy: 'name',
      direction: 'ASC',
    };
    return data;
  },

  computed: {
    sortMultiplier(): number {
      return this.direction === 'ASC' ? 1 : -1;
    },
  },

  methods: {
    changeSort(sortBy: sortByOptions, direction: sortDirection) {
      this.sortBy = sortBy;
      this.direction = direction;
    },
    itemSort(a: S3FolderOrObject, b: S3FolderOrObject) {
      if (a.isFolder !== b.isFolder) {
        return a.isFolder ? -1 : 1;
      }

      let aProp: any = a.name;
      let bProp: any = b.name;
      if (!a.isFolder && !b.isFolder) {
        aProp = a[this.sortBy];
        bProp = b[this.sortBy];
      }

      if (aProp === bProp) return 0;
      return (aProp > bProp ? 1 : -1) * this.sortMultiplier;
    },
  },
});
