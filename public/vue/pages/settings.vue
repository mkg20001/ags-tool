<template>
  <div style="text-align: left; max-width: 512px; margin: auto;">
    <br>
    <h1>{{ $t('settings.title') }}</h1>

    <div class="lower-layer">
      <form>
        <h2>{{ $t('settings.lang') }}</h2>

        <div v-for="(lang, i) in langs" class="lower-layer">
          <label>
            <input v-model="$i18n.locale" id="i18n" type="radio" :key="`Lang${i}`" :value="lang"> <!--  name="optionsRadios" id="optionsRadios1" value="option1" checked -->
            {{ $t('settings.locale.' + lang) }}
          </label>
        </div>

        <h2>{{ $t('settings.dark') }}</h2>

        <div class="lower-layer">
          <label>
            <input type="checkbox" v-model="$ui.dark">
            {{ $t('settings.dark_desc') }}
          </label>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'settings',
    data () {
      return { langs: Object.keys(require('../locales')).filter(k => k.length === 2) }
    }
  }
</script>
