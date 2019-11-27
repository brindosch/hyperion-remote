<template>
  <div class="fixed">
    <season-snow v-if="currentSeason == 'winter'"></season-snow>
  </div>
</template>

<script>
import SeasonSnow from './Snow.vue'
import { date } from 'quasar'

export default {
  name: 'SeasonOverlay',
  components: {
    'season-snow': SeasonSnow
  },
  data () {
    return {
      currentSeason: 'none'
    }
  },
  created () {
    // based on current date set the correct season
    let newDate = new Date()
    let week = date.getWeekOfYear(newDate)
    // 1. Dec -> 15. Feb
    if (week >= 48 || week <= 6) {
      this.currentSeason = 'winter'
    }
  }
}
</script>

<style lang="stylus"></style>
