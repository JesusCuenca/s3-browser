import Vue from 'vue';
import { Path, PathItem, S3Folder } from '@/index';

export default Vue.extend({
  data(): { path: Path } {
    return {
      path: [],
    };
  },

  computed: {
    currentPrefix(): string {
      if (this.path.length < 2) return '';
      return this.path[this.path.length - 1].prefix;
    },
  },

  methods: {
    navigateTo(pathItem: PathItem): Path {
      this.path = [...pathItem.path, pathItem];
      return this.path;
    },

    navigationPush(folder: S3Folder): Path {
      const pathItem: PathItem = {
        name: folder.name,
        path: this.path,
        prefix: folder.prefix,
        key: folder.prefix,
      };
      this.path = [...this.path, pathItem];
      return this.path;
    },

    navigationDrop(): Path {
      this.path = this.path.slice(0, -1);
      return this.path;
    },

    navigationDropAll(): Path {
      this.path = [];
      return this.path;
    }
  },
});
