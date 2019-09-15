<template>
  <div>
    <br>
    <br>

    <center>
      <h1 style="font-size: 4em">{{ $t('home.welcome') }}</h1>
      <br>
      <span class="btn-group-lg main-page-btn">
        <a href="/admin"> <!-- v-if="$user.permission.admin" -->
          <button type="button" class="btn btn-danger bmd-btn-fab">
            <i class="fas fa-sliders-h"></i>
          </button>
        </a>
        <a href="/profile">
          <button type="button" class="btn btn-success bmd-btn-fab">
            <i class="far fa-user-circle"></i>
          </button>
        </a>
        <a href="/settings">
          <button type="button" class="btn btn-info bmd-btn-fab">
            <i class="fas fa-cog"></i>
          </button>
        </a>
      </span>
    </center>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'home',
    data: () => ({}),
  }
</script>
