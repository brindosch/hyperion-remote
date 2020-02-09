<template>
  <q-page class="allow-select q-pa-md">
    <div>
      <img
        :src="$q.dark.isActive ? 'statics/hyperion-logo-white.png' : 'statics/hyperion-logo.png'"
        class="q-ma-sm"
        style="width:150px"
      />
      <p>{{$t('about.intro')}}</p>
    </div>
    <div class="row">
      <div class="col-12 col-lg-4 q-py-md">
        <p class="text-subtitle1">APP</p>
        <table>
          <template v-for="(entry, key) in getTable">
            <tr :key="key">
              <td>{{$t('about.'+entry.td1)}}</td>
              <td>{{entry.td2}}</td>
            </tr>
          </template>
          <tr>
            <td>Quasar</td>
            <td>{{this.$q.version}}</td>
          </tr>
          <tr>
            <td>{{$t('about.homepage')}}</td>
            <td @click="openUrl('https://hyperion-project.org')"><span style="cursor:pointer;color:lightblue">www.hyperion-project.org</span></td>
          </tr>
          <tr>
            <td>{{$t('about.support')}}</td>
            <td @click="openUrl('https://hyperion-project.org')"><span style="cursor:pointer;color:lightblue">www.hyperion-project.org</span></td>
          </tr>
        </table>
        <q-separator style="margin:10px 0" />
        <p>Hyperion Server</p>
        <table>
          <template v-for="(entry, key) in getHyperionInfo">
            <tr :key="key">
              <td>{{$t('about.'+entry.td1)}}</td>
              <td
                style="word-break: break-all"
                :class="entry.color ? entry.color : ''"
              >{{entry.td2}}</td>
            </tr>
          </template>
        </table>
        <q-separator style="margin:10px 0" />
        <p>Hyperion Server OS</p>
        <table>
          <template v-for="(entry, key) in getOSInfo">
            <tr :key="key">
              <td>{{$t('about.'+entry.td1)}}</td>
              <td style="word-break: break-all">{{entry.td2}}</td>
            </tr>
          </template>
        </table>
      </div>
      <div
        v-if="$store.getters['common/getAdminAppMode']"
        class="col-12 col-lg-8 q-py-md"
      >
        <p class="text-subtitle1">{{$t('system.logtitle')}}</p>
        <q-item style="max-width:500px">
          <q-item-section>
            <q-select
              :label="$t('system.logFilterLabel')"
              :hint="$t('system.logFilterHelper')"
              bottom-slots
              multiple
              use-chips
              clearable
              v-model="modActiveFilters"
              :options="getLogFilterOptions"
              emit-value
              map-options
            />
          </q-item-section>
          <q-item-section side>
            <q-btn
              round
              small
              flat
              icon="more_vert"
            >
              <q-menu>
                <q-list>
                  <q-item
                    tag="label"
                    clickable
                  >
                    <q-item-section>
                      <q-item-label>
                        {{$t('system.logShowMethods')}}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle v-model="showMethods" />
                    </q-item-section>
                  </q-item>
                  <q-item
                    tag="label"
                    clickable
                  >
                    <q-item-section>
                      {{$t('system.logAutoScroling')}}
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle v-model="autoScroll" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
        <div class="allow-select q-pa-md">
          <div
            style="max-height:500px;overflow-y: auto"
            ref="log_scroller"
          >
            <div v-show="isLogEmpty">{{$t('system.logempty')}}
            </div>
            <div
              v-for="(entry,i) in getLog"
              :class="getColorByLevel(entry.levelString)"
              style="padding-bottom:4px;font-size:90%"
              :key="i"
            >
              [{{entry.loggerName}}] ({{entry.levelString}})
              <span
                v-if="entry.function"
                v-show="showMethods"
              >
                ({{entry.fileName}}:{{entry.line}}:{{entry.function}}())
              </span>
              {{entry.message}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { openUrlMixin } from 'components/mixins'

export default {
  name: 'PageAbout',
  mixins: [openUrlMixin],
  data () {
    return {
      showLogDialog: false,
      showMethods: false,
      autoScroll: true
    }
  },
  created () {
    if (this.$store.getters['common/getAdminAppMode']) { this.$socket.setLogEnable(true) }
  },
  beforeDestroy () {
    if (this.$store.getters['common/getAdminAppMode']) { this.$socket.setLogEnable(false) }
  },
  computed: {
    sysInfo: {
      get () { return this.$store.getters['api/getSysInfo'] },
      set () { }
    },
    getTable () {
      return [
        {
          td1: 'version',
          td2: process.env.VERSION
        },
        {
          td1: 'buildTime',
          td2: new Date(process.env.BUILDDATE).toLocaleString()
        },
        {
          td1: 'developer',
          td2: 'brindosch'
        }
      ]
    },
    getHyperionInfo () {
      return [
        {
          td1: 'version',
          td2: this.sysInfo.hyperion.version
        },
        {
          td1: 'buildTime',
          td2: this.sysInfo.hyperion.time
        },
        {
          td1: 'build',
          td2: this.sysInfo.hyperion.build
        },
        {
          td1: 'gitremote',
          td2: this.sysInfo.hyperion.gitremote
        },
        {
          td1: 'official',
          td2: this.sysInfo.hyperion.build.includes('github.com/hyperion-project') ? this.$t('label.yes') : this.$t('label.no') + '!',
          color: this.sysInfo.hyperion.build.includes('github.com/hyperion-project') ? 'text-success' : 'text-red'
        }
      ]
    },
    getOSInfo () {
      return [
        {
          td1: 'prettyName',
          td2: this.sysInfo.system.prettyName
        },
        {
          td1: 'arch',
          td2: this.sysInfo.system.kernelType + ' ' + this.sysInfo.system.architecture + ' (' + this.sysInfo.system.wordSize + 'bit)'
        },
        {
          td1: 'hostName',
          td2: this.sysInfo.system.hostName
        }
      ]
    },
    getLogFilterOptions () { return this.$store.getters['temp/getLogFilterOptions'] },
    isLogEmpty () { return this.getLog.length === 0 },
    getLog () { return this.$store.getters['api/getFilteredLog'] },
    modActiveFilters: {
      get () { return this.$store.getters['api/getActiveLogFilters'] },
      set (val) { this.$store.commit('api/setActiveLogFilters', val) }
    }
  },
  methods: {
    getColorByLevel (level) {
      switch (level) {
        case 'ERROR': return 'text-red'
        case 'WARNING': return 'text-orange'
        default: return ''
      }
    }
  },
  updated () {
    if (this.autoScroll && this.$refs.log_scroller) {
      var elem = this.$refs.log_scroller
      elem.scrollTop = elem.scrollHeight
    }
  }

}
</script>

<style lang="stylus">
td {
  padding: 2px 5px;
  overflow-wrap: break-word;
}
</style>
