<template>
  <div class="the-downloader">
    <div class="frame">
      <label>Video address</label>
      <br>
      <input type="text" v-model="address">
      <div class="controls">
        <h4>Download as</h4>
        <label>
          <input name="type" type="radio" value="music" v-model="format">
          MP3
        </label>
        <label>
          <input name="type" type="radio" value="video" v-model="format">
          Video
        </label>
      </div>
      <div class="button">
        <div class="message" v-if="downloading">Please wait...</div>
        <button @click="convert()" v-else>Download</button>
      </div>
    </div>
    <div class="files" v-if="files.length">
      <h4>Files</h4>
      <div class="file" v-for="file in files" :key="file.name">
        <a :href="'http://localhost:3000/' + file.name" target="_blank">
          {{ file.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheDownloader',
  data() {
    return {
      address: '',
      format: 'music',
      downloading: false
    }
  },
  methods: {
    async convert() {
      this.downloading = true
      await this.$store.dispatch('convert', this)
      this.downloading = false
    }
  },
  computed: {
    files() {
      return this.$store.state.files
    }
  }
}
</script>

<style scoped lang="scss">
.the-downloader {
  .frame {
    border: 2px solid gold;
    background-color: rgba(120, 120, 120, 0.1);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 10px 10px 5px 0px rgba(200, 200, 200, 0.75);
    div.controls {
      margin-top: 2rem;
      h4 {
        font-size: 15px;
        opacity: 0.6;
      }
      label {
        font-size: 18px;
        margin: 0 1rem;
      }
    }
    div.button {
      margin-top: 2.5rem;
      .message {
        font-size: 18px;
        position: relative;
        top: 0.4rem;
      }
    }
  }
  div.files {
    margin-top: 2.5rem;
    font-size: 16px;
  }
}
</style>
