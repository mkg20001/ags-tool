<template>
  <div>
    <br>
    <h1>{{ $t('profile.title') }}</h1>
    <h5>{{ $t('profile.desc') }}</h5>
    <br>

    <br>
    <h2>{{ $t('profile.name') }}</h2>
    <div class="lower-layer">
      <label>
        <input type="text" v-model="$user.display">
        <a class="btn btn-outline-secondary no-border" onclick="updateUser('display')"><i class="fas fa-check"></i></a>
      </label>
    </div>

    <br>
    <h2>{{ $t('profile.email') }}</h2>
    <div class="lower-layer">
      <label>
        <input type="text" v-model="$user.email">
        <a class="btn btn-outline-secondary no-border" onclick="updateUser('email')"><i class="fas fa-check"></i></a>
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'profile',
    data () {
      return this.$user
    }
  }
</script>
