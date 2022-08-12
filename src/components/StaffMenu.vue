<template>
  <v-card class="staffCard">
    <v-card-title>
      Staff
      <v-spacer></v-spacer>
      <v-btn icon small class="bg-danger" color="white" @click="toggleStaffMenu(false)">
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="p-0 m-0">
      <v-subheader>
        <v-icon class="mr-1">
          mdi-account-multiple
        </v-icon>
        Managers
      </v-subheader>
      <v-list dense>
        <v-list-item-group>
          <v-list-item v-for="manager in managers" :key="manager.uid"
                       @click="openUser({uid:manager.uid,role:'manager'})">
            <v-list-item-avatar>
              <v-img :src="manager.profile_img"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ manager.first_name }} {{ manager.last_name }}</v-list-item-title>
              <v-list-item-subtitle>{{ manager.email }}</v-list-item-subtitle>
              <v-list-item-subtitle>Manager</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-subheader>
        <v-icon class="mr-1">
          mdi-steering
        </v-icon>
        Drivers
      </v-subheader>

      <v-list dense>
        <v-list-item-group>
          <v-list-item v-for="driver in drivers" :key="driver.uid" @click="openUser({uid:driver.uid,role:'driver'})">
            <v-list-item-avatar>
              <v-img :src="driver.profile_img"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ driver.first_name }} {{ driver.last_name }}</v-list-item-title>
              <v-list-item-subtitle>{{ driver.email }}</v-list-item-subtitle>
              <v-list-item-subtitle>Driver</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-dialog v-model="userDialog" width="390">
      <v-card v-if="userData">
        <v-img
            height="250"
            :src="userData.profile_img"
        ></v-img>
        <v-card-title>{{ userData.first_name }} {{ userData.last_name }}</v-card-title>
        <v-card-text>
          <div class="my-0 text-subtitle-1">
            <v-icon>
              mdi-email
            </v-icon>
            • {{ userData.email }}
          </div>
        </v-card-text>
        <v-card-title>{{ selectedUserRole.toString().toLowerCase() == 'manager' ? "Fleet" : "Vehicle" }}</v-card-title>
        <v-card-text class="p-0">
          <v-list dense v-if="selectedUserRole.toString().toLowerCase()=='driver' & selectedDriversCar!= null">
            <v-list-item>
              <v-list-item-title> Brand</v-list-item-title>
              <v-list-item-subtitle> {{ selectedDriversCar.brand }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Model</v-list-item-title>
              <v-list-item-subtitle> {{ selectedDriversCar.model_name }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Year</v-list-item-title>
              <v-list-item-subtitle> {{ selectedDriversCar.year }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Registration</v-list-item-title>
              <v-list-item-subtitle> {{ selectedDriversCar.reg_num }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> Colour</v-list-item-title>
              <v-list-item-subtitle> {{ selectedDriversCar.color }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="selectedDriversCar.fleet != null">
              <v-list-item-title> Fleet</v-list-item-title>
              <v-spacer></v-spacer>
              <v-list-item-subtitle> {{ fleets[selectedDriversCar.fleet.uid].name }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-list dense v-if="selectedUserRole.toString().toLowerCase()=='manager' & selectedManagersFleet!= null">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-car-multiple
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Fleet Name
              </v-list-item-title>
              <v-spacer></v-spacer>
              <v-list-item-subtitle>
                {{ selectedManagersFleet.name }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-car
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Fleet Size
              </v-list-item-title>
              <v-spacer></v-spacer>
              <v-list-item-subtitle>
                {{ selectedManagerFleetSize }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="deep-red lighten-2" text @click="userDialog=false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "StaffMenu",
  data: () => ({
    selectedUserUID: null,
    selectedUserRole: null,
    userDialog: null,
    userData: null,
    selectedDriversCar: null,
    selectedManagersFleet: null,
    selectedManagerFleetSize: null
  }),
  methods: {
    ...mapActions(['LoadDrivers', 'LoadManagers', 'toggleStaffMenu', 'LoadFleets', 'LoadVehicles']),
    openUser(data) {
      const uid = data.uid
      const role = data.role
      this.selectedUserRole = role.toString().toUpperCase()
      this.selectedUserUID = uid
      const cars = Object.values(this.vehicles)
      if (role.toString().toLowerCase() == 'manager') {
        const fleets = Object.values(this.fleets)
        let fleet = {}
        let fleetSize = 0
        fleets.forEach((f) => {
          if (f.manager.uid == uid) {
            fleet = f
            return
          }
        })


        cars.forEach((c) => {
          if (c.fleet.uid == fleet.uid) {
            fleetSize = fleetSize + 1
          }
        })

        this.selectedManagerFleetSize = fleetSize
        this.selectedManagersFleet = fleet
        this.userData = this.managers[uid]
      } else {
        let car = null
        cars.forEach((c) => {
          if (c.driver) {
            if (c.driver.uid == uid) {
              car = c
              return
            }
          }
        })
        this.selectedDriversCar = car
        this.userData = this.drivers[uid]
      }
      this.userDialog = true
    }
  },
  computed: {
    ...mapGetters({
      drivers: 'getDrivers',
      managers: 'getManagers',
      fleets: 'getFleets',
      vehicles: 'getVehicles'
    })
  },
  created() {
    this.LoadManagers()
    this.LoadDrivers()
    this.LoadFleets()
    this.LoadVehicles()
  }
}
</script>

<style scoped>
.staffCard {
  position: absolute;
  z-index: 999;
  width: 300px;
  margin-top: 10px;
  margin-left: calc(100% - 370px);
}
</style>