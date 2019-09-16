<template>
  <div>
    <h1>{{ $t('padadmin.title') }}</h1>

    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Erstellt am</th>
          <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
          <th style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pad in pads">
          <th scope="row">{{pad.id}}</th>
          <td>{{pad.createdAt}}</td>
          <td><a :href="'/pad/' + pad.id"><i class="fas fa-link"></i></a></td>
          <td><a href="#" onclick="deletePad(pad.id)"><i class="fas fa-trash"></i></a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'pad-admin',
    data: () => ({
      pads: []
    }),
  }
</script>
