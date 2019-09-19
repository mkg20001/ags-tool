<template>
  <div>
    <br>
    <br>

    <center>
      <h1 style="font-size: 4em">{{ $t('pad.select') }}</h1>
      <br>
      <span class="main-page-btn">
        <input style="display: block; font-size: 3em; max-width: 256px; font-weight: bold;" type="text" name="pad" v-model="padId">
        <a style="display: block" v-if="padId" :href="'/pad/' + padId"><i class="fas fa-check"></i></a>
      </span>
    </center>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'pad-select',
    data: () => ({
      padId: ''
    }),
  }
</script>
