<template>
  <q-table
    :title="$t('remote.prio.title')"
    :data="getPriorities"
    :columns="columns"
    row-key="name"
    :hide-bottom="getPriorities.length <= 5"
    :dense="$q.screen.lt.md"
    :visible-columns="visCols"
    flat
    wrap-cells
  >
    <template v-slot:top-right>
      <q-btn
        outline
        dense
        :label="$t('remote.prio.auto')"
        v-if="!getPrioritiesAutoSelect"
        @click.stop="setAutoSelect"
      >
        <q-tooltip :delay="1000">{{$t('remote.prio.auto_desc')}}</q-tooltip>
      </q-btn>
    </template>
    <template v-slot:body="props">
      <q-tr
        @click.stop="setPrio(props.row)"
        class="cursor-pointer"
        :props="props"
      >
        <q-td
          key="select"
          :props="props"
        >
          <q-radio
            :value="props.row.visible"
            :disable="!props.row.active"
            @input="setPrio(props.row)"
            :val="true"
          ></q-radio>
        </q-td>
        <q-td
          key="priority"
          :props="props"
        >
          {{props.row.priority}}
        </q-td>
        <q-td
          key="type"
          :props="props"
        >
          <div class="row items-center">
            {{ getType(props.row) }}

            <div
              v-if="props.row.componentId == 'COLOR'"
              class="q-ml-xs color-circle shadow-1"
              :style="'background:rgb('+props.row.value.RGB.join(',')+')'"
            ></div>
          </div>
          <div
            class="q-dialog__message"
            v-if="hasDuration(props.row)"
          >{{$t('remote.prio.duration')}}: {{msToHumanTime(props.row.duration_ms)}}</div>
        </q-td>
        <q-td
          key="del"
          :props="props"
        >
          <q-btn
            icon="delete"
            :disable="!canClear(props.row)"
            flat
            round
            dense
            @click.stop="clearPriority(props.row.priority)"
          ></q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'PrioritiesTable',
  data () {
    return {
      columns: [
        {
          name: 'select',
          label: this.$t('remote.prio.selected'),
          align: 'left',
          field: 'select',
          sortable: true,
          sort: (a, b, rowA, rowB) => Number(a) - Number(b)
        },
        {
          name: 'priority',
          label: this.$t('remote.prio.prio'),
          align: 'left',
          field: 'priority',
          sortable: true,
          sort: (a, b, rowA, rowB) => Number(a) - Number(b)
        },
        { name: 'type', align: 'left', label: this.$t('remote.prio.type'), field: 'type', sortable: true },
        { name: 'del', align: 'left', label: this.$q.lang.label.remove, field: 'del' }
      ]
    }
  },
  computed: {
    getPriorities () { return this.$store.getters['api/getPriorities'] },
    getPrioritiesAutoSelect () { return this.$store.getters['api/getPrioritiesAutoSelect'] },
    visCols () { return this.$q.screen.lt.sm ? ['select', 'type', 'del'] : ['select', 'priority', 'type', 'del'] }
  },
  methods: {
    canClear (e) {
      return e.priority < 254 && (e.componentId == 'EFFECT' || e.componentId == 'COLOR' || e.componentId == 'IMAGE')
    },
    hasDuration (e) {
      return e.duration_ms > 0 && (e.componentId == 'EFFECT' || e.componentId == 'COLOR' || e.componentId == 'IMAGE')
    },
    msToHumanTime (ms) {
      const d = new Date(ms);
      const min = d.getUTCMinutes()
      const s = d.getUTCSeconds()
      if (min > 0)
        return `${min}m ${s}s`
      else
        return `${s}s`
    },
    setAutoSelect () {
      this.$socket.setPriorityAutoSelect(true)
    },
    setPrio (e) { if (!e.visible && e.active) this.$socket.setPriority(e.priority) },
    getType (e) {
      let type
      switch (e.componentId) {
        case 'EFFECT':
          type = `${this.$t('remote.prio.eff')}: ${e.owner}`
          break;
        case 'COLOR':
          type = `${this.$t('remote.prio.color')}:`
          break;
        case 'IMAGE':
          type = this.$t('remote.prio.img')
          break;
        case 'IMAGESTREAM':
          type = this.$t('remote.prio.imgStream')
          break;
        case 'GRABBER':
          type = this.$t('remote.comp.GRABBER')
          break;
        case 'V4L':
          type = this.$t('remote.comp.V4L')
          break;
        default:
          type = this.$t(`remote.comp.${e.componentId}`)
          break;
      }
      return type
    },
    clearPriority (prio) { this.$socket.setClear(prio) }
  }
}
</script>

<style lang="stylus">
.color-circle {
  width: 15px;
  height: 15px;
  border-radius: 15px;
}
</style>