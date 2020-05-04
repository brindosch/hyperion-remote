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
import { clipboardMixin } from 'components/mixin'

export default {
  name: 'ClipboardTest',
  mixins: [clipboardMixin],
  data () {
    return {

    }
  },
  methods: {
    testConfirmDialog () {

    }
  }
}
</script>
