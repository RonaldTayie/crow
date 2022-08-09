<template>
  <v-app id="inspire">
    <v-app-bar app absolute>
      <v-app-bar-nav-icon to="/home">
        <v-icon>
          mdi-arrow-left
        </v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Fleet</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
          transition="slide-y-transition"
          bottom
          offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              dark
              small
              v-bind="attrs"
              v-on="on"
          >
            Options
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group>
            <v-list-item>
              <v-list-item-title @click="openAddVehicleDialog"> Add Vehicle</v-list-item-title>
            </v-list-item>
            <v-list-item @click="addNewUser('driver')">
              <v-list-item-title> Add Driver</v-list-item-title>
            </v-list-item>
            <v-list-item @click="addNewUser('manager')">
              <v-list-item-title> Add Manager</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openAddFleetDialog">
              <v-list-item-title> Add Fleet</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>

      <v-snackbar top right timeout="3700" v-model="snackBar.is_open" style="z-index: 9999;" class="p-0 m-0"
                  elevation="0" absolute color="transparent">
        <v-alert :type="snackBar.type">
          {{ snackBar.message }}
        </v-alert>
      </v-snackbar>

      <AddDriverDialog v-if="newUserRole != null || newUserRole != undefined" :is_open="dialogs.addUser"
                       :role="newUserRole" @closeNewUserDialog="closeUserDialog" @snack="showSnackbar"/>
      <AddVehicleDialog v-if="addVehicleDialog" :is_open="addVehicleDialog" :fleets="fleets"
                        @exitVehicleDialog="closeVehicleAddDialog" @snack="showSnackbar"/>
      <AddFleetDialog v-if="addFleetDialog" :is_open="addFleetDialog" @snack="showSnackbar"
                      @exitFleetAddDialog="closeAddFleetDialog"/>

      <v-container>
        <div class="row">
          <div class="col-md-4 col-sm-12 col-lg-4 col-12" v-if="Object.keys(fleetVehicles).length<1">
            <v-card width="100%" height="auto">
              <v-card-title class="mb-0 pb-0">
                Fleets
              </v-card-title>
              <v-card-text class="p-0">
                <v-list dense>
                  <v-list-item-group v-if="fleets">
                    <v-list-item v-for="i in fleets" :key="i.uid" @click="loadSelectedFleet(i.uid)">
                      <v-list-item-content>
                        <v-list-item-title> {{ i.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ i.date_created }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item color="amber" class="bg-danger" v-if="!fleets">
                    <v-list-item-content>
                      <v-list-item-title>
                        No Fleets
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Please create/add a fleet and vehicles.
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="col-md-4 col-sm-12 col-lg-4 col-12" v-if="Object.keys(fleetVehicles).length>0">
            <v-subheader>
              Fleet: {{ fleets[selectedFleetUid].name.toString().toUpperCase() }}
              <v-spacer></v-spacer>
              <v-btn icon class="bg-danger" small @click="resetView">
                <v-icon>
                  mdi-close
                </v-icon>
              </v-btn>
            </v-subheader>
            <v-card>
              <v-subheader>
                Manager
              </v-subheader>
              <v-card-title class="p-0 m-0">
                <v-list-item dense>
                  <v-list-item-avatar>
                    <v-img :src="fleets[selectedFleetUid].manager.profile_img"/>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ fleets[selectedFleetUid].manager.first_name }}</v-list-item-title>
                    <v-list-item-subtitle> {{ fleets[selectedFleetUid].manager.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>
              <v-card-text class="p-0">
                <v-list>
                  <v-list-item-group>
                    <v-list-item v-for="v in fleetVehicles" :key="v.uid" @click="openVehicle(v.uid)">
                      <v-avatar class="bg-blue p-1 mr-1" color="blue">
                        {{ v.brand[0] }}
                      </v-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="text--accent-1">
                          {{ v.brand }} {{ v.model_name }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip>
                          {{ v.reg_num }}
                        </v-chip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="col-md-8 col-sm-12 col-lg-8 col-12" cols="8" sm="12" md="6" v-if="vehicleUID!=null">
            <v-sheet width="100%" height="auto">
              <v-card>
                <v-card-title>
                  {{ fleetVehicles[vehicleUID].brand }}
                  <small class="mx-1">
                    <small> ({{ fleetVehicles[vehicleUID].model_name }}) </small>
                  </small>
                  :
                  {{ fleetVehicles[vehicleUID].reg_num }}
                  <v-spacer></v-spacer>

                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          dark
                          v-bind="attrs"
                          v-on="on"
                          icon
                          outlined
                      >
                        <v-icon>
                          mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="addImageDialog=true">
                        <v-list-item-icon>
                          <v-icon>
                            mdi-image
                          </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          Add Images
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </v-card-title>

                <v-carousel cycle v-model="loadedVehicleImages" v-if="focusVehicleImages != null" height="250" >
                  <v-carousel-item v-for="img in focusVehicleImages" :key="img.uid" height="300" >
                    <v-img :src="img.image" contain height="300" max-width="100%"></v-img>
                  </v-carousel-item>
                </v-carousel>

                <v-card-text>
                  <v-list class="transparent">
                    <v-list-item>
                      <v-list-item-title>Brand</v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{ fleetVehicles[vehicleUID].brand }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Mode</v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{ fleetVehicles[vehicleUID].model_name }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Registration</v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{ fleetVehicles[vehicleUID].reg_num }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Year</v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{ fleetVehicles[vehicleUID].year }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Colour</v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{ fleetVehicles[vehicleUID].color }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Date Added</v-list-item-title>
                      <v-list-item-subtitle class="text-right">
                        {{ fleetVehicles[vehicleUID].date_added | moment("ddd, D-MM-YYYY") }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  <v-expansion-panels v-if="fleetVehicles[vehicleUID].driver">
                    <v-expansion-panel class="p-0 m-0" flat>
                      <v-expansion-panel-header>
                        Driver
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card
                            class="mx-auto"
                            width="100%"
                            flat
                        >
                          <v-img height="100%">
                            <v-row
                                class="fill-height"
                            >
                              <v-col
                                  align-self="start"
                                  class="pa-0 pb-5"
                                  cols="4"
                              >
                                <v-avatar
                                    class="profile ml-3 mt-3"
                                    color="grey"
                                    size="150"
                                >
                                  <v-img :src="fleetVehicles[vehicleUID].driver.profile_img"></v-img>
                                </v-avatar>
                              </v-col>
                              <v-col>
                                <v-list-item
                                    color="rgba(0, 0, 0, .4)"
                                    dark
                                >
                                  <v-list-item-content>
                                    <v-list-item-title class="text-h5">
                                      <v-icon>
                                        mdi-card-account-details-outline
                                      </v-icon>
                                      {{ fleetVehicles[vehicleUID].driver.first_name }}
                                      {{ fleetVehicles[vehicleUID].driver.last_name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      <v-icon>
                                        mdi-email
                                      </v-icon>
                                      {{ fleetVehicles[vehicleUID].driver.email }}
                                    </v-list-item-subtitle>
                                    <v-list-item-subtitle>Driver</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-col>
                            </v-row>
                          </v-img>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-menu
                        v-if="fleetVehicles[vehicleUID]"
                        :nudge-width="200"
                        offset-x
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            dark
                            v-bind="attrs"
                            v-on="on"
                            outlined
                        >
                          <v-icon>
                            mdi-steering
                          </v-icon>
                          Assign/Reassign Driver
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item-group>

                            <v-list-item v-for="d in drivers" :key="d.uid"
                                         @click="setSelectedDriver({vehicle:vehicleUID,driver: d.uid})">
                              <v-list-item-avatar>
                                <img :src="d.profile_img"/>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title>{{ d.first_name }} {{ d.last_name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ d.email }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>

                    <v-spacer></v-spacer>

                    <v-menu
                        v-if="fleetVehicles[vehicleUID]"
                        :nudge-width="10"
                        nudge-bottom="30"
                        nudge-left="100"
                        bottom
                        max-width="320"
                        absolute
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            dark
                            v-bind="attrs"
                            v-on="on"
                            outlined
                        >
                          <v-icon>
                            mdi-car-multiple
                          </v-icon>
                          Assign/Reassign Fleet
                        </v-btn>
                      </template>

                      <v-card>
                        <v-list>
                          <v-list-item-group>

                            <v-list-item v-for="f in fleets" :key="f.uid"
                                         @click="setSelectedDriver({vehicle:vehicleUID,fleet: f.uid})"
                                         :disabled="fleets[selectedFleetUid].uid==f.uid">
                              <v-list-item-icon>
                                <v-icon>
                                  mdi-car-multiple
                                </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>{{ f.name }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  Manager: {{ f.manager.first_name }} {{ f.manager.last_name }}
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-sheet>
          </div>
        </div>
      </v-container>

      <v-dialog v-model="addImageDialog" width="320">

        <v-card v-if="vehicleUID">
          <v-card-title>
            {{ fleetVehicles[vehicleUID].brand }}
          </v-card-title>
          <v-card-subtitle>
            {{ fleetVehicles[vehicleUID].reg_num }}
          </v-card-subtitle>
          <form @submit.prevent="doUploadVehicleImages" enctype="multipart/form-data">
            <v-card-text>
              <v-file-input
                  label="Images"
                  v-model="newFocusVehicleImages"
                  filled
                  multiple
                  required
                  prepend-icon="mdi-camera"
              ></v-file-input>
            </v-card-text>
            <v-card-actions>
              <v-btn text small outlined type="submit">
                <v-icon>
                  mdi-upload
                </v-icon>
                Upload
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn type="reset">
                <v-icon>
                  mdi-reset
                </v-icon>
                Reset
              </v-btn>
            </v-card-actions>
          </form>
        </v-card>

      </v-dialog>

    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddDriverDialog from "@/components/FleetDialogs/AddDriverDialog";
import AddVehicleDialog from '@/components/FleetDialogs/AddVehicleDialog'
import AddFleetDialog from "@/components/FleetDialogs/AddFleetDialog";

export default {
  name: "FleetView",
  components: {AddFleetDialog, AddDriverDialog, AddVehicleDialog},
  data: () => ({
    fleetVehicles: {},
    vehicleUID: null,
    selectedFleetUid: null,
    newUserRole: null,
    addVehicleDialog: false,
    addFleetDialog: false,
    selectedDriver: null,
    addImageDialog: false,
    newFocusVehicleImages: [],
    loadedVehicleImages: [],
    dialogs: {
      addUser: null,
      addVehicle: null,
      manageDriver: null,
      manageManager: null
    },
    snackBar: {
      is_open: false,
      message: null,
      type: "success"
    }
  }),
  methods: {
    ...mapActions(['LoadDrivers', 'LoadFleets', 'LoadVehicles', 'updateVehicle', 'uploadVehicleImages', 'loadFocusVehicleImages']),
    loadSelectedFleet(uid) {
      let fleet_cars = {}
      let loaded_vehicles = Object.values(this.vehicles)
      loaded_vehicles.forEach((v) => {
        v.fleet.uid == uid ? fleet_cars[v.uid] = v : null
      })
      this.selectedFleetUid = uid
      this.fleetVehicles = fleet_cars
    },
    resetView() {
      this.fleetVehicles = {}
      this.vehicleUID = null
    },
    addNewUser(role) {
      this.newUserRole = role
      this.dialogs.addUser = true
    },
    closeUserDialog() {
      this.dialogs.addUser = false
      this.newUserRole = null
    },
    showSnackbar(data) {
      this.snackBar.message = data.message
      this.snackBar.type = data.type
      this.snackBar.is_open = true
    },
    closeVehicleAddDialog() {
      this.addVehicleDialog = false
    },
    openAddVehicleDialog() {
      this.addVehicleDialog = true
    },
    openAddFleetDialog() {
      this.addFleetDialog = true
    },
    closeAddFleetDialog() {
      this.addFleetDialog = false
    },
    async setSelectedDriver(data) {
      let result = await this.updateVehicle(data)
      let t = 'driver' in data ? 'Driver' : 'Fleet'
      if (result) {
        this.showSnackbar({type: 'success', message: `${t} Reassigned.`})
        t.toLowerCase() == 'driver' ? await this.LoadDrivers() : await this.LoadFleets()
        await this.LoadVehicles()
      } else {
        this.showSnackbar({type: 'alert', message: `${t} Reassignment Failed!!`})
      }
    },
    async openVehicle(uid) {
      this.vehicleUID = uid
      await this.loadFocusVehicleImages(uid)
    },
    async doUploadVehicleImages() {
      this.newFocusVehicleImages.forEach(async (i) => {
        let form = new FormData()
        form.append('image', i, i.name)
        form.append('vehicle', this.vehicleUID)
        let result = await this.uploadVehicleImages(form)
        result ? this.showSnackbar({type: 'success', message: 'Image uploaded!'}) : this.showSnackbar({
          type: 'error',
          message: 'Image upload failed..'
        })
      })
    }
  },
  computed: {
    ...mapGetters({
      fleets: 'getFleets',
      drivers: 'getDrivers',
      vehicles: 'getVehicles',
      focusVehicleImages: 'getFocusVehicleImages'
    })
  },
  created() {
    this.LoadFleets()
    this.LoadVehicles()
    this.LoadDrivers()
  },
  watch: {
    focusVehicleImages: {
      deep: true,
      immediate: true,
      handler(v) {
        this.loadedVehicleImages = v
      }
    }
  }
}
</script>

<style scoped>

</style>