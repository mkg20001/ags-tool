<template>
  <div>
    <page resource="tasks" tableClass="table table-hover" :allowCreate="$user.loggedIn">
      <template v-slot:headerTable>
        <br>
        <h1>{{ $t('tasks.title') }}</h1>
        <h5>{{ $t('tasks.desc') }}</h5>
        <br>
      </template>

      <template v-slot:headerRow>
        <th scope="col">#</th>
        <th scope="col">Titel</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template slot="rowList" scope="t">
        <tr v-for="row in t.data">
          <th scope="row">{{row.id}}</th>
          <td>{{row.title}}</td>
          <td>{{row.createdAt}}</td>
          <td><a :href="'/task/' + row.id"><i class="fas fa-link"></i></a></td>
          <td><a v-if="$user.p.admin" href="#" onclick="deleteprotokoll(row.id)"><i class="fas fa-trash"></i></a></td>
        </tr>
      </template>

      <template slot="single" scope="t">
        <br>
        <h1 v-if="t.isCreate">{{ $t('tasks.createTitle') }}</h1>
        <h1 v-else>{{ $t('tasks.single') }} {{item.name}}</h1>
        <br>
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
    data: () => ({ }),
    components: {
      page
    }
  }
</script>
