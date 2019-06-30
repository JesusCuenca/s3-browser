import Vue from 'vue';
import * as Minio from 'minio';
import { S3Folder, S3FolderOrObject } from '@/index'

export default Vue.extend({
  props: {
    endPoint: {
      type: String,
      required: true,
    },
    accessKey: {
      type: String,
      required: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      default: 0,
    },
    useSSL: {
      type: Boolean,
      default: false,
    },
    region: {
      type: String,
      default: null,
    },
    transport: {
      type: String,
      default: null,
    },
    sessionToken: {
      type: String,
      default: null,
    },
    partSize: {
      type: String,
      default: null,
    },
  },
  data() {
    const data: { client: Minio.Client | null } = {
      client: null,
    };
    return data;
  },
  methods: {
    /**
     * Initializes the client with the parameters given to the component.
     * @returns boolean Whether the client was initializes successfully or not.
     */
    clientInitialize(): boolean {
      const options: Minio.ClientOptions = {
        endPoint: this.endPoint,
        accessKey: this.accessKey,
        secretKey: this.secretKey,
      };
      ['port', 'useSSL', 'region', 'transport', 'sessionToken', 'partSize'].forEach((opt) => {
        // @ts-ignore
        const val = this[opt];
        if (val !== undefined && val !== null) {
          // @ts-ignore
          options[opt] = val;
        }
      });

      try {
        this.client = new Minio.Client(options);
        return true;
      } catch (e) {
        console.error('Error creating Minio Client:', e.message, e);
        this.client = null;
        return false;
      }
    },

    async clientListBuckets(): Promise<S3FolderOrObject[]> {
      if (this.client === null) return [];
      try {
        const buckets = await this.client.listBuckets();
        return buckets.map(this.mapBucketItemFromListToS3OFolder);
      } catch (error) {
        console.error('Error listing buckets:', error.message, error);
        return [];
      }
    },

    async clientListObjects(
      bucketName: string,
      prefix?: string,
      recursive?: boolean,
    ): Promise<S3FolderOrObject[]> {
      return new Promise((res) => {
        if (this.client === null) return res([]);
        const objects: Minio.BucketItem[] = [];
        this.client
          .listObjects(bucketName, prefix || '', recursive)
          .on('data', (item) => {
            objects.push(item);
          })
          .on('error', (error) => {
            console.error('Error listing objects:', error.message, error);
            res([]);
          })
          .on('end', () => {
            res(objects.map(this.mapBucketItemtoS3FileOrObject));
          });
      });
    },

    mapBucketItemFromListToS3OFolder(bucket: Minio.BucketItemFromList): S3Folder {
      return {
        isFolder: true,
        name: bucket.name,
        creationDate: bucket.creationDate,
        prefix: `${bucket.name}/`,
      };
    },

    mapBucketItemtoS3FileOrObject(item: Minio.BucketItem): S3FolderOrObject {
      if (item.prefix) {
        return {
          isFolder: true,
          name: this.mapItemName(item.prefix),
          creationDate: item.lastModified,
          prefix: item.prefix,
        };
      }
      return {
        isObject: true,
        name: this.mapItemName(item.name),
        lastModified: item.lastModified,
        etag: item.etag,
        size: item.size,
      };
    },

    mapItemName(nameOrPrefix: string): string {
      const parts = nameOrPrefix.split('/').filter(p => p !== '');
      if (parts.length) return parts[parts.length - 1];
      return '(( Unknown ))';
    },
  },
});
