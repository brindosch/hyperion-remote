<template>
  <q-table
    :title="$t('conf.instance.managerTitle')"
    :data="getInstanceData"
    :columns="columns"
    row-key="name"
    :hide-bottom="getInstanceData.length <= 5"
    :dense="$q.screen.lt.md"
    flat
    wrap-cells
  >
    <template v-slot:top-right>
      <q-btn
        outline
        round
        dense
        :disable="errorName"
        icon="add"
      >
        <q-popup-edit
          v-model="currName"
          :title="$t('conf.instance.newName')"
          buttons
          :label-set="$t('label.create')"
          @hide="nameValidation"
          :validate="nameValidation"
          @save="createInstance"
          @before-show="currName = ''"
        >
          <q-input
            v-model="currName"
            dense
            autofocus
            :error="errorName"
            :error-message="errorMessageName"
            spellcheck="false"
          />
        </q-popup-edit>
      </q-btn>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          key="friendly_name"
          :props="props"
          class="cursor-pointer"
        >
          {{ props.row.friendly_name }}
          <q-popup-edit
            v-model="currName"
            buttons
            :title="$t('conf.instance.newName')"
            :label-set="$t('label.save')"
            :validate="nameValidation"
            @hide="nameValidation"
            @save="saveName(props.row.instance,$event)"
            @before-show="currName = props.row.friendly_name"
          >
            <q-input
              v-model="currName"
              dense
              autofocus
              :error="errorName"
              :error-message="errorMessageName"
              spellcheck="false"
            />
          </q-popup-edit>
        </q-td>
        <q-td
          key="running"
          :props="props"
        >
          <q-toggle
            dense
            :disable="props.row.instance === 0"
            v-model="props.row.running"
            @input="toggleInstanceState($event,props.row.instance)"
          ></q-toggle>
        </q-td>
        <q-td
          key="del"
          :props="props"
        >
          <q-btn
            icon="delete"
            :disable="props.row.instance === 0"
            flat
            round
            dense
            @click="handleDelete(props.row.instance, props.row.friendly_name)"
          ></q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { dialogMixin } from '../../mixins'
export default {
  mixins: [dialogMixin],
  data () {
    return {
      currName: '',
      errorName: false,
      errorMessageName: '',
      columns: [
        {
          name: 'friendly_name',
          required: true,
          label: this.$t('conf.instance.tableName'),
          align: 'left',
          field: 'friendly_name',
          sortable: true
        },
        { name: 'running', align: 'left', label: this.$t('conf.instance.tableState'), field: 'running', sortable: true, sort: (a, b, rowA, rowB) => Number(a) - Number(b) },
        { name: 'del', align: 'left', label: this.$q.lang.label.remove, field: 'del' }
      ]
    }
  },
  computed: {
    getInstanceData () {
      return this.$store.getters['api/getInstances']    }
  },
  created () {
  },
  methods: {
    toggleInstanceState (newState, inst) {
      this.$socket.setInstanceState(newState, inst)
    },
    createInstance (name, initial) {
      this.$socket.createInstance(name.trim())
    },
    saveName (inst, val) {
      this.$socket.renameInstance(inst, val.trim())
    },
    nameValidation (val) {
      if (val !== undefined) {
        const cleanVal = val.trim()
        if (cleanVal.length < 5) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.minLength', [5])
          return false
        }
        if (this.$store.getters['api/getInstances'].find((el) => el.friendly_name == cleanVal)) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.unique', [`"${val}"`])
          return false
        }
      }
      this.errorName = false
      this.errorMessageName = ''
      return true
    },
    async handleDelete (inst, name) {
      const res = await this.openConfirmDialog({ title: this.$t('conf.instance.delInstance'), msg: this.$t('conf.instance.delInstanceMsg', { name: `"${name}"` }) })
      if (res)
        this.$socket.deleteInstance(inst)
    }
  }
}
</script>
