<template>
  <div class="home">
    <the-downloader />
  </div>
</template>

<script>
import TheDownloader from '@/components/TheDownloader.vue'

export default {
  name: 'home',
  components: {
    TheDownloader
  },
  async created() {
    this.$store.dispatch('files')
  },
}
</script>
