<template>
  <v-card width="300" height="500" dense class="tabCard">
    <v-card-title>
      Devices
      <v-spacer></v-spacer>
      <v-btn @click="toggleDeviceMenu(false)" icon class="bg-danger" small>
        <v-icon color="white" >mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="p-0 m-0" >
      <v-btn fab absolute right bottom primary small color="blue" @click="loadFences" >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-list dense>
        <v-list-item-group>
          <v-list-item v-for="item in devices" :key="item.uid" @click="open(item.uid)" ripple dense>
            <v-list-item-content>
              <v-list-item-title>{{item.code}}</v-list-item-title>
              <v-list-item-subtitle v-if="devices[item.uid].last_location" >
                {{devices[item.uid].last_location.lat}}
                {{devices[item.uid].last_location.lng}}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="p-0" v-model="broadcast[item.uid]" >
                <v-chip x-small >{{broadcast[item.uid]?broadcast[item.uid].speed:"0"}} kph</v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-dialog v-model="newDeviceDialog" width="320" style="z-index: 9999;">
      <v-card>
        <v-card-title>
          New Device
          <v-spacer></v-spacer>
          <v-btn icon color="white" class="bg-danger" @click="newDeviceDialog = false" small>
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
        <v-alert
            :color="(creationState.isDone==false?'blue':'green')||altColor"
            border="top"
            outlined
            v-if="creationState.isCreating==true"
            :type="(creationState.isDone==false?altType:'success')"
        >
          <v-progress-circular rotate indeterminate v-if="creationState.isDone==false" ></v-progress-circular> {{creationState.isDone==false?'Please Wait....':'New Device Created...'}}
        </v-alert>
        <v-form @submit.prevent="doAddDevice" lazy-validation class="py-0" v-if="creationState.isCreating==false" >
          <v-card-text class="py-0" >
            <v-text-field
                v-model="newDevice.code"
                :rules="[() => !!newDevice.code || 'This field is required']"
                hint="Unique code to identify the device"
                label="Device Code (Unique)"
                placeholder="Device Code (Unique)"
                required
            ></v-text-field>
            <v-text-field
                v-model="newDevice.mac"
                :rules="[() => !!newDevice.mac || 'This field is required']"
                hint="Device Mac address."
                label="Device MAC address"
                placeholder="Device MAC Address"
                required
            ></v-text-field>
            <v-text-field
                v-model="newDevice.description"
                :rules="[() => !!newDevice.description || 'This field is required']"
                label="Description"
                placeholder="Description"
                required
            ></v-text-field>
            <v-select
                :items="packageNames"
                v-model="selectedPackageName"
                :rules="[() => !!newDevice.package || 'This field is required']"
                label="Package"
                placeholder="Package"
                required
                @change="setPackageUID"
            ></v-select>
            <v-divider class="bg-light" ></v-divider>
            <v-select
                :items="fenceNames"
                v-model="selectedFenceName"
                :rules="[() => !!newDevice.geofence || 'This field is required']"
                label="Geofence"
                placeholder="Geofence"
                required
                @change="setFenceUID"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn primary type="submit" >
              Add
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn type="reset" class="bg-warning text-dark" >
              Reset
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import {latLng} from "leaflet";

export default {
  name: 'DevicesMenu',
  data: () => ({
    tab: 0,
    stream:{},
    newDeviceDialog: false,
    fenceNames:[],
    fenceMap: {},
    selectedFenceName: null,
    packageNames: [],
    packageMap: {},
    selectedPackageName: null,
    newDevice: {
      code: null,
      mac: null,
      package: null,
      description: null,
      geofence: null
    },
    dialogMessage: {
      is_open: false,
      message: null
    },
    creationState: {
      isCreating: false,
      isDone: false,
      altColor: 'amber',
      altType: 'warning'
    }
  }),
  methods: {
    ...mapActions(['toggleDeviceMenu','createDevice','LoadDevices']),
    open(uid){
      this.$emit('focus',uid)
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
      this.newDevice.geofence = this.fenceMap[e]
    },
    setPackageUID(p){
      this.newDevice.package = this.packageMap[p]
    },
    async doAddDevice(){
      this.dialogMessage.is_open = false
      const data = this.newDevice
      let doSubmit = Object.values(data).every((el)=>{
        return el != null & el != undefined & el != ""
      })
      if(!doSubmit){
        this.dialogMessage.message ="Please fill in entire form"
        this.dialogMessage.is_open = true
      }else{
        this.dialogMessage.is_open = false
        this.creationState.isCreating = true
        let result = await this.createDevice(data)
        if (result.status==201){
          this.creationState.isDone = true
          await this.LoadDevices()
          setTimeout(()=>{
            this.creationState.isDone ==true?this.resetDialog():null
          },3200)
        }else{
          this.creationState.isDone = false
          this.dialogMessage.message ="Failed to add Device. Try again Later.."
          this.dialogMessage.is_open = true
          this.creationState.isCreating = false
        }
      }
    },
    resetDialog(){
      this.newDevice = null
      this.dialogMessage= null
      this.creationState = null
      // Close the device Dialog
      this.newDeviceDialog = false
    }
  },
  computed:{
    ...mapGetters({
      socket: 'getUserConnection',
      devices: 'getDevices',
      broadcast:'getBroadcast',
      geofence: 'getGeofence',
      packages: 'getPackages'
    }),
  },
  created() {},
}
</script>
<style>
.tabCard {
  position: fixed;
  z-index: 999;
  transform: translateX(10px) translateY(80px);
}
</style>
