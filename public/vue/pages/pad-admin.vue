<template>
  <div>
    <br>
    <h1>{{ $t('padadmin.title') }}</h1>
    <h5>{{ $t('padadmin.desc') }}</h5>
    <br>

    <!-- idea: multiple archive types for documents. basically like internal export. to convert to stuff like a project or sth -->

    <pagination resource="pads" tableClass="table table-hover">
      <template v-slot:header>
        <th scope="col">#</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th style="width: 8px;" scope="col"><i class="fas fa-archive"></i></th>
        <th style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template v-slot:row>
        <th scope="row">{{row.id}}</th>
        <td>{{row.createdAt}}</td>
        <td><a :href="'/pad/' + row.id"><i class="fas fa-link"></i></a></td>
        <td><a href="#" onclick="archivePad(row.id)"><i class="fas fa-trash"></i></a></td>
        <td><a href="#" onclick="deletePad(row.id)"><i class="fas fa-trash"></i></a></td>
      </template>
    </pagination>

    <div class="btn btn-danger btn-fab"><i class="fas fa-plus"></i></div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import pagination from './pagination.vue'

  export default {
    name: 'pad-admin',
    data: () => ({ }),
    components: {
      pagination
    }
  }
</script>
