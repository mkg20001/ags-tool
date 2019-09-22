<template>
  <div>
    <!-- idea: multiple archive types for documents. basically like internal export. to convert to stuff like a project or sth -->

    <page resource="pads" tableClass="table table-hover" :allowCreate="true" :defaults="{id: '', template: ''}">
      <template v-slot:headerTable>
        <br>
        <h1>{{ $t('padadmin.title') }}</h1>
        <h5>{{ $t('padadmin.desc') }}</h5>
        <br>
      </template>

      <template v-slot:headerRow>
        <th scope="col">#</th>
        <th scope="col">Erstellt am</th>
        <th style="width: 8px;" scope="col"><i class="fas fa-link"></i></th>
        <th style="width: 8px;" scope="col"><i class="fas fa-archive"></i></th>
        <th style="width: 8px;" scope="col"><i class="fas fa-trash"></i></th>
      </template>

      <template slot="row" scope="t">
        <th scope="row">{{t.row.id}}</th>
        <td>{{t.row.createdAt}}</td>
        <td><a :href="'/pad/' + t.row.id"><i class="fas fa-link"></i></a></td>
        <td><a @click="archivePad(t.row.id)"><i class="fas fa-archive"></i></a></td>
        <td><a @click="t.eDelete()"><i class="fas fa-trash"></i></a></td>
      </template>

      <template slot="singleEdit" scope="t">
        <br>
        <h1>{{ $t('padadmin.create') }}</h1>

        <input type="text" class="f f-input" v-model="t.item.id" placeholder="Pad-Id">

        <select class="f f-select" v-model="t.item.template">
          <option disabled value="">{{ $t('padadmin.selectTemplate') }}</option>
          <option v-for="template in templates" :value="template">{{template}}</option>
        </select>
      </template>
    </page>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  import page from './page.vue'

  export default {
    name: 'pad-admin',
    data: () => ({
      templates: []
    }),
    async mounted () {
      const res = await window.fetch('/api/v0/pads/templates')
      this.templates = await res.json()
    },
    components: {
      page
    }
  }
</script>
