<template>
  <div>
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
          <slot name="rowOuter" :data="data">
            <tr v-for="row in data">
              <slot name="row" :row="row">
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
    <div v-else-if="view === 'single'">
      <form>
        <slot name="single" :isCreate="$route.params.id === 'create'" :item="item">
          <h2>ERROR: {{resource}} single-view not implemented</h2>
        </slot>
      </form>
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
      allowCreate: Boolean
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
      changePage: function (...a) {
        const newRoute = Object.assign({}, this.$route)
        newRoute.query = this.getPageParams(...a)
        this.$router.push(newRoute)
      },
      changeView: function (view) {
        const newRoute = Object.assign({}, this.$route)
        delete newRoute.query
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
        const {id} = this.$route.params

        switch (true) {
          case id === 'create': {
            this.item = this.defaults || {}
            this.view = 'single'
            break
          }
          case Boolean(id): {
            this.getSingle(id)
            break
          }
          case !id: {
            this.view = 'loading'
            // TODO: fetch page
            if (!this.$route.query.page) {
              this.changePage()
            } else {
              await this.doFetch()
              this.view = 'table'
            }
            break
          }
        }
      }
    },
    data: () => ({
      data: [],
      item: {},
      page: {
        curPage: 1,
        perPage: 25
      },
      view: 'loading'
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
