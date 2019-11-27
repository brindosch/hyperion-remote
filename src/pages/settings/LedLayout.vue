<template>
  <q-page>
    <led-layout-edit></led-layout-edit>
  </q-page>
</template>

<script>
import LedLayoutEdit from 'components/settings/ledlayout/LedLayoutEdit'

export default {
  name: 'PageLedLayout',
  components: {
    'led-layout-edit': LedLayoutEdit
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
