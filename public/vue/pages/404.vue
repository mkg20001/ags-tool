<template>
  <div>
    <center>
      <h1>{{ $t('404.title') }}</h1>
      <h2>
        <tt>{{$route.path}}</tt><br>
        <span>{{ $t('404.desc') }}</span>
      </h2>
    </center>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: '404',
    data: () => ({}),
  }
</script>
