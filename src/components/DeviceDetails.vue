<template>
  <v-card class="deviceCard">
    <v-card-title>
      {{ devices[uid].code }}
      <v-spacer></v-spacer>
      <v-btn icon small class="bg-danger" ripple @click="$emit('closeDeviceDetails')">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-list dense>

      <v-list-item>
        <v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-crosshairs-gps</v-icon>
            <span class=" ml-1 pt-1"> Location </span>
          </v-list-item-icon>
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          Lat: {{ devices[uid].last_location ? devices[uid].last_location.lat : "??" }}
          <v-spacer></v-spacer>
          Lng: {{ devices[uid].last_location ? devices[uid].last_location.lng : "??" }}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title>
            <v-list-item-icon>
              <v-icon>mdi-routes</v-icon>
              <span class=" ml-1 pt-1"> Address </span>
            </v-list-item-icon>
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ devices[uid].last_location ? address : "Unknown" }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-car-speed-limiter</v-icon>
            <span class=" ml-1 pt-1"> Speed </span>
          </v-list-item-icon>
        </v-list-item-title>
        <v-list-item-subtitle class="text-right">
          {{ broadcast[uid] ? broadcast[uid].speed : "0" }} kph
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-card-text class="px-1">
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
            <v-carousel :show-arrows="false" :hide-delimiters="true" continuous cycle>
              <v-carousel-item v-for="img in packageImage[devices[uid].package.uid]" :key="img.uid">
                <v-img :src="api.substring(0,api.length-1)+img.image" contain/>
              </v-carousel-item>
            </v-carousel>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar rounded>
            <v-icon :color="hazardLevels[ packages[devices[uid].package.uid].package_type.hazard.uid ].color">
              mdi-biohazard
            </v-icon>
          </v-list-item-avatar>
          <v-spacer></v-spacer>
          <v-list-item-title>
            {{ hazardLevels[packages[devices[uid].package.uid].package_type.hazard.uid].name }}
          </v-list-item-title>
        </v-list-item>

      </v-card>
    </v-card-text>

    <v-card-actions>
      <v-menu offset-x left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              dark
              v-bind="attrs"
              v-on="on"
              small
          >
            Options
          </v-btn>
        </template>
        <v-list dense >
          <v-list-item-group>
            <v-list-item @click="dialog.isOpen = true" >
              <v-list-item-title> Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dialog.deleteDialog = true" >
              <v-list-item-title> Delete</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-card-actions>

    <v-dialog v-model="dialog.isOpen" width="320" style="z-index: 9999;">
      <v-card>
        <v-card-title>
          Edit Device
          <v-spacer></v-spacer>
          <v-btn icon color="white" class="bg-danger" @click="dialog.isOpen = false" small>
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>

        <v-alert
            outlined
            type="warning"
            prominent
            border="left"
            v-if="dialogMessage.is_open"
        >
          {{dialogMessage.message}}
        </v-alert>

        <v-form @submit.prevent="doUpdate" lazy-validation class="py-0" >
          <v-card-text class="py-0" >
            <v-text-field
                v-model="deviceData.code"
                :rules="[() => !!deviceData.code || 'This field is required']"
                hint="Unique code to identify the device"
                label="Device Code (Unique)"
                placeholder="Device Code (Unique)"
                required
            ></v-text-field>
            <v-text-field
                v-model="deviceData.mac_address"
                :rules="[() => !!deviceData.mac_address || 'This field is required']"
                hint="Device Mac address."
                label="Device MAC address"
                placeholder="Device MAC Address"
                required
            ></v-text-field>
            <v-text-field
                v-model="deviceData.description"
                :rules="[() => !!deviceData.description || 'This field is required']"
                label="Description"
                placeholder="Description"
                required
            ></v-text-field>
            <v-select
                :items="packageNames"
                v-model="selectedPackageName"
                :rules="[() => !!deviceData.package || 'This field is required']"
                label="Package"
                placeholder="Package"
                required
                @change="setPackageUID"
            ></v-select>
            <v-divider class="bg-light" ></v-divider>
            <v-select
                :items="fenceNames"
                v-model="selectedFenceName"
                :rules="[() => !!deviceData.geofence || 'This field is required']"
                label="Geofence"
                placeholder="Geofence"
                required
                @change="setFenceUID"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn primary type="submit" >
              Update
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn type="reset" class="bg-warning text-dark" >
              Reset
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.deleteDialog" width="320" >
      <v-card  >
          <v-alert
              :color="dialog.message==null? 'red':dialog.color"
              :type="dialog.type"
              dark
              icon="mdi-alert-rhombus-outline"
              border="top"
          >
            <p>
            {{ dialog.message==null?"ARE YOU SURE YOU WANT TO DELETE THIS DEVICE?":dialog.message}}
            <br>
            <small v-if="dialog.message==null" >
              This is not reversible action?
            </small>
            </p>
          </v-alert>
        <v-card-actions v-if="dialog.message==null" >
          <v-btn color="red" @click="doDeleteDevice" small>
            YES
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="amber" @click="dialog.deleteDialog=false" small>
            NO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {reverseGeocode} from 'esri-leaflet-geocoder'

export default {
  name: "DeviceDetails",
  data: () => ({
    address: "Unknown",
    dialog: {
      isOpen: false,
      deleteDialog: false,
      message: null,
      color: null
    },
    fenceNames:[],
    fenceMap: {},
    selectedFenceName: null,
    packageNames: [],
    packageMap: {},
    selectedPackageName: null,
    deviceData: {
      code: null,
      mac_address: null,
      package: null,
      description: null,
      geofence: null
    },
    dialogMessage:{
      is_open: false,
      message: null,
      type: ''
    }
  }),
  props: ['uid'],
  methods: {
    ...mapActions(['updateDevice','deleteDevice','LoadDevices']),
    updateAddress(e, r) {
      if (e) {
        return
      }
      this.address = r.address.Match_addr
    },
    getCode() {
      const token = this.geoCodeToken
      if (this.devices[this.uid].last_location) {
        reverseGeocode({token}).latlng(this.devices[this.uid].last_location).run((e, r) => this.updateAddress(e, r))
      }
    },
    initDialogData(){
      const p = this.packages[this.devices[this.uid].package.uid];
      const fence =  this.geofence[this.devices[this.uid].geofence.uid];
      this.deviceData.code = this.devices[this.uid].code
      this.deviceData.description = this.devices[this.uid].description
      this.deviceData.mac_address = this.devices[this.uid].mac_address
      this.deviceData.geofence = fence.properties.uid
      this.selectedFenceName = fence.properties.name
      this.selectedPackageName = p.name
      this.deviceData.package = p.uid
    },
    loadFences() {
      const fences = Object.values(this.geofence)
      fences.forEach((f)=>{
        let fence = f.properties
        this.fenceNames.push(fence.name)
        this.fenceMap[fence.name] = fence.uid
      })

      const packages = Object.values(this.packages)
      packages.forEach((p)=>{
        this.packageNames.push(p.name)
        this.packageMap[p.name] = p.uid
      })
      // Open the device Dialog
      this.newDeviceDialog = true
    },
    setFenceUID(e){
      this.deviceData.geofence = this.fenceMap[e]
    },
    setPackageUID(p){
      this.deviceData.package = this.packageMap[p]
    },
    async doUpdate(){
      this.dialogMessage.is_open = false
      const data = this.deviceData
      console.log(data)
      let doSubmit = Object.values(data).every((el)=>{
        return el != null & el != undefined & el != ""
      })
      if(!doSubmit){
        this.dialogMessage.message ="Please fill in entire form"
        this.dialogMessage.is_open = true
      }else{
        data['uid'] = this.uid
        let result = await this.updateDevice(data)
        if (result==true){
          await this.LoadDevices()
          setTimeout(()=>{
            this.$emit('closeDeviceDetails')
            this.dialogMessage = false
            this.resetDialog()
          },3200)
        }else{
          this.dialogMessage.is_open = true
          this.dialogMessage.message = "Update failed. Try again Later."
        }
      }
    },
    resetDialog(){
      this.deviceData.code = null
      this.deviceData.description = null
      this.deviceData.mac_address = null
      this.deviceData.geofence = null
      this.selectedFenceName = null
      this.selectedPackageName = null
      this.deviceData.package = null
      this.dialogMessage.is_open = false
    },
    async doDeleteDevice(){
      let resp = await this.deleteDevice(this.uid)
      if (resp.status==204){
        this.dialog.message ="Device deleted. Good Luck."
        this.dialog.type = 'success'
        this.LoadDevices()
        setTimeout(()=>{
          this.$emit('closeDeviceDetails')
          this.dialogMessage = false
        },3000)

      }else{
        this.dialog.message = "Failed to delete the device. Try again later.."
        this.dialog.type = 'warning'
      }
    }
  },
  created() {
    this.loadFences()
    this.initDialogData()
    this.getCode()
  },
  computed: {
    ...mapGetters({
      devices: 'getDevices',
      broadcast: 'getBroadcast',
      packages: 'getPackages',
      packageImage: 'getPackageImages',
      api: 'getApi',
      hazardLevels: 'getHazardLevels',
      geoCodeToken: 'getGeoCodeToken',
      geofence: 'getGeofence'
    })
  },
  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler() {
        this.getCode()
      }
    },
    uid() {
      this.getCode()
      this.initDialogData()
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