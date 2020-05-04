<template>
  <q-layout view="hHh lpr fFf">
    <!-- v-touch-swipe.mouse="onSwipeEvent" -->
    <q-header elevated>
      <!-- Frameless electron window, add controls min/max/close/drag app to keep it usable -->
      <top-bar-electron />

      <q-toolbar>
        <!-- Left side icon for menu opening -->
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          <q-icon
            style="font-size: 1.5rem; padding-right: 5px;"
            :name="$route.meta.icon"
          />
          {{ $t($route.meta.title) }}
          <!--  <div>{{ $t('system.instCurr') }}{{' : '+getActiveInstance.friendly_name}}</div> -->
        </q-toolbar-title>

        <!-- Right side icon instance listing/control -->
        <btn-instance-control />

        <!-- Right side icon (dots) -->
        <btn-more></btn-more>
      </q-toolbar>
      <status-bar></status-bar>
    </q-header>

    <!-- Left menu -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      :content-class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      :breakpoint="992"
    >
      <q-list
        link
        inset-delimiter
      >
        <q-item
          clickable
          exact
          to="/dashboard"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            {{$t('pages.dashboard')}}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/control"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-gamepad" />
          </q-item-section>
          <q-item-section>
            {{$t('pages.control')}}
          </q-item-section>
        </q-item>
        <q-expansion-item
          v-if="getAdminAppMode"
          expand-separator
          icon="settings"
          :header-class="{'q-router-link--active': $route.path.includes('settings')}"
          :default-opened="$route.path.includes('settings')"
          :label="$t('pages.settings')"
          :content-inset-level="1"
        >
          <template v-for="page in pages">
            <q-item
              :key='page.route'
              clickable
              :to="page.route"
            >
              <q-item-section>
                {{$t('pages.'+page.label)}}
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>
        <q-item
          v-if="!getAdminAppMode"
          clickable
          to="/settings/app"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            {{$t('pages.settings')}}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/about"
        >
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            {{$t('pages.about')}}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/test"
        >
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            Test
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Container router view -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Back to top button -->
    <!--
    <q-page-sticky v-if="this.$store.getters['common/isBacktoTop']" position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-back-to-top.animate="{offset: 400, duration: 200}"
        round
        :color="$store.getters['common/getThemeColor']"
        class="animate-pop"
        icon="keyboard_arrow_up"
      />
    </q-page-sticky>
    -->
    <q-page-scroller
      v-if="this.$store.getters['common/isBacktoTop']"
      position="bottom-right"
      :scroll-offset="400"
      :offset="[18, 18]"
    >
      <q-btn
        fab
        icon="keyboard_arrow_up"
        :color="$store.getters['common/getThemeColor']"
      />
    </q-page-scroller>
    <token-handler v-if="getAdminAppMode"></token-handler>
  </q-layout>
</template>

<script>
import { StatusBar, BtnMore, BtnInstanceControl, TopBarElectron, TokenHandler } from 'components/default-layout'
import { qcolor } from '../utils'

export default {
  name: 'LayoutDefault',
  components: {
    'status-bar': StatusBar,
    'btn-more': BtnMore,
    'btn-instance-control': BtnInstanceControl,
    'top-bar-electron': TopBarElectron,
    'token-handler': TokenHandler
  },
  data () {
    return {
      leftDrawerOpen: window.innerWidth > 992,
      pages: [
        {
          label: 'authorization',
          route: '/settings/authorization'
        },
        {
          label: 'instance',
          route: '/settings/instance'
        },
        {
          label: 'ledlayout',
          route: '/settings/ledlayout'
        },
        {
          label: 'leddevice',
          route: '/settings/leddevice'
        },
        {
          label: 'app',
          route: '/settings/app'
        }
      ]
    }
  },
  mounted () {
    // set status bar color for this layout
    const hc = qcolor.toHex(this.$store.getters['common/getThemeColor'])
    this.$q.addressbarColor.set(hc)
    if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString(hc)
    }
  },
  computed: {
    getAdminAppMode () { return this.$store.getters['common/getAdminAppMode'] }
  },
  methods: {
    onSwipeEvent (e) {
      // if direction is left starting from right screen edge handle 'left swipe gesture'
      if (e.direction === 'left' && (this.$q.screen.width - 50 > e.evt.clientX)) { console.log(e.evt.clientX); this.$q.notify(String(e.evt.clientX)) }
    }
  }
}
</script>

<style>
</style>
