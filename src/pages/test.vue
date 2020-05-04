<template>
  <q-page>
      <dialog-test/>
      <clipboard-test/>
      <geo-test/>
  </q-page>
</template>

<style>
</style>

<script>
import { DialogTest, ClipboardTest, GeoTest } from 'components/test'

export default {
  name: 'PageIndex',
  components: {
    'dialog-test': DialogTest,
    'clipboard-test': ClipboardTest,
    'geo-test': GeoTest
  },
  data () {
    return {
    }
  }
}
</script>
