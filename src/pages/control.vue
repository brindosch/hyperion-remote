<template>
  <q-page v-touch-swipe.horizontal.noMouse="handleSwipe">
    <q-tabs
      v-model="modSelectedTab"
      ref="tabs"
      class="bg-primary text-white"
    >
      <q-tab
        name="tab-1"
        icon="color_lens"
      />
      <q-tab
        name="tab-2"
        icon="tune"
      />
      <q-tab
        name="tab-3"
        icon="list"
      />
      <q-tab
        v-if="this.$store.getters['api/getPlugins'] !== undefined"
        slot="title"
        name="tab-4"
        icon="fas fa-cubes"
      />
      <q-tab
        name="tab-5"
        icon="movie"
      />
    </q-tabs>

    <!-- Targets -->
    <q-tab-panels
      v-model="modSelectedTab"
      :class="isDarkTheme ? 'bg-dark' : 'bg-white'"
      animated
    >
      <q-tab-panel
        keep-alive
        name="tab-1"
      >
        <h-colorpicker />
      </q-tab-panel>
      <q-tab-panel
        keep-alive
        name="tab-2"
      >
        <list-adjustments />
      </q-tab-panel>
      <q-tab-panel
        keep-alive
        name="tab-3"
      >
        <list-components />
      </q-tab-panel>
      <q-tab-panel
        :disable="this.$store.getters['api/getPlugins'] === undefined"
        keep-alive
        name="tab-4"
      >
        <h-plugins-list />
      </q-tab-panel>
      <q-tab-panel name="tab-5">
        <h-led-visual />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style>
</style>

<script>
import { ColorPicker, AdjustmentsList, HPluginsList, HListComponents, HLedVisual } from '../components'

export default {
  name: 'PageIndex',
  components: {
    'list-components': HListComponents,
    'list-adjustments': AdjustmentsList,
    'h-colorpicker': ColorPicker,
    'h-plugins-list': HPluginsList,
    'h-led-visual': HLedVisual
  },
  data () {
    return {
      windowWidth: window.innerWidth
    }
  },
  computed: {
    isDarkTheme () {
      return this.$store.getters['common/isDarkTheme']
    },
    modSelectedTab: {
      get () { return this.$store.getters['common/getSelectedRemoteTab'] },
      set (val) { this.$store.commit('common/setSelectedRemoteTab', val) }
    }
  },
  methods: {
    setSelectedTab (val) { this.$store.commit('common/setSelectedRemoteTab', val) },
    requestClear () { this.$socket.setClear() },
    handleSwipe (obj) {
      if (Math.abs(obj.distance.x) > 0.5 * this.windowWidth || Math.abs(obj.distance.x) > 200)
        {(obj.direction === "right") ? this.selectTabDirection('left') : this.selectTabDirection('right')}
    },
    selectTabDirection (name = 'right') {
      // switch to the right/left neighbor tab based on current tab
      // 1. Get current tab, may be undefined if not found. In this case we do nothing
      const currTab = this.__getTabByName(this.$store.getters['common/getSelectedRemoteTab'])
      if (!currTab)
        {return}
      // 2. get an array of all possible tabs (filter hidden,disabled tabs and other DOM elements)
      const tabs = this.__getAvailableTabs()
      // 3. Get target tab, may be undefined if not found
      const tab = (name === 'right') ? tabs[tabs.indexOf(currTab) + 1] : tabs[tabs.indexOf(currTab) - 1]
      // 4. set the new tab
      if (tab)
        {this.setSelectedTab(tab.name)}
      // this.$refs.tabs.selectTab(tab.name)
    },
    __getAvailableTabs () {
      return this.$refs.tabs.$children.filter(child => child.$vnode.componentOptions.tag === 'q-tab' && !child.disable && !child.hidden)
    },
    __getTabByName (value) {
      return this.$refs.tabs.$children.find(child => child.name === value && child.$vnode.componentOptions.tag === 'q-tab')
    }
  }
}
</script>
