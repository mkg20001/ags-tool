<template>
  <div id="app" :class="$ui.dark ? 'ui ui-dark' : 'ui'">
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="/">AGS Tool</a>

      <div>
        <a v-if="$user.loggedIn" style="border: none !important;" href="/profile" class="btn btn-outline-secondary">
          <i class="fa fa-user-circle"></i> {{$user.display}}
        </a>
        <a v-else href="/auth/sso" class="btn btn-outline-dark">
          <i class="fa fa-user-circle"></i> Anmelden
        </a>
      </div>
    </nav>

    <div class="content">
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
