<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  font-family: 'Helvetica Neue', Helvetica, sans;
  font-size: 25px;
  background-color: rgba(23, 54, 23, 0.2);
}

label {
  margin-bottom: 0.5rem;
}

input {
  text-align: left;
  min-width: 440px;
  padding: 5px 10px;
  font-size: 18px;
  border: 2px solid #bbb;
  border-radius: 10px;
}

input[type=radio] {
  position: relative;
  bottom: 2px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 2rem auto;
  max-width: 600px;
  text-align: center;
  text-shadow: 0 1px #fff;
}

button {
  font-size: 14px;
  min-width: 180px;
  border: 2px solid #bbb;
  border-radius: 10px;
  padding: 7px 10px;
  text-shadow: 0 1px #ccc;
  background-color: rgba(64, 111, 76, 0.7);
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: rgba(64, 111, 76, 0.55);
}
</style>
