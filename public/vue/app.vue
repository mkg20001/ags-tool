<template>
  <div id="app" :class="$ui.dark ? 'ui ui-dark' : 'ui'">
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="/">AGS Tool</a>
    </nav>

    <div>
      <div v-if="$ui.loading">
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
      </div>

      <div v-else class="margin-16">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return { }
  },
  methods: {
    toggleNav: () => {
      this.$ui.showNav = !this.$ui.showNav
    }
  }
}
</script>

<style lang="css"></style>
