export default {
  name: 'mimeMixin',
  data () {
    return {}
  },
  methods: {
    // method to get the real mime type of a file based on the first four bytes
    // https://medium.com/the-everyday-developer/detect-file-mime-type-using-magic-numbers-and-javascript-16bc513d4e1e
    async getMimeOfFile (file) {
      return new Promise((resolve, reject) => {
        const filereader = new FileReader()
        filereader.onloadend = (evt) => {
          if (evt.target.readyState === FileReader.DONE) {
            const uint = new Uint8Array(evt.target.result)
            let bytes = []
            uint.forEach((byte) => {
              bytes.push(byte.toString(16))
            })
            const hex = bytes.join('').toUpperCase()
            /*
            {
              filename: file.name,
              filetype: file.type ? file.type : 'Unknown/Extension missing',
              binaryFileType: this._getMimetype(hex),
              hex: hex
            }
            */
            resolve(this._getMimetype(hex))
          }
        }
        const blob = file.slice(0, 4);
        filereader.readAsArrayBuffer(blob);
      })
    },
    _getMimeType (signature) {
      switch (signature) {
        case '89504E47':
          return 'image/png'
        case '47494638':
          return 'image/gif'
        case '25504446':
          return 'application/pdf'
        case 'FFD8FFDB':
        case 'FFD8FFE0':
          return 'image/jpeg'
        case '504B0304':
          return 'application/zip'
        default:
          return ''
      }
    }
  }
}