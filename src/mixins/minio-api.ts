import Vue from 'vue';
import * as Minio from 'minio';
import { Buffer } from 'buffer';
import { S3Folder, S3FolderOrObject } from '@/index';

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
        return this.client
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

    async clientUploadFile(bucketName: string, prefix: string, file: File) {
      if (this.client === null) return false;
      const filePath = `${prefix}${file.name}`;
      const presignedUrl = await this.clientGetPutUrl(bucketName, filePath);
      if (!presignedUrl) return false;

      const xhr = new XMLHttpRequest();
      if (!xhr.upload) return false;
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          console.log(
            `Loaded ${e.loaded} of ${e.total} (${((e.loaded * 100) / e.total).toFixed(2)}%)`,
          );
        });
        xhr.onreadystatechange = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('la subida se ha completado con éxito');
              resolve({ xhr, e });
            } else {
              console.log('la subida ha fallado escandalosamente');
              reject(false);
            }
          }
        };
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('X-FILENAME', file.name), xhr.send(file);
      });
    },

    async clientGetPutUrl(bucketName: string, fileName: string): Promise<string | false> {
      if (this.client === null) return false;
      return this.client.presignedPutObject(bucketName, fileName);
    },

    readFile(file: File): Promise<Buffer> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (e: ProgressEvent) => {
          console.log(
            `Loaded ${e.loaded} of ${e.total} (${((e.loaded * 100) / e.total).toFixed(2)}%)`,
          );
        };
        reader.onload = (e: ProgressEvent) => {
          // @ts-ignore
          if (e === null || e.target === null || !e.target.result) {
            reject();
          }
          // @ts-ignore
          resolve(Buffer.from(e.target!.result));
        };
        reader.onerror = (e) => {
          reject(e);
        };
        reader.readAsArrayBuffer(file);
      });
    },

    mapBucketItemFromListToS3OFolder(bucket: Minio.BucketItemFromList): S3Folder {
      return {
        isFolder: true,
        name: bucket.name,
        prefix: `${bucket.name}/`,
      };
    },

    mapBucketItemtoS3FileOrObject(item: Minio.BucketItem): S3FolderOrObject {
      if (item.prefix) {
        return {
          isFolder: true,
          name: this.mapItemName(item.prefix),
          prefix: item.prefix,
        };
      }
      return {
        isFolder: false,
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
