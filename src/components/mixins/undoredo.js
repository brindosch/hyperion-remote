import { freeze, getRandomHash } from './freeze'

const undoredo = {
  name: 'undoredo',
  mixins: [freeze, getRandomHash],
  data () {
    // original snippet from: https://codepen.io/kfly8/pen/JENdMx
    return {
      history: [],
      historyIndex: 0
    }
  },
  computed: {
    canUndo () {
      return this.historyIndex > 0
    },
    canRedo () {
      return this.history.length - 1 - this.historyIndex > 0
    }
  },
  methods: {
    resetUndoItems () {
      this.history = []
      this.historyIndex = 0
    },
    storeUndoItem (item) {
      // unfreeze and unique ids
      let entry = this.unfreeze(item)
      entry = entry.map(x => Object.assign(x, { id: this.getRandomHash() }))
      this._log(entry)
    },
    _log (historyItems) {
      this.historyIndex += 1
      this.history.splice(this.historyIndex)
      this.history.push(historyItems)
    },
    undoItem () {
      if (this.canUndo) {
        this.historyIndex -= 1
        return this.history[this.historyIndex]
      }
    },
    redoItem () {
      if (this.canRedo) {
        this.historyIndex += 1
        return this.history[this.historyIndex]
      }
    }
  }
}

export { undoredo }
