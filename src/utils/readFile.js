// Reads and parse a file, returns data on success. Throws on error
export async function readFile (file) {
  if (file.type.includes('image')) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()

      reader.addEventListener('load', () => {
        resolve(reader.result)
      }, false);
      reader.readAsDataURL(file)
    })
  } else if (file.type.includes('json')) {
    let res = await file.text()
    try {
      return JSON.parse(res)
    } catch (error) {
      throw {
        name: error.name,
        message: this.$t('validate.parseFile', [`'${file.name}''`, error.message])`Failed to parse file '${file.name}'. Error: ${error.message}`
      }
    }
  } else {
    throw {
      name: 'NotImplemented',
      message: `Unhandled readFile type: ${file.type}`
    }
  }
}
export default { readFile }