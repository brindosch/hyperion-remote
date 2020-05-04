<template>
      <q-card style="max-width:250px">
      <q-card-section>
        <div class="text-h6">Dialog</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn no-caps color="primary" label="confirmDialog" @click="testConfimDialog" />
      </q-card-actions>
    </q-card>
</template>

<script>
import { dialogMixin } from 'components/mixin'

export default {
  name: 'DialogTest',
  mixins: [dialogMixin],
  data () {
    return {
      title: 'This is a title',
      msg: 'this is a message'

    }
  },
  methods: {
    async testConfirmDialog () {
      const res = await this.openConfirmDialog({ title: this.title, msg: this.msg })
      this.$q.notify(`confirmDialog Result: ${res}`)
    }
  }
}
</script>
