<template>
  <q-page>
    <instance-manager></instance-manager>
  </q-page>
</template>

<script>
import InstanceManagerVue from 'components/settings/instance/InstanceManager.vue'

export default {
  name: 'PageInstance',
  components: {
    'instance-manager': InstanceManagerVue
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
