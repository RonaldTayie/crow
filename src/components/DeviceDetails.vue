<template>
  <v-card class="deviceCard" >
    <v-card-title>
      {{ devices[uid].code }}
      <v-spacer></v-spacer>
      <v-btn icon small class="bg-danger" ripple @click="$emit('closeDeviceDetails')" >
        <v-icon >
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-list dense >

      <v-list-item  >
        <v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-crosshairs-gps</v-icon>
            <span class=" ml-1 pt-1" > Location </span>
          </v-list-item-icon>
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          Lat: {{ devices[uid].last_location?devices[uid].last_location.lat:"??" }}
          <v-spacer></v-spacer>
          Lng: {{ devices[uid].last_location?devices[uid].last_location.lng: "??" }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item three-line >
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-routes</v-icon>
              <span class=" ml-1 pt-1" > Address </span>
            </v-list-item-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ devices[uid].last_location?address: "Unknown" }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-car-speed-limiter</v-icon>
            <span class=" ml-1 pt-1" > Speed </span>
          </v-list-item-icon>
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          {{ broadcast[uid]?broadcast[uid].speed:"0" }} kph
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-card-text class="px-1" >
      <v-card class="mx-auto" outlined flat>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">
              Package
            </div>
            <v-list-item-title class="text-h5 mb-1">
              {{ packages[devices[uid].package.uid].name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ packages[devices[uid].package.uid].description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-avatar
              tile
              size="80"
              color="grey"
          >
            <v-carousel :show-arrows="false" :hide-delimiters="true" continuous cycle >
              <v-carousel-item v-for="img in packageImage[devices[uid].package.uid]" :key="img.uid"  >
                  <v-img :src="api.substring(0,api.length-1)+img.image" contain />
              </v-carousel-item>
            </v-carousel>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar rounded >
            <v-icon :color="hazardLevels[ packages[devices[uid].package.uid].package_type.hazard.uid ].color" >
              mdi-biohazard
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-subtitle>
            Hazard Type
          </v-list-item-subtitle>
          <v-spacer></v-spacer>
          <v-list-item-title>
            {{hazardLevels[ packages[devices[uid].package.uid].package_type.hazard.uid ].name }}
          </v-list-item-title>
        </v-list-item>

      </v-card>
    </v-card-text>

    <v-card-actions>
      <v-btn>
        Report
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import  {reverseGeocode} from 'esri-leaflet-geocoder'
export default {
  name: "DeviceDetails",
  data: ()=>({
    address: "Unknown"
  }),
  props: ['uid'],
  methods: {
    updateAddress(e,r){
      if(e){
        return
      }
      this.address = r.address.Match_addr
    },
    getCode(){
      const token = this.geoCodeToken
      if(this.devices[this.uid].last_location){
       reverseGeocode({token}).latlng(this.devices[this.uid].last_location).run((e,r)=>this.updateAddress(e,r))
      }
    }
  },
  created() {
    this.getCode()
  },
  computed: {
    ...mapGetters({
      devices: 'getDevices',
      broadcast: 'getBroadcast',
      packages: 'getPackages',
      packageImage: 'getPackageImages',
      api: 'getApi',
      hazardLevels:'getHazardLevels',
      geoCodeToken:'getGeoCodeToken'
    })
  },
  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler(){
        this.getCode()
      }
    },
    uid(){
      this.getCode()
    }
  }
}
</script>

<style scoped>
.deviceCard {
  position: absolute;
  z-index: 999;
  width: 300px;
  margin-top: 10px;
  margin-left: calc(100% - 370px);
}
</style>