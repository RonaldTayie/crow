<template>
  <v-app id="inspire">
    <v-app-bar flat class="no-print" height="67" >
      <v-app-bar-nav-icon to="/home" class="no-print" >
        <v-icon>
          mdi-home
        </v-icon>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon @click="doPrint()" class="no-print">
        <v-icon class="no-print" >
          mdi-printer
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main >
      <ReportHeader :device="devices[this.$route.params.uid]" :packages="packages" :images="packageImages" />
      <div class="container">
        <v-data-table
            dense
            :search="search"
            :headers="headers"
            :items="reportData"
            item-key="name"
            class="elevation-1"
            fixed-header
            calculate-widths
            mobile-breakpoint
        >
          <template v-slot:top class="no-print" >
            <v-text-field
                v-model="search"
                label="Search"
                class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:item.address="{ item }">
<!--            {{ getCode(item.location,item.uid)}}-->
            {{ addresses[item.uid] }}
          </template>
          <template v-slot:item.in_geofence="{ item }">
            <v-chip
                :color="getColor(item.in_geofence)"
                small
            >
              <v-icon color="white" >
                {{ item.in_geofence?'mdi-check':'mdi-alert-outline' }}
              </v-icon>

            </v-chip>
          </template>
          <template v-slot:item.date_received="{item}" >
            {{ item.date_received | moment("ddd, D-MM-YYYY") }}
          </template>
        </v-data-table>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {latLng} from "leaflet";
import {reverseGeocode} from "esri-leaflet-geocoder";
import ReportHeader from "@/components/ReportHeader";
export default {
  name: "ReportView",
  components: {
    ReportHeader,
  },
  data() {
    return {
      search: '',
      calories: '',
      options: {
        itemsPerPage:60
      },
      uid: null
    }
  },
  computed: {
    ...mapGetters({
      devices: 'getDevices',
      packages: 'getPackages',
      geoCodeToken: 'getGeoCodeToken',
      addresses: 'getAddresses',
      reportData: 'getReportData',
      packageImages:'getPackageImages'
    }),
    headers() {
      return [
        {
          text: 'Latitude',
          align:"start",
          value: 'location.latitude',
        },
        {
          text: 'Longitude',
          value: 'location.longitude',
        },
        {
          text: 'Address',
          value: 'address'
        },
        {
          text : 'In Geofence',
          value: 'in_geofence'
        },
        {
          text: "Satellite count",
          value: 'sat_count'
        },
        {
          text: "Speed",
          value: 'speed'
        },
        {
          text: "Date Received",
          value:'date_received'
        }
      ]
    }
  },
  methods: {
    ...mapActions(['generateReport', 'LoadDevices', 'mutateBroadcast', 'loadPackages','loadHazards','getPointAddress']),
    filterOnlyCapsText(value, search) {
      return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
    },
    async doPrint(){
      window.print();
    },
    initReport() {
      const data = {
        uid: this.$route.params.uid,
        startDate: this.$route.params.startDate,
        endDate: this.$route.params.endDate
      }
      this.generateReport(data)
    },
    getColor (v) {
      return v==true?'green':'amber'
    },
    async getCode(coords,uid){
      let loc = latLng(coords.latitude,coords.longitude)
      let address = await this.getPointAddress(loc)
      if (address){
        this.addresses[uid] = address
      }
    }

  },
  created() {
    this.LoadDevices()
    this.loadPackages()
    this.loadHazards()
    this.$vuetify.theme.dark = false
    this.initReport()
  },
  destroyed() {
    this.$vuetify.theme.dark = true
  }
}
</script>

<style scoped>

</style>