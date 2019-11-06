<template>
  <q-layout view="hHh lpR fFf">
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

        <!-- Streaming via Browser (btn) -->
        <btn-streamer />

        <!-- Right side icon instance listing/control -->
        <btn-instance-control />

        <!-- Right side icon (dots) top toolbar with popover -->
        <q-btn
          flat
          round
          dense
          icon="more_vert"
        >
          <q-menu>
            <q-list
              :dark="isDarkTheme"
              :class="{'bg-matmenu':isDarkTheme}"
            >
              <q-item
                clickable
                v-close-popup
                @click.native="logout"
              >
                <q-item-section avatar>
                  <q-icon name="fas fa-sign-out-alt" />
                </q-item-section>
                <q-item-section>
                  {{$t('btn.logout')}}
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click.native="disconnect"
              >
                <q-item-section avatar>
                  <q-icon name="wifi" />
                </q-item-section>
                <q-item-section>
                  {{$t('btn.disconnect')}}
                </q-item-section>
              </q-item>
              <q-item
                v-if="$q.fullscreen.isCapable"
                clickable
                v-close-popup
                @click="$q.fullscreen.toggle()"
              >
                <q-item-section avatar>
                  <q-icon :name="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" />
                </q-item-section>
                <q-item-section>
                  {{$t('btn.toggleFullscreen')}}
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Left menu -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      :bordered="!isDarkTheme"
      :content-class="{'bg-grey-9' : isDarkTheme}"
      :breakpoint="992"
    >
      <q-list
        :dark="isDarkTheme"
        link
        inset-delimiter
      >
        <q-item
          clickable
          exact
          to="/"
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
        <q-item
          v-if="getAdminAppMode"
          clickable
          to="/config"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            {{$t('pages.config')}}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/settings"
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
      </q-list>
    </q-drawer>

    <!-- Page Container router view -->
    <q-page-container :class="{ 'bg-dark': isDarkTheme}">
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
  </q-layout>
</template>

<script>
import { BtnStreamer, BtnInstanceControl, TopBarElectron } from '../components'
import { openURL } from 'quasar'
import { qcolor } from '../utils'

export default {
  name: 'LayoutDefault',
  components: {
    'btn-streamer': BtnStreamer,
    'btn-instance-control': BtnInstanceControl,
    'top-bar-electron': TopBarElectron
  },
  data () {
    return {
      leftDrawerOpen: window.innerWidth > 950
    }
  },
  mounted () {
    this.$q.addressbarColor.set()
    if (this.$q.platform.is.cordova && cordova.platformId === 'android') {
      // eslint-disable-next-line no-undef
      StatusBar.backgroundColorByHexString(qcolor.toHex(this.$store.getters['common/getThemeColor']))
    }
  },
  computed: {
    isDarkTheme () { return this.$store.getters['common/isDarkTheme'] },
    getAdminAppMode () { return this.$store.getters['common/getAdminAppMode'] }
  },
  methods: {
    openURL,
    disconnect () { this.$socket.disconnect() },
    logout () { this.$socket.logout() }
  }
}
</script>

<style>
</style>
