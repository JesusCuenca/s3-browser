<template>
  <div class="s3-browser">
    <nav>
      <a v-if="bucket" v-html="bucket"></a>
      <a v-else>Home</a>
      <a
        v-for="(item, index) in path"
        :key="item.key"
        v-html="item.name"
        :class="{ current: index === path.length }"
        @click="navigateTo(item)"
        href="#"
      ></a>
    </nav>
    <ul>
      <li v-for="item in items" :key="item.name">
        <a href="#" v-html="item.name" @click="navigationPush(item)" v-if="item.isFolder"></a>
        <a href="#" v-html="item.name" v-else></a>
      </li>
    </ul>
    <pre>{{ currentPrefix }}</pre>
    <pre>{{ path }}</pre>
    <pre>{{ buckets }}</pre>
  </div>
</template>

<script>
import Vue from 'vue';
import * as Minio from 'minio';
import ConsoleFactory from '@/utils/console';

import MinioClient from '@/mixins/minio-api';
import Navigation from '@/mixins/nav';

const console = ConsoleFactory('S3 Browser');

export default {
  name: 's3-browser',
  mixins: [MinioClient, Navigation],

  props: {
    bucket: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      itemsCache: {},
      fetchingData: false,
      errors: [],
      items: [],
      buckets: [],
    };
  },

  computed: {
    computedBucket() {
      if (this.bucket) return this.bucket;
      if (this.path.length) return this.path[0].name;
      return false;
    },
  },

  methods: {
    initializeClientIfNeeded() {
      if (this.client !== null) {
        return;
      }

      this.path = [];
      this.buckets = [];
      this.items = [];

      if (!this.clientInitialize()) {
        // TODO: hacer algo para avisar al usuario
        return;
      }

      if (!this.computedBucket) this.fetchBuckets();
      else this.fetchObjects();
    },

    async fetchBuckets() {
      console.log('Fetching buckets');

      this.items = await this.clientListBuckets();
    },

    async fetchObjects() {
      console.log('Fetching objects', this.computedBucket, this.currentPrefix);
      this.items = await this.clientListObjects(
        this.computedBucket,
        this.currentPrefix,
      );
    },
  },

  watch: {
    path() {
      if (!this.computedBucket) this.fetchBuckets();
      else this.fetchObjects();
    },
  },

  mounted() {
    this.initializeClientIfNeeded();
  },

  beforeMount() {
    this.initializeClientIfNeeded();
  },
};
</script>

<style lang="stylus">
nav {
  a {
    margin: 0 5px
  }
}
</style>
