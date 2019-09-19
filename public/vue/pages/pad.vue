<template>
  <div>
    <div id="dapad"></div>
  </div>
</template>

<style lang="scss" scoped>
#dapad {
  min-height: 90vh;
  overflow-y: scroll;
}
</style>

<script>
  export default {
    name: 'pad',
    data: () => ({}),
    mounted () {
      const padId = this.$route.params.id
      const authorId = this.$user.id || 'g' + String(Math.random()).replace(/[^1-9]/g, '').substr(0, 6)

      const client = require('da-pad/src/client')

      client(
        {
          authorId,
          padId
        },
        {
          htmlField: '#dapad'
        },
        {
          padServer: window.location.host,
          serverAuth: 'TODOADDAUTH'
        },
        client.localStorage(padId))
    }
  }
</script>
