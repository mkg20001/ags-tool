<template>
  <div>
    <page resource="protokolle" tableClass="table table-hover">
      <template v-slot:headerTable>
        <br>
        <h1>{{ $t('protokolle.title') }}</h1>
        <h5>{{ $t('protokolle.desc') }}</h5>
        <br>
      </template>

      <template v-slot:headerRow>
        <th scope="col">#</th>
        <th scope="col">Titel</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template slot="row" scope="t">
        <th scope="row">{{t.row.id}}</th>
        <td>{{t.row.title}}</td>
        <td>{{t.row.createdAt}}</td>
        <td><a :href="'/protokoll/' + t.row.id"><i class="fas fa-link"></i></a></td>
        <td><a v-if="$user.p.admin" href="#" onclick="deleteprotokoll(t.row.id)"><i class="fas fa-trash"></i></a></td>
      </template>
    </page>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import page from './page.vue'

  export default {
    name: 'protokolle',
    data: () => ({ }),
    components: {
      page
    }
  }
</script>
