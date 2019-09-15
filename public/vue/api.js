const api = ({versionPrefix}) => {
  const fetch = window.fetch

  const base = `/api/${versionPrefix}/`

  const API = {
    json: async (url) => {
      const req = await fetch(`${base}${url}`)
      const json = await req.json()

      json._req = req

      return json
    },
    areWeLoggedInYet: async () => {
      // TODO: fetch profile, return false if 403, return true if 200
      const req = await fetch(`${base}user/profile`)
      return req.status < 400 // TODO: does it throw when 5XX?
    }
  }

  return API
}

export default api
