<template>
  <!-- As of Nov 2019 - FF/Chrome on Android don't like scroll proberty -->
  <div
    id="q-app"
    :class="{'scroll':!$q.platform.is.mobile}"
  >
    <router-view />
  </div>
</template>

<script>
import init from './components/initTasks'

export default {
  name: 'App',
  extends: init
}
</script>

<style>
</style>
