<template>
  <q-bar
    v-if="$q.platform.is.electron"
    class="q-electron-drag"
  >
    <q-icon name="laptop_chromebook" />
    <div>Hyperion Remote</div>

    <q-space />

    <q-btn
      dense
      flat
      icon="minimize"
      @click="minimize"
    />
    <q-btn
      dense
      flat
      icon="crop_square"
      @click="maximize"
    />
    <q-btn
      dense
      flat
      icon="close"
      @click="closeApp"
    />
  </q-bar>
</template>

<script>
export default {
  name: 'TopBarElectron',
  data () {
    return {
    }
  },
  methods: {
    minimize () {
      window.electron.minimize()
    },
    maximize () {
      window.electron.isMaximized() ? window.electron.unmaximize() : window.electron.maximize()
    },
    closeApp () {
      window.electron.close()
    }
  }
}
</script>
