<template>
<v-dialog width="320" v-model="is_open" persistent >

  <v-card>
    <v-card-title>
      Add Vehicle <v-spacer></v-spacer>
      <v-btn icon @click="$emit('exitVehicleDialog')" small class="bg-danger" color="white" ripple >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-card-title>
    <form lazy_validation @submit.prevent="doAddVehicle" >
      <v-card-text>
        <v-text-field v-model="vehicle.brand" required type="text" placeholder="Brand" label="Brand" dense prepend-icon="mdi-car"></v-text-field>
        <v-text-field v-model="vehicle.model_name" required type="text" placeholder="Model" label="Model" dense prepend-icon="mdi-car-sports"></v-text-field>
        <v-text-field v-model="vehicle.reg_num" required type="text" placeholder="Registration" label="Registration" dense prepend-icon="mdi-car-select"></v-text-field>
        <v-text-field v-model="vehicle.year" required type="number" placeholder="Year" label="Year" dense prepend-icon="mdi-calendar-clock-outline"></v-text-field>
        <v-text-field v-model="vehicle.color" required type="text" placeholder="Colour" label="Colour" dense prepend-icon="mdi-format-color-fill"></v-text-field>
        <v-divider></v-divider>
        <v-select placeholder="Select Fleet" label="Fleet" required :items="fleetNameList" dense prepend-icon="mdi-car-multiple" @change="setSelectedFleet" ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" text class="bg-primary" small >
          Submit
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn type="reset" text class="bg-warning" color="black" >
          Reset
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>

</v-dialog>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "AddVehicleDialog",
  data: ()=>({
    fleetNameList: [],
    fleetUidNameMap: {},
    vehicle: {
      brand: null,
      model_name: null,
      reg_num: null,
      year: null,
      fleet: null,
      color: 'white'
    }
  }),
  props: ['is_open'],
  methods: {
    ...mapActions(['LoadFleets','createVehicle','addVehicle','LoadVehicles']),
    initFleets(){
      let fleetValues = Object.values(this.fleets)
      let nameUidMap = {}
      let names = []
      fleetValues.forEach((e)=>{
        names.push(e.name)
        nameUidMap[e.name] = e.uid
      })
      this.fleetNameList = names
      this.fleetUidNameMap = nameUidMap
    },
    setSelectedFleet(name){
      this.vehicle.fleet= this.fleetUidNameMap[name]
    },
    async doAddVehicle(){
      let result = await this.addVehicle(this.vehicle)
      if(result){
        this.$emit('snack',{type:'success',message:'Vehicle Added Successfully.'})
        this.LoadVehicles()
        this.$emit('exitFleetAddDialog')
      }else{
        this.$emit('snack',{type:'error',message:'Failed to add vehicle.'})
      }
    },
  },
  computed:{
    ...mapGetters({
      fleets: 'getFleets',
      drivers: 'getDrivers'
    })
  },
  created() {
    this.LoadFleets()
    this.initFleets()
  }
}
</script>

<style scoped>

</style>