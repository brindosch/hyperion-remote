import { compareSemVer, isValidSemVer/*, parseSemVer */ } from 'semver-parser'

export default {
  name: 'semVerMixin',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    // Test if Hyperion Server Version matches at least the given version
    // During startup this will be always false
    minServerVersion (minVersion) {
      const hver = this.$store.state.api.sysInfo.hyperion.version
      return (this.__isValid(hver) && this.__isValid(minVersion) && compareSemVer(minVersion, hver) >= 0)
    },
    __isValid (ver) {
      const res = isValidSemVer(ver)
      if (!res) { this.$q.notify({ message: `Failed to parse Version (semver): ${ver}`, color: 'negative' }) }
      return res
    }
  }
}
