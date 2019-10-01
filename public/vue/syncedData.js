const syncedData = (mainObject, defaults, onChange) => {
  const handler = {
    get: (obj, key) => {
      return mainObject[key] === undefined ? defaults[key] : mainObject[key]
    },
    set: (obj, key, val) => {
      if (mainObject[key] !== val) {
        mainObject[key] = val // we have to set it here, since .get is called right after .set
        onChange(key, val, mainObject)
      }
    }
  }

  let out = new Proxy({}, handler)

  return out
}

export default syncedData
