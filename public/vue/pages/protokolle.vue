<template>
  <div>
    <br>
    <h1>{{ $t('protokolle.title') }}</h1>
    <h5>{{ $t('protokolle.desc') }}</h5>
    <br>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Titel</th>
          <th scope="col">Erstellt am</th>
          <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
          <th v-if="$user.p.admin" style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="protokoll in protokolls">
          <th scope="row">{{protokoll.id}}</th>
          <td>{{protokoll.title}}</td>
          <td>{{protokoll.createdAt}}</td>
          <td><a :href="'/protokoll/' + protokoll.id"><i class="fas fa-link"></i></a></td>
          <td><a v-if="$user.p.admin" href="#" onclick="deleteprotokoll(protokoll.id)"><i class="fas fa-trash"></i></a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'protokolle',
    data: () => ({
      protokolls: []
    }),
  }
</script>
