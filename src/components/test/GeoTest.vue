<template>
      <q-card style="max-width:250px">
      <q-card-section>
        <div class="text-h6">Gps</div>
      </q-card-section>

      <q-separator />

      <q-card-actions vertical>
        <q-btn no-caps color="primary" label="getGPSPos" @click="testGetGPSPos" />
      </q-card-actions>
    </q-card>
</template>

<script>
import { gpsMixin } from 'components/mixins'

export default {
  name: 'GeoTest',
  mixins: [gpsMixin],
  data () {
    return {

    }
  },
  methods: {
    async testGetGPSPos () {
      const res = await this.getGpsPosition()
      this.$q.notify(`getGpsPos Result: ${JSON.stringify(res)}`)
    }
  }
}
</script>
