<template>
  <q-dialog
    :value="value"
    @input="$emit('input',value)"
    :content-class="{'bg-grey-9':isDarkTheme, 'text-white':isDarkTheme}"
  >
    <q-card :dark="isDarkTheme">
      <q-card-section>
        <div class="text-h6">
          <slot name="header"></slot>
        </div>
      </q-card-section>

      <q-card-section :style="{'opacity:0.6':isDarkTheme}">
        <slot name="content"></slot>
      </q-card-section>

      <q-card-actions align="right">
        <slot name="actions">
          <q-btn
            flat
            :label="$q.lang.label.cancel"
            @click="$emit('cancel')"
            color="primary"
            v-close-popup
          />
          <q-btn
            flat
            :label="$q.lang.label.ok"
            @click="$emit('ok')"
            color="primary"
            v-close-popup
          />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'w-qdialog',
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean
    },
    display: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isDarkTheme () { return this.$store.getters['common/isDarkTheme'] }
  },
  methods: {
    show () {
      this.display = true
    },
    hide () {
      this.display = false
    }
  }
}
</script>
