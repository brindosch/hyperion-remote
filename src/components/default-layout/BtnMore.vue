<template>
  <q-btn
    flat
    round
    dense
    icon="more_vert"
  >
    <item-streamer
      ref="streamer"
      @visible="val => streamerVisible = val"
    />
    <q-menu>
      <q-list>
        <q-item clickable>
          <q-item-section side>
            <q-icon name="keyboard_arrow_left" />
          </q-item-section>
          <q-item-section>Quick Access</q-item-section>

          <q-menu
            anchor="top right"
            self="top left"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click.stop="$store.dispatch('temp/openLoginDialog')"
              >
                <q-item-section avatar>
                  <q-icon name="fas fa-sign-out-alt" />
                </q-item-section>
                <q-item-section>
                  {{$t('label.logout')}}
                </q-item-section>
              </q-item>
              <q-item
                v-if="!$store.getters['temp/isEmbed']"
                clickable
                v-close-popup
                @click.stop="$socket.disconnect()"
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
        </q-item>
        <q-item
          clickable
          v-if="streamerVisible"
          @click.stop="openStreamer()"
        >
          <q-item-section side>
            <q-icon name="videocam"></q-icon>
          </q-item-section>
          <q-item-section>
            {{$t('capture.title')}}
          </q-item-section>
        </q-item>
        <q-item
          v-if="getAdminAppMode && $store.getters['api/getPendingTokens'].length > 0"
          clickable
          v-close-popup
          @click="$store.dispatch('temp/openTokenHandler')"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-key" />
          </q-item-section>
          <q-item-section>
            {{$t('conf.auth.pendToks')}}
          </q-item-section>
        </q-item>
        <!-- Custom entries per page -->
        <q-separator v-if="$store.getters['temp/getBtnMoreEntries'].length > 0" />
        <template v-for="item in $store.getters['temp/getBtnMoreEntries']">
          <q-item
            :key="item.label"
            clickable
            v-close-popup
            @click="emitEvent(item.event)"
          >
            <q-item-section
              avatar
              v-if="item.icon"
            >
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              {{$t(item.label)}}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { EventBus } from 'src/utils'
import ItemStreamer from './ItemStreamer'

export default {
  name: 'BtnMore',
  components: { 'item-streamer': ItemStreamer },
  data () {
    return {
      streamerVisible: false
    }
  },
  computed: {
    getAdminAppMode () { return this.$store.getters['common/getAdminAppMode'] }
  },
  methods: {
    emitEvent (evt) {
      EventBus.$emit(evt)
    },
    openStreamer () {
      this.$refs.streamer.stopCapture()
      this.$refs.streamer.showOptDialog()
    }
  }

}
</script>

<style>
</style>