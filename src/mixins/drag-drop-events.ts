import mixins from '@/utils/mixins';

import MinioClient from '@/mixins/minio-api';
import Navigation from '@/mixins/nav';

export default mixins(MinioClient, Navigation).extend({
  data(): { draggingOver: boolean } {
    return {
      draggingOver: false,
    };
  },

  computed: {
    listeners() {
      const preventDefaults = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };
      return {
        dragover: preventDefaults,
        dragenter: (e: DragEvent) => {
          preventDefaults(e);
          this.draggingOver = true;
        },
        dragleave: (e: DragEvent) => {
          this.draggingOver = false;
        },
        drop: (e: DragEvent) => {
          preventDefaults(e);
          this.draggingOver = false;

          console.log('drop', e, e.dataTransfer, e.dataTransfer!.files);
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.handleDrop(e.dataTransfer.files);
          }
        },
      };
    },
  },

  methods: {
    async handleDrop(files: FileList) {
      if (this.computedBucket === false) return false;
      const result = await this.clientUploadFile(this.computedBucket, this.currentPrefix, files[0]);
      console.log('DROPPED', result);
    },
  },
});
