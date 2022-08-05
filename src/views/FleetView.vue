<template>
  <v-app id="inspire">
    <v-app-bar app absolute>
      <v-app-bar-nav-icon to="/home" >
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
        <v-list dense >
          <v-list-item-group>
            <v-list-item>
              <v-list-item-title @click="dialogs.addVehicle=true" > Add Vehicle </v-list-item-title>
            </v-list-item>
            <v-list-item @click="addNewUser('driver')" >
              <v-list-item-title> Add Driver </v-list-item-title>
            </v-list-item>
            <v-list-item @click="addNewUser('manager')" >
              <v-list-item-title> Add Manager </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Assign/Reassign Manager </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Assign/Reassign Driver </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn @click="showSnackbar({type:'success',message: 'Created'})" >
        snack
      </v-btn>
    </v-app-bar>
    <v-main>

      <v-snackbar top right timeout="3700" v-model="snackBar.is_open" class="p-0 m-0" elevation="0" absolute color="transparent">
        <v-alert :type="snackBar.type">
          {{ snackBar.message }}
        </v-alert>
      </v-snackbar>

      <AddDriverDialog v-if="newUserRole != null || newUserRole != undefined" :is_open="dialogs.addUser" :role="newUserRole" @closeNewUserDialog="closeUserDialog" @snack="showSnackbar" />
      <AddVehicleDialog v-if="dialogs.addVehicle" :is_open="dialogs.addVehicle" :fleets="fleets" @exitVehicleDialog="closeVehicleAddDialog" />

      <v-container>
        <div class="row">
          <div class="col-md-4 col-sm-12 col-lg-4 col-12" v-if="Object.keys(fleetVehicles).length<1" >
            <v-card width="100%" height="auto">
              <v-card-text class="p-0" >
                <v-list>
                  <v-list-item-group>
                    <v-list-item v-for="i in fleets" :key="i.uid" @click="loadSelectedFleet(i.uid)" >
                      <v-list-item-content>
                        <v-list-item-title> {{ i.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{i.date_created}}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="col-md-4 col-sm-12 col-lg-4 col-12" v-if="Object.keys(fleetVehicles).length>0" >
            <v-card>
              <v-subheader>
                Manager
                <v-spacer></v-spacer>
                <v-btn icon class="bg-danger" small @click="resetView" >
                  <v-icon>
                    mdi-close
                  </v-icon>
                </v-btn>
              </v-subheader>
              <v-card-title class="p-0 m-0" >
                <v-list-item dense>
                  <v-list-item-avatar></v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Manager Name</v-list-item-title>
                    <v-list-item-subtitle> Manager Email </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>
              <v-card-text class="p-0"  >
                <v-list>
                  <v-list-item-group>
                    <v-list-item v-for="v in fleetVehicles" :key="v.uid" @click="vehicleUID=v.uid" >
                      <v-avatar>
                        {{v.brand}}
                      </v-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{v.brand}} {{v.model_name}}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip>
                          {{v.reg_num}}
                        </v-chip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
          <div class="col-md-8 col-sm-12 col-lg-8 col-12" cols="8" sm="12" md="6" v-if="vehicleUID!=null" >
            <v-sheet width="100%" height="auto" >
              <v-card>
                <v-card-title>
                  {{fleetVehicles[vehicleUID].brand}}
                  <small class="mx-1" >
                      <small> ({{fleetVehicles[vehicleUID].model_name}}) </small>
                  </small>
                  :
                  {{fleetVehicles[vehicleUID].reg_num}}
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text>

                  <v-list class="transparent">
                    <v-list-item>
                      <v-list-item-title>Brand </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].brand}} </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Mode </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].model_name}} </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Registration </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].reg_num}} </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Year </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].year}} </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Colour </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].color}} </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Date Added </v-list-item-title>
                      <v-list-item-subtitle class="text-right"> {{fleetVehicles[vehicleUID].date_added}} </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>

                  <v-expansion-panels>
                    <v-expansion-panel class="p-0 m-0" flat>
                      <v-expansion-panel-header>
                        Driver
                      </v-expansion-panel-header>
                      <v-expansion-panel-content  >
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
                                      {{fleetVehicles[vehicleUID].driver.first_name}}
                                      {{fleetVehicles[vehicleUID].driver.last_name}}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                      <v-icon>
                                        mdi-email
                                      </v-icon>
                                      {{fleetVehicles[vehicleUID].driver.email}}
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

                </v-card-text>
              </v-card>
            </v-sheet>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AddDriverDialog from "@/components/FleetDialogs/AddDriverDialog";
import AddVehicleDialog from '@/components/FleetDialogs/AddVehicleDialog'
export default {
  name: "FleetView",
  components: {AddDriverDialog,AddVehicleDialog},
  data: ()=>({
    fleetVehicles: {},
    vehicleUID: null,
    newUserRole: null,
    dialogs: {
      addUser:null,
      addVehicle: null,
      manageDriver: null,
      manageManager: null
    },
    snackBar: {
      is_open:false,
      message: null,
      type: "success"
    }
  }),
  methods: {
    ...mapActions(['LoadDrivers', 'LoadFleets', 'LoadVehicles']),
    loadSelectedFleet(uid){
      let fleet_cars = {}
      let loaded_vehicles = Object.values(this.vehicles)
      loaded_vehicles.forEach((v)=>{
        v.fleet.uid == uid? fleet_cars[v.uid]=v:null
      })
      this.fleetVehicles = fleet_cars
    },
    resetView(){
      this.fleetVehicles = {}
      this.vehicleUID = null
    },
    addNewUser(role){
        this.newUserRole = role
        this.dialogs.addUser=true
    },
    closeUserDialog(){
      this.dialogs.addUser=false
      this.newUserRole = null
    },
    showSnackbar(data){
      this.snackBar.message = data.message
      this.snackBar.type = data.type

      this.snackBar.is_open = true
    },
    closeVehicleAddDialog(){
      this.dialogs.addVehicle=false
    }
  },
  computed: {
    ...mapGetters({
      fleets: 'getFleets',
      drivers: 'getDrivers',
      vehicles: 'getVehicles'
    })
  },
  created() {
    this.LoadFleets()
    this.LoadVehicles()
    // this.LoadDrivers()
  }
}
</script>

<style scoped>

</style>