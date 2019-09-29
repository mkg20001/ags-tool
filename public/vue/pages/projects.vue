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
          <div @click="t.eView(row.id)" :style="'background: ' + color(row.colorSeed || row.id)" class="pr-box" v-for="row in t.data">
            <h1>{{row.title}}</h1>
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
        <div :class="(t.item.stateOpen ? 'bg-green' : 'bg-red') + ' task-bar'">
          <i class="fa fa-info-circle"></i>
          {{ t.item.stateTag || (t.item.stateOpen ? $t('projects.stateOpen') : $t('projects.stateClosed')) }}
        </div>

        <br>
        <h2>{{ $t('projects.description') }}</h2>
        <div>
          {{t.item.desc}}
        </div>
      </template>

      <template slot="singleEdit" scope="t">
        <br>
        <h1 v-if="t.isCreate">{{ $t('projects.createTitle') }}</h1>
        <h1 v-else>{{ $t('projects.single') }} {{t.item.title}}</h1>
        <br>

        <input class="f f-input" type="text" v-model="t.item.title" placeholder="Titel"></input>
        <textarea class="f f-textarea" v-model="t.item.desc" placeholder="Beschreibung (bis zu 16384 Zeichen)"></textarea>
        <textarea class="f f-textarea" v-model="t.item.colorSeed" placeholder="Color Seed"></textarea>
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
