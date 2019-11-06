const freeze = {
  name: 'freeze',
  data () {
    return {
    }
  },
  methods: {
    freeze (data) {
      if (Array.isArray(data)) {
        data.forEach(entry => this.freeze(entry))
      }
      if (typeof data === 'object') {
        Object.freeze(data)
        for (let o in data) {
          this.freeze(o)
        }
      }
    },
    unfreeze (data) {
      return JSON.parse(JSON.stringify(data))
    }
  }
}

const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz']
const allUniqueChars = [...'~!@#$%^&*()_+-=[]{}|;:",./<>?']
const allNumbers = [...'0123456789']
const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha, ...allUniqueChars]

const getRandomHash = {
  name: 'getrandommnumber',
  data () {
    return {
    }
  },
  methods: {
    getRandomHash (len = 10) {
      return [...Array(len)]
        .map(i => base[Math.random() * base.length | 0])
        .join('')
    }
  }
}

export { freeze, getRandomHash }
