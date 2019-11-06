<template>
  <q-page>
    Page content here
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
    }
  },
  computed: {
    isDarkTheme () {
      return this.$store.getters['common/isDarkTheme']
    }
  }
}
</script>
