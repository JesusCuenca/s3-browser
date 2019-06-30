<template>
  <div id="app">
    <s3-browser
      end-point="127.0.0.1"
      :port="9000"
      access-key="BYKHVW0T9SPASE3LDRTR"
      secret-key="t3DoR++bc6Zoqv55aZsDUac7HtgnPW0GW1xY677H"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import S3Browser from './components/S3Browser/S3Browser.vue';

export default Vue.extend({
  name: 'app',
  components: {
    S3Browser,
  },
});
</script>
