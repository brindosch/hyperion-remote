<template>
  <q-dialog
    ref="dialog"
    @hide="onDialogHide"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">
        </div>
      </q-card-section>

      <q-card-section>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$q.lang.label.cancel"
          @click="onCancelClick"
          color="primary"
        />
        <q-btn
          flat
          :label="$q.lang.label.ok"
          @click="onOkClick"
          color="primary"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    // ...your custom props
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })
      this.hide()
    },

    onCancelClick () {
      this.hide()
    }
  }
}
</script>