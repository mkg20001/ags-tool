<template>
  <div>
    <page resource="tasks" tableClass="table table-hover" :allowCreate="$user.loggedIn" :allowView="true" :allowEdit="$user.loggedIn">
      <template v-slot:headerTable>
        <br>
        <h1>{{ $t('tasks.title') }}</h1>
        <h5>{{ $t('tasks.desc') }}</h5>
        <br>
      </template>

      <template v-slot:headerRow>
        <th scope="col">Titel</th>
        <th scope="col">Erstellt am</th>
        <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template slot="rowList" scope="t">
        <tr :class="colors[row.state]" v-for="row in t.data">
          <td @click="t.eView(row.id)" class="pointy-thingy">{{row.title}}</td>
          <td>{{row.createdAt}}</td>
          <td><a v-if="$user.p.admin" @click="t.eDelete(row.id)"><i class="fas fa-trash"></i></a></td>
        </tr>
      </template>

      <template slot="singleView" scope="t">
        <br>
        <h1>{{ $t('tasks.single') }} {{t.item.title}}</h1>

        <br>
        <div :class="(t.item.stateOpen ? 'bg-green' : 'bg-red') + ' task-bar'">
          <i class="fa fa-info-circle"></i>
          {{ t.item.stateTag || (t.item.stateOpen ? $t('tasks.stateOpen') : $t('tasks.stateClosed')) }}
        </div>

        <br>
        <h2>{{ $t('tasks.description') }}</h2>
        <div>
          {{t.item.desc}}
        </div>
      </template>

      <template slot="singleEdit" scope="t">
        <br>
        <h1 v-if="t.isCreate">{{ $t('tasks.createTitle') }}</h1>
        <h1 v-else>{{ $t('tasks.single') }} {{t.item.title}}</h1>
        <br>

        <input class="f f-input" type="text" v-model="t.item.title" placeholder="Titel"></input>
        <textarea class="f f-textarea" v-model="t.item.desc" placeholder="Beschreibung (bis zu 16384 Zeichen)"></textarea>
        <div class="f f-label"><input type="radio" class="f f-checkbox" v-model="t.item.state" value="0">Offen</div>
        <div class="f f-label"><input type="radio" class="f f-checkbox" v-model="t.item.state" value="1">In arbeit</div>
        <div class="f f-label"><input type="radio" class="f f-checkbox" v-model="t.item.state" value="2">Fertig</div>
        <input class="f f-input" type="text" v-model="t.item.stateTag" placeholder="Genauere Beschreibung des aktuellen Status">
      </template>
    </page>

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import page from './page.vue'

  export default {
    name: 'tasks',
    data: () => ({
      colors: ['bg-red', 'bg-yellow', 'bg-green']
    }),
    methods: {log: console.log},
    components: {
      page
    }
  }
</script>
