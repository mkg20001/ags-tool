<template>
  <div id="app" :class="$ui.dark ? 'ui ui-dark' : 'ui'">
  <nav>
    <div class="nav-right">
      <div class="brand">AGS Tools</div>
    </div>
    <div class="nav-left">
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#" class="btn btn-main">Login</a></li>
        <li><a href="#" class="btn btn-main-inv">Register</a></li>
      </ul>
    </div>
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
