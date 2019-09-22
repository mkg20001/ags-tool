<template>
  <div>
    <slot name="error" :error="error">
      <br v-if="error">
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error!</strong> {{error}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="error = null">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </slot>

    <div v-if="view === 'table'">
      <slot name="headerTable">
        <h1>{{resource}}</h1>
      </slot>

      <table :class="tableClass">
        <thead>
          <tr>
            <slot name="headerRow">
              <th scope="col">#</th>
            </slot>
          </tr>
        </thead>
        <tbody>
          <slot name="rowList" :data="data" :eDelete="(id) => deleteElement(id)" :eView="(id) => changeView(id)" :eEdit="(id) => changeView(id, {edit: '1'})">
            <tr v-for="row in data">
              <slot name="row" :row="row" :eDelete="() => deleteElement(row.id)" :eView="() => changeView(row.id)" :eEdit="() => changeView(row.id, {edit: '1'})">
                <th scope="row">{{row.id}}</th>
              </slot>
            </tr>
          </slot>
        </tbody>
      </table>

      <slot name="tadd" :link="() => changeView('create')">
        <div v-if="allowCreate" @click="changeView('create')" class="btn btn-danger btn-fab"><i class="fas fa-plus"></i></div>
      </slot>
    </div>
    <div v-else-if="view === 'singleEdit'">
      <slot name="singleEditOuter">
        <form>
          <slot name="singleEdit" :isCreate="$route.params.id === 'create'" :item="item">
            <h2>ERROR: {{resource}} single-edit not implemented</h2>
          </slot>
          <slot name="singleEditActions" :isCreate="$route.params.id === 'create'" :item="item">
            <div v-if="$route.params.id === 'create'" @click="submit()" class="btn btn-info btn-fab"><i class="fas fa-check"></i></div>
            <div v-else @click="submit()" class="btn btn-info btn-fab"><i class="fas fa-save"></i></div>
          </slot>
        </form>
      </slot>
    </div>
    <div v-else-if="view === 'singleView'">
      <slot name="singleViewOuter">
        <slot name="singleView" :item="item">
          <h2>ERROR: {{resource}} single-view not implemented</h2>
        </slot>
        <slot name="singleViewActions" :eEdit="() => changeView(item.id, {edit: '1'})" :item="item">
          <div v-if="false" todo="fix multifabs" @click="window.history.back()" class="btn btn-info btn-fab"><i class="fas fa-arrow-left"></i></div>
          <div v-if="allowEdit" @click="changeView(item.id, {edit: '1'})" class="btn btn-info btn-fab"><i class="fas fa-pen"></i></div>
        </slot>
      </slot>
    </div>
    <div v-else-if="view === 'loading'">
      <br>
      <br>

      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>


<script>
/*

We have $id:
 - downwards that id
   SELECT * FROM $table WHERE id greaterThan $afterId ORDER BY ID ASC LIMIT $perPage
 - upwards that id
   SELECT * FROM $table WHERE id lowerThan $beforeId

*/

  export default {
    name: 'page',
    props: {
      resource: String,
      tableClass: String,
      defaults: Object,
      allowCreate: Boolean,
      allowView: Boolean,
      allowEdit: Boolean,
      allowDelete: Boolean,
      enableDirectEdit: Boolean
    },
    methods: {
      getPageParams: function (gotoPage, relPage, perPage) {
        return {
          page: relPage ? (this.page.curPage + relPage) : gotoPage ? gotoPage : this.page.curPage,
          perPage: perPage || this.page.perPage
        }
      },
      doFetch: async function () {
        const res = await window.fetch(`/api/v0/${this.resource}?` + String(new URLSearchParams(this.$route.query)))
        const data = await res.json()

        const totalCount = parseInt(res.headers.get('x-total-count'), 10)
        const curPage = parseInt(res.headers.get('x-current-page'), 10)
        const perPage = parseInt(res.headers.get('x-per-page'), 10)
        const hasNext = JSON.parse(res.headers.get('x-has-next'))
        const hasPrev = JSON.parse(res.headers.get('x-has-prev'))

        this.data = data
        this.page = {
          totalCount,
          curPage,
          perPage,
          hasNext,
          hasPrev
        }
      },
      fetchSingle: async function (id) {
        const res = await window.fetch(`/api/v0/${this.resource}/${id}`)
        const data = await res.json()

        this.item = data
      },
      changePage: function (...a) {
        const newRoute = Object.assign({}, this.$route)
        newRoute.query = this.getPageParams(...a)
        this.$router.push(newRoute)
      },
      changeView: function (view, query) {
        const newRoute = Object.assign({}, this.$route)
        newRoute.query = query
        // TODO: make better
        const hasView = newRoute.params.id != null
        if (view) {
          if (hasView) {
            newRoute.path = newRoute.path.replace(/\/[a-z0-9]+$/, '/' + view)
          } else {
            newRoute.path += '/' + view
          }
        } else {
          if (hasView) {
            newRoute.path = newRoute.path.replace(/\/[a-z0-9]+$/, '')
          }
        }
        this.$router.push(newRoute)
      },
      getViewFromRoute: async function () {
        this.error = null

        const {id} = this.$route.params

        switch (true) {
          case id === 'create': {
            if (this.allowCreate) {
              this.item = this.defaults || {}
              this.view = 'singleEdit'
            } else {
              this.error = 'Create not allowed. Perhaps you need to sign-in?'
            }
            break
          }
          case Boolean(id): {
            this.view = 'loading'
            if (this.allowView || this.allowEdit) {
              try {
                await this.fetchSingle(id)
                if (this.$route.query.edit || this.enableDirectEdit) {
                  if (this.allowEdit) {
                    this.view = 'singleEdit'
                  } else {
                    this.error = 'Edit not allowed. Perhaps you need to sign-in?'
                  }
                } else {
                  if (this.allowView) {
                    this.view = 'singleView'
                  } else {
                    this.error = 'View not allowed. Perhaps you need to sign-in?'
                  }
                }
              } catch (err) {
                this.error = err.toString()
              }
            } else {
              this.error = 'Single view not allowed. Perhaps you need to sign-in?'
            }
            break
          }
          case !id: {
            this.view = 'loading'
            // TODO: fetch page
            if (!this.$route.query.page) {
              this.changePage()
            } else {
              try {
                await this.doFetch()
                this.view = 'table'
              } catch (err) {
                this.error = err.toString()
              }
            }
            break
          }
        }
      },
      submit: async function () {
        try {
          const res = await window.fetch(`/api/v0/${this.resource}${this.$route.params.id === 'create' ? '' : '/' + this.$route.params.id}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.item)
          })
          const data = await res.json()

          if (data.error) {
            this.view = 'single'
            return (this.error = data.error)
          } else {
            this.changeView()
          }
        } catch (err) {
          return (this.error = this.err.toString())
        }
      },
      deleteElement: async function (id) {
        const result = await window.swal.fire({
          title: `Delete Element ${id}`,
          text: 'Are you sure?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Delete',
          showLoaderOnConfirm: true,
          preConfirm: async (login) => {
            let res = await window.fetch(`/api/v0/${this.resource}/${id}`, {method: 'DELETE'})
            res = await res.json()
            if (res.ok) {
              window.swal.fire('Deleted', 'Element was deleted', 'success')
              await this.getViewFromRoute()
            } else {
              window.swal.error('Error', res.error, 'error')
            }
          }
        })
      }
    },
    data: () => ({
      data: [],
      item: {},
      page: {
        curPage: 1,
        perPage: 25
      },
      view: 'loading',
      error: null
    }),
    mounted () {
      this.getViewFromRoute()
    },
    watch: {
      $route (to, from){
        this.getViewFromRoute()
      }
    }
  }
</script>
