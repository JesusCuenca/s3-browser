<template>
  <div class="s3-browser" v-on="listeners" :class="classes">
    <nav class="s3-browser__nav">
      <a v-if="bucket" v-html="bucket"></a>
      <a v-else href="#" @click="navigationDropAll">Inicio</a>
      <a
        v-for="(item) in path"
        :key="item.key"
        v-html="item.name"
        @click="navigateTo(item)"
        href="#"
      ></a>
    </nav>
    <div class="s3-browser__item-list s3-browser__item-list__header">
      <div class="s3-browser__item">
        <div class="s3-browser__item__description">
          <span>Nombre</span>
        </div>
        <div class="s3-browser__item__size">
          <span>Tamaño</span>
        </div>
        <div class="s3-browser__item__date">
          <span>Última modificación</span>
        </div>
        <div class="s3-browser__item__actions">
          <span>Opciones</span>
        </div>
      </div>
    </div>
    <div class="s3-browser__item-list" v-if="items.length">
      <template v-for="item in sortedItems">
        <s3-browser-item-folder
          v-if="item.isFolder"
          :key="item.key"
          v-bind="item"
          @click="navigationPush(item)"
        ></s3-browser-item-folder>
        <s3-browser-item-object v-else :key="item.key" v-bind="item"></s3-browser-item-object>
      </template>
    </div>
    <div class="s3-browser__item-list s3-browser__item-list--empty" v-else>
      <div class="s3-browser__item">
        <div class="s3-browser__item__description">
          <span>
            <img src="/svg/folder.svg" />
          </span>
          <span>Este directorio está vacío.</span>
          <span>Arrastra un fichero aquí para subirlo.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Minio library
import * as Minio from 'minio';

// Mixins
import mixins from '@/utils/mixins';
import Navigation from '@/mixins/nav';
import DragNDropEvents from '@/mixins/drag-drop-events';

// Components
import S3ItemObject from './S3ItemObject';
import S3ItemFolder from './S3ItemFolder';
import { S3FolderOrObject } from '../../index.d';

import ConsoleFactory from '@/utils/console';

const console = ConsoleFactory('S3 Browser');

export default mixins(DragNDropEvents).extend({
  name: 's3-browser',

  components: {
    's3-browser-item-object': S3ItemObject,
    's3-browser-item-folder': S3ItemFolder,
  },

  data() {
    const data: {
      items: S3FolderOrObject[],
      itemsCache: Object,
      errors: string[],
    } = {
      itemsCache: {},
      errors: [],
      items: [],
    };
    return data;
  },

  computed: {
    sortedItems(): S3FolderOrObject[] {
      return this.items.sort(this.itemSort);
    },

    classes(): object {
      return {
        's3-browser--dragging-over': this.draggingOver,
      };
    },
  },

  methods: {
    initializeClientIfNeeded() {
      if (this.client !== null) {
        return;
      }

      this.path = [];
      this.items = [];

      if (!this.clientInitialize()) {
        // TODO: hacer algo para avisar al usuario
        return;
      }

      this.fetchObjects();
    },

    async fetchBuckets() {
      this.items = await this.clientListBuckets();
      return this.items;
    },

    async fetchObjects() {
      if (this.computedBucket === false) {
        return this.fetchBuckets();
      }

      this.items = await this.clientListObjects(
        this.computedBucket,
        this.currentPrefix,
      );
      return this.items;
    },

    itemSort(a: S3FolderOrObject, b: S3FolderOrObject): number {
      if (a.isFolder !== b.isFolder) {
        return a.isFolder ? 1 : -1;
      }
      if (a.name === b.name) return 0;
      return a.name < b.name ? -1 : 1;
    },
  },

  watch: {
    path() {
      this.fetchObjects();
    },
  },

  mounted() {
    this.initializeClientIfNeeded();
  },

  beforeMount() {
    this.initializeClientIfNeeded();
  },
});
</script>
