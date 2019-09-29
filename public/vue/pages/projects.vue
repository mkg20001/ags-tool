<template>
  <div>
    <page resource="projects" :allowCreate="$user.loggedIn" :allowView="true" :allowEdit="$user.loggedIn">
      <template v-slot:headerTable>
        <br>
        <h1>{{ $t('projects.title') }}</h1>
        <h5>{{ $t('projects.desc') }}</h5>
        <br>
      </template>

      <template slot="contentTable" scope="t">
        <div class="pr-list">
          <div :style="'background: ' + color(row.colorSeed || row.id)" class="pr-box" v-for="row in t.data">
            <h1 @click="t.eView(row.id)">{{row.title}}</h1>
            <h4 v-for="line in row.desc.split('\n')">{{line}}</h4>
          </div>
        </div>
        <table>
          <tbody>
          </tbody>
        </table>
      </template>

      <template slot="singleView" scope="t">
        <br>
        <h1>{{ $t('projects.single') }} {{t.item.title}}</h1>

        <br>
        <h2>{{ $t('projects.maintainer') }}: <a :href="t.item.maintainerUrl">{{t.item.maintainer}}</a></h2>

        <br>
        <h2>{{ $t('projects.description') }}</h2>
        <p v-for="line in t.item.desc.split('\n')">{{line}}</p>
      </template>

      <template slot="singleEdit" scope="t">
        <br>
        <h1 v-if="t.isCreate">{{ $t('projects.createTitle') }}</h1>
        <h1 v-else>{{ $t('projects.single') }} {{t.item.title}}</h1>
        <br>

        <input class="f f-input" type="text" v-model="t.item.title" placeholder="Titel"></input>
        <input class="f f-input" type="text" v-model="t.item.maintainer" placeholder="Maintainer"></input>
        <input class="f f-input" type="text" v-model="t.item.maintainerUrl" placeholder="Maintainer URL (bspws mailto:email@example.com, https://wiki.piratenpartei.de/...)"></input>
        <textarea class="f f-textarea" v-model="t.item.desc" placeholder="Beschreibung (bis zu 16384 Zeichen)"></textarea>
        <input class="f f-input" type="text" v-model="t.item.colorSeed" placeholder="Englische Zufallsbegriffe für Hintergrundfarbe (optional)"></input>
      </template>
    </page>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import page from './page.vue'
  import color from 'string-to-color'

  export default {
    name: 'projects',
    data: () => ({ }),
    methods: {
      color
    },
    components: {
      page
    }
  }
</script>
