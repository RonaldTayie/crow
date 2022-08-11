<template>
  <div class="container">
    <div class="row no-gutters">
      <div class="col-md-12 text-center">
        <v-avatar size="80" tile>
          <v-img src="../assets/logo.png" eager/>
        </v-avatar>
      </div>
      <div class="col-md-12 col-12">
        <h3 align="center"> Tracking Report </h3>
      </div>
      <div class="col-md-5 col-sm-6 p-0">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>
              mdi-chip
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>Device ID</v-list-item-subtitle>
            <v-list-item-title> {{ device.code }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div class="col-md-6 col-sm-6">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon>
              mdi-calendar
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-subtitle>
              Date Range
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              From: {{ this.$route.params.startDate }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              To: {{ this.$route.params.startDate }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div class="col-md-6">
        <v-card class="mx-auto" flat>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-4">
                Package
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ packages[device.package.uid].name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ packages[device.package.uid].description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar
                tile
                size="80"
            >
              <img :src="images[device.package.uid][0].image" contain/>
            </v-list-item-avatar>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar rounded>
              <v-icon :color="hazardLevels[device.package.package_type.hazard.uid].color">
                mdi-biohazard
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-subtitle>
              Hazard Type
            </v-list-item-subtitle>
            <v-spacer></v-spacer>
            <v-list-item-title>
              {{ hazardLevels[device.package.package_type.hazard.uid]['name'] }}
            </v-list-item-title>
          </v-list-item>

        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ReportHeader",
  props: ['device', 'packages', 'images'],
  computed: {
    ...mapGetters({
      api: 'getApi',
      hazardLevels: 'getHazardLevels'
    })
  }
}
</script>

<style scoped>

</style>