const syncedData = (mainObject, defaults, onChange) => {
  let out = {}

  for (const key in defaults) { // eslint-disable-line guard-for-in
    Object.defineProperty(out, key, {
      // Create a new getter for the property
      get: function () {
        return mainObject[key] === undefined ? defaults[key] : mainObject[key]
      },
      // Create a new setter for the property
      set: async function (val) {
        if (mainObject[key] !== val) {
          try {
            await onChange(key, val, Object.assign(Object.assign({}, mainObject), {[key]: val}))
            mainObject[key] = val // don't change anything until saved, so user notices it wasn't saved
          } catch (err) {
            console.error(err.stack) // TODO: tell setter about error
          }
        }
      }
    })
  }

  return out
}

export default syncedData
