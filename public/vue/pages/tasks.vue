<template>
  <div>
    <br>
    <h1>{{ $t('tasks.title') }}</h1>
    <h5>{{ $t('tasks.desc') }}</h5>
    <br>

    <pagination resource="tasks" tableClass="table table-hover">
      <template v-slot:header>
        <th scope="col">#</th>
        <th scope="col">Titel</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template slot="rowouter" scope="t">
        <tr v-for="row in t.data">
          <th scope="row">{{row.id}}</th>
          <td>{{row.title}}</td>
          <td>{{row.createdAt}}</td>
          <td><a :href="'/task/' + row.id"><i class="fas fa-link"></i></a></td>
          <td><a v-if="$user.p.admin" href="#" onclick="deleteprotokoll(row.id)"><i class="fas fa-trash"></i></a></td>
        </tr>
      </template>
    </pagination>

    <div v-if="$user.loggedIn" class="btn btn-danger btn-fab"><i class="fas fa-plus"></i></div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import pagination from './pagination.vue'

  export default {
    name: 'tasks',
    data: () => ({ }),
    components: {
      pagination
    }
  }
</script>
