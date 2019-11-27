<template>
  <q-page>
    <token-manager></token-manager>
  </q-page>
</template>

<script>
import TokenManagerVue from 'components/settings/auth/TokenManager.vue'

export default {
  name: 'PageInstance',
  components: {
    'token-manager': TokenManagerVue
  },
  data () {
    return {
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
</style>
