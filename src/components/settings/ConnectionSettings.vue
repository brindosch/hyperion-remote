<template>
  <q-list>
    <q-item-label
      header
      class="header-text"
    >
      {{$t('conn.settingsListLabel')}}
      <q-icon name="info">
        <q-tooltip
          content-style="font-size: 90%"
          :delay="400"
          max-width="30rem"
        >
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label> {{$t('conn.autoConnect')}} </q-item-label>
                <q-item-label> {{$t('conn.autoConnect_desc')}} </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label> {{$t('conn.autoDisconnect')}} </q-item-label>
                <q-item-label> {{$t('conn.autoDisconnect_desc')}} </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label> {{$t('conn.autoLogin')}} </q-item-label>
                <q-item-label> {{$t('conn.autoLogin_desc')}} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tooltip>
      </q-icon>
    </q-item-label>
    <q-item
      v-if="!$store.getters['temp/isEmbed']"
      tag="label"
    >
      <q-item-section>
        <q-item-label>
          {{$t('conn.autoConnect')}}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modAutoConnect" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('conn.autoConnect_desc')}}
      </q-tooltip>
    </q-item>
    <q-item tag="label">
      <q-item-section>
        <q-item-label>
          {{$t('conn.autoDisconnect')}}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modAutoDisconnect" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('conn.autoDisconnect_desc')}}
      </q-tooltip>
    </q-item>
    <q-item tag="label">
      <q-item-section>
        <q-item-label>
          {{$t('conn.autoLogin')}}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="modAutoLogin" />
      </q-item-section>
      <q-tooltip :delay="1000">
        {{$t('conn.autoLogin_desc')}}
      </q-tooltip>
    </q-item>
  </q-list>
</template>
<script>
export default {
  name: 'ConnectionSettings',
  data () {
    return {}
  },
  computed: {
    modAutoConnect: {
      get () { return this.$store.getters['connection/getAutoConnect'] },
      set (val) { this.$store.commit('connection/setAutoConnect', val) }
    },
    modAutoDisconnect: {
      get () { return this.$store.getters['connection/getAutoDisconnect'] },
      set (val) { this.$store.commit('connection/setAutoDisconnect', val) }
    },
    modAutoLogin: {
      get () { return this.$store.getters['connection/getAutoLogin'] },
      set (val) { this.$store.commit('connection/setAutoLogin', val) }
    }
  }
}
</script>
