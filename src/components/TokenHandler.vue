<template>
  <div>
    <q-dialog v-model="showTokenDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('conf.auth.tokReq')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          {{$t('conf.auth.tokReqMsg')}}
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item
              v-for="el in $store.getters['api/getPendingTokens']"
              :key="el.id"
            >
              <q-item-section>
                <q-item-label lines="1">{{$t('login.app')}}: {{el.comment}}</q-item-label>
                <q-item-label caption>{{$t('login.code')}}: {{el.id}}</q-item-label>
              </q-item-section>
              <q-item-section
                top
                side
              >
                <div>
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    @click="__handleTokenRequest(el.id,false)"
                  />
                  <q-btn
                    class="q-ml-sm"
                    flat
                    dense
                    round
                    icon="done"
                    @click="__handleTokenRequest(el.id,true)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            outline
            :label="$q.lang.label.ok"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="showCreatedTokenDialog"
      @before-hide="createdTok = ''"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('conf.auth.tokenCreated')}}</div>
        </q-card-section>
        <q-card-section class="q-dialog__message">
          <div>{{$t('conf.auth.tokenCreatedMsg')}}</div>
          <div class="text-overline allow-select q-py-md row flex-center">
            <div>
              {{createdTok}}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            outline
            :label="$q.lang.label.ok"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>>

<script>
import { EventBus } from 'src/utils'

export default {
  name: 'tokenhandle',
  data () {
    return {
      showTokenDialog: false,
      showCreatedTokenDialog: false,
      createdTok: ''
    }
  },
  created () {
    EventBus.$on('authorize-createToken', this.__handleTokenCreated)
  },
  beforeDestroy () {
    EventBus.$off('authorize-createToken', this.__handleTokenCreated)
  },
  mounted () {
    if (this.$store.state.api.pendingTokens.length > 0)
      this.showTokenDialog = true
  },
  watch: {
    '$store.state.api.pendingTokens' (val) {
      if (val.length > 0)
        this.showTokenDialog = true
      else
        this.showTokenDialog = false
    }
  },
  methods: {
    __handleTokenCreated (data) {
      this.createdTok = data.info.token
      this.showCreatedTokenDialog = true
    },
    __handleTokenRequest (id, state) {
      this.$socket.handleTokenRequest(req.id, state)
    },
    open () {
      this.showTokenDialog = true
    }
  }
}
</script>