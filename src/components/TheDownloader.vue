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
        <button @click="download()" v-else>Download</button>
      </div>
    </div>
    <div class="files" v-if="files.length">
      <h4>Files</h4>
      <div class="file" v-for="file in files" :key="file.id">
        <template v-if="file.name">
          <a :href="'http://localhost:3000/' + file.id + '/' + file.name" target="_blank">
            {{ file.name }}
          </a>
          <span class="done">{{ file.done }}%</span>
        </template>
        <span v-else>Please wait, adding to queue...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheDownloader',
  data() {
    return {
      address: 'https://www.youtube.com/watch?v=07d2dXHYb94',
      format: 'music',
      downloading: false
    }
  },
  methods: {
    async download() {
      this.downloading = true
      const file = await this.$store.dispatch('download', this)
      if (file.error) {
        alert(file.error)
        this.downloading = false
      } else {
        console.log('FILE:', file.id)

        while(this.downloading) {
          await new Promise(r => setTimeout(() => { r() }, 1000))
          console.log('POLLING')
          const status = await this.$store.dispatch('status', file.id)
          console.log('RECEIVED STATUS:', status)
          if (status.done === '100') {
            this.downloading = false
          }
        }
      }
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
    .file {
      margin-bottom: 0.3rem;
    }
  }
}
</style>
