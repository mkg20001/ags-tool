<template>
  <div v-if="$user" id="app" :class="$ui.dark ? 'ui ui-dark' : 'ui'">
    <nav class="navbar navbar-dark bg-dark">
      <div class="grid">
        <a v-on:click="toggleNav">
          <button type="button" class="btn bmd-btn-icon" style="margin-top: -8px; margin-right: 4px; color: white">
            <i class="material-icons">menu</i>
          </button>
        </a>
        <a class="navbar-brand" href="/">PMail</a>
      </div>
      <button type="button" class="btn" style="color: white; margin-bottom: -2px;">
        <div class="grid">
          <span style="position: relative; top: -4px; margin-right: 6px;">{{$user.display}}</span>
          <i class="fas fa-user-circle" style="font-size: 1.5rem; line-height: 1"></i>
        </div>
      </button>
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

  <div v-else id="login">
    <router-view></router-view>
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
