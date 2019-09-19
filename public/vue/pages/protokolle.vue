<template>
  <div>
    <br>
    <h1>{{ $t('protokolle.title') }}</h1>
    <h5>{{ $t('protokolle.desc') }}</h5>
    <br>

    <pagination resource="protokolle" tableClass="table table-hover">
      <template v-slot:header>
        <th scope="col">#</th>
        <th scope="col">Titel</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template v-slot:row>
        <th scope="row">{{row.id}}</th>
        <td>{{row.title}}</td>
        <td>{{row.createdAt}}</td>
        <td><a :href="'/protokoll/' + row.id"><i class="fas fa-link"></i></a></td>
        <td><a v-if="$user.p.admin" href="#" onclick="deleteprotokoll(row.id)"><i class="fas fa-trash"></i></a></td>
      </template>
    </pagination>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import pagination from './pagination.vue'

  export default {
    name: 'protokolle',
    data: () => ({ }),
    components: {
      pagination
    }
  }
</script>
