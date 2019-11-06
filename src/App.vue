<template>
  <!-- class bg-white is a overwrite for electron, which default startup background color is on all pages, which are not set to white  -->
  <div
    id="q-app"
    class="grey-2 scroll"
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
