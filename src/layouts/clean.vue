<template>
  <q-layout style="background: linear-gradient(to bottom, #1e2f48 0%,#206bad 52%,#00bdce 100%);">
    <span
      v-if="$q.platform.is.electron"
      class="z-top full-width text-right absolute-top-left text-blue-grey-4 q-electron-drag"
      style="min-height:50px"
    >
      <q-btn
        dense
        flat
        size="sm"
        icon="minimize"
        @click="minimize"
      />
      <q-btn
        dense
        flat
        size="sm"
        icon="crop_square"
        @click="maximize"
      />
      <q-btn
        dense
        flat
        size="sm"
        icon="close"
        @click="closeApp"
      />
    </span>
    <season-overlay />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { SeasonOverlay } from 'components/gadgets'

export default {
  name: 'LayoutClean',
  components: {
    'season-overlay': SeasonOverlay
  },
  created () {
    // apply layout statusbar color
    this.$q.addressbarColor.set('#1e2f48')
    if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString('#1e2f48')
    }
  },
  methods: {
    minimize () {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize()
    },
    maximize () {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()
      win.isMaximized() ? win.unmaximize() : win.maximize()
    },
    closeApp () {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow().close()
    }
  }
}
</script>

<style lang="stylus"></style>
