const stringToNumber = {
  name: 'stringtonumber',
  data () {
    return {
    }
  },
  methods: {
    stringExpToInteger (data) {
      // converts a string like this: "5,7,6-10,garbabe,75da.,.vc"
      // TO Array with unique Integers: 5,7,6,7,8,9,10
      return this.__stringExpToNumber(data, 'int', 1)
    },
    stringExpToFloat (data) {
      // converts a string like this: "5.7,7.2,6.2-9.77,gargabe,75da.,.vc"
      // TO Array with unique Floats: 5.7,7.2,6.2,7,8
      return this.__stringExpToNumber(data, 'float', 1.0)
    },
    __stringExpToNumber (data, type, step) {
      if (data === undefined) { return [] }
      data.trim()
      if (data.includes(',')) {
        data = data.split(',')
        this.__handleRangeDelim(data, type, step)
      } else {
        data = [data]
        this.__handleRangeDelim(data, type, step)
      }
      // parse to Integer or Float
      data.forEach((val, i, self) => { self[i] = (type === 'int') ? parseInt(val) : parseFloat(val) })

      // filter against NaN
      data = data.filter((val, i, self) => val !== 'NaN')

      // unique entries
      return data.filter((val, i, self) => self.indexOf(val) === i)
    },
    __parseNumber (val, type) {
      return (type === 'int') ? parseInt(val) : parseFloat(val)
    },
    __handleRangeDelim (data, type, step) {
      data.forEach((val, i, ctx) => {
        if (val.includes('-')) {
          let range = val.split('-')
          if (range.length === 2) {
            // parse / validate range
            range[0] = this.__parseNumber(range[0], type)
            range[1] = this.__parseNumber(range[1], type)
            if (range[0] === 'NaN' || range[1] === 'NaN') { return }
            // swap if required
            let min, max
            min = Math.min(range[0], range[1])
            max = Math.max(range[0], range[1])

            for (let ix = min; ix < max + 1; ix += step) { ctx.push(ix) }
          }
          ctx.splice(i, 1)
        }
      })
      return data
    }
  }
}

export { stringToNumber }
