<template>
  <q-table
    :title="$t('conf.instance.managerTitle')"
    :data="getInstanceData"
    :columns="columns"
    row-key="name"
    hide-bottom
    :pagination.sync="pagination"
    :dense="$q.screen.lt.md"
    flat
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
          :validate="nameValidation"
          @hide="nameValidation"
          @save="createInstance"
          @before-show="currName = '' && nameValidation"
        >
          <q-input
            v-model="currName"
            dense
            autofocus
            counter
            @input="nameValidation"
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
              counter
              @input="nameValidation"
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
import { dialog } from '../../mixins'
export default {
  mixins: [dialog],
  data () {
    return {
      pagination: { rowsPerPage: 0 },
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
      this.$socket.createInstance(name)
    },
    saveName (inst, val) {
      this.$socket.renameInstance(inst, val)
    },
    nameValidation (val) {
      if (val !== undefined) {
        if (val.length < 5) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.minLength', [5])
          return false
        }
        if (this.$store.getters['api/getInstances'].find((el) => el.friendly_name == val)) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.unique', [`"${val}"`])
          return false
        }
      }
      this.errorName = false
      this.errorMessageName = ''
      return true
    },
    handleDelete (inst, name) {
      this.openConfirmDialog({ title: this.$t('conf.instance.delInstance'), msg: this.$t('conf.instance.delInstanceMsg', { name: `"${name}"` }) }).onOk(() => this._handleDelete(inst, name))
    },
    _handleDelete (inst, name) {
      this.$socket.deleteInstance(inst)
    }
  }
}
</script>
