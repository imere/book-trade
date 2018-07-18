<template>
<div class="home container">

<p>
  Book Trade
</p>
<p>
  find your favorite books here
</p>

</div>
</template>
<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  beforeCreate () {
    this.$root.$emit('init')
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  text-align: center;
  overflow: hidden;
  p {
    color: var(--light);
    margin: 50px auto;
  }
  p:nth-of-type(1) {
    font-size: 4rem;
  }
  p:nth-of-type(2) {
    font-size: 2rem;
  }
}
</style>
