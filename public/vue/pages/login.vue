<template>
  <div class="login-page">
    <div class="apply-dark-magic">
      <div class="col-4 mx-auto" style="min-width: 256px !important">
        <center>
          <div style="text-align: left !important;" v-if="err" class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>{{ $t('login.error') }}</strong> {{ err }}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div style="background-color: #e9ecefd0; border-radius: .3rem; padding: 1rem;">
            <h4>{{ $t('login.title') }}</h4>

            <div class="form-group">
              <label for="username">{{ $t('login.username') }}</label>
              <input v-model="auth.username" type="text" class="form-control" id="username" :placeholder="$t('login.username')">
            </div>

            <div class="form-group">
              <label for="username">{{ $t('login.password') }}</label>
              <input v-model="auth.password" type="password" class="form-control" id="password" :placeholder="$t('login.password')">
            </div>

            <button type="submit" class="btn btn-primary">{{ $t('login.title') }}</button>
          </div>
        </center>
      </div>
    </div>

    <!-- unsplash credits -->
    <div style="position: fixed; right: 0; bottom: 0;">
      <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@heysupersimi?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Simone Hutsch"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Simone Hutsch</span></a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
  export default {
    name: 'login',
    data: () => ({
      auth: {
        username: '',
        password: ''
      },
      err: ''
    }),
    methods: {
      login: () => {
        this.$api.post('login', this.auth).then((res) => {
          window.location.reload()
        }, (err) => {
          this.err = err.toString()
        })
      }
    }
  }
</script>
