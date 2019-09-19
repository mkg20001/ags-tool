<template>
  <table :class="tableClass">
    <thead>
      <tr>
        <slot name="header">
          <th scope="col">#</th>
        </slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data">
        <slot name="row">
          <th scope="row">{{row.id}}</th>
        </slot>
      </tr>
    </tbody>
  </table>
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
    name: 'pagination',
    props: {
      resource: String,
      tableClass: String
    },
    methods: {
      getParams: function (gotoPage, relPage, perPage) {
        return {
          page: relPage ? (this.page.curPage + relPage) : gotoPage ? gotoPage : this.page.curPage,
          perPage: perPage || this.page.perPage
        }
      },
      doFetch: async function (...a) {
        this.$emit('startLoading')

        const res = await this.$api.json(`${this.resource}?` + String(new URLSearchParams(this.getParams(...a))))
        const data = await res.json()

        const totalCount = parseInt(res.header.get('x-total-count'), 10)
        const curPage = parseInt(res.header.get('x-current-page'), 10)
        const perPage = parseInt(res.header.get('x-per-page'), 10)
        const hasNext = JSON.parse(res.header.get('x-has-next'))
        const hasPrev = JSON.parse(res.header.get('x-has-prev'))

        this.data = data
        this.page = {
          totalCount,
          curPage,
          perPage,
          hasNext,
          hasPrev
        }

        this.$emit('change', this.page)

        this.$emit('stopLoading')
      }
    },
    data: () => ({
      data: [],
      page: {
        curPage: 1,
        perPage: 25
      }
    }),
    mounted () {
      this.doFetch()
    }
  }
</script>
