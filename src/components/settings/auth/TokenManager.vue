<template>
  <q-table
    :title="$t('conf.auth.managerTitle')"
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
          :title="$t('conf.auth.tokenName')"
          buttons
          :label-set="$t('label.create')"
          :validate="nameValidation"
          @hide="nameValidation"
          @save="createToken"
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
          key="comment"
          :props="props"
          class="cursor-pointer"
        >
          {{ props.row.comment }}
          <q-popup-edit
            v-model="currName"
            buttons
            :title="$t('conf.auth.tokenName')"
            :label-set="$t('label.save')"
            @hide="nameValidation"
            :validate="nameValidation"
            @save="renameToken(props.row.id,$event)"
            @before-show="currName = props.row.comment"
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
          key="last_use"
          :props="props"
        >
          <template v-if="props.row.last_use !== ''">
            {{dateToLocaleString(props.row.last_use)}}
          </template>
        </q-td>
        <q-td
          key="del"
          :props="props"
        >
          <q-btn
            icon="delete"
            flat
            round
            dense
            @click="handleDelete(props.row.id, props.row.comment)"
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
          name: 'comment',
          required: true,
          label: this.$t('conf.instance.tableName'),
          align: 'left',
          field: 'comment',
          sortable: true
        },
        { name: 'last_use', align: 'left', label: this.$t('conf.auth.tableLastUse'), field: 'last_use', sortable: true, sort: (a, b, rowA, rowB) => Date.parse(a) - Date.parse(b) },
        { name: 'del', align: 'left', label: this.$q.lang.label.remove, field: 'del' }
      ]
    }
  },
  computed: {
    getInstanceData () {
      return this.$store.getters['api/getTokenList']    }
  },
  created () {
  },
  methods: {
    dateToLocaleString (date) {
      return new Date(date).toLocaleString()
    },
    createToken (comment, initial) {
      this.$socket.createToken(comment.trim())
    },
    renameToken (id, val) {
      this.$socket.renameToken(id, val.trim())
    },
    nameValidation (val) {
      if (val !== undefined) {
        const cleanVal = val.trim()
        if (cleanVal.length < 5) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.minLength', [5])
          return false
        }
        if (this.$store.getters['api/getTokenList'].find((el) => el.comment == cleanVal)) {
          this.errorName = true
          this.errorMessageName = this.$t('validate.unique', [`"${val}"`])
          return false
        }
      }
      this.errorName = false
      this.errorMessageName = ''
      return true
    },
    async handleDelete (id, name) {
      const res = await this.openConfirmDialog({ title: this.$t('conf.auth.delToken'), msg: this.$t('conf.auth.delTokenMsg', { name: `"${name}"` }) })
      if (res)
        this.$socket.deleteToken(id)
    }
  }
}
</script>
