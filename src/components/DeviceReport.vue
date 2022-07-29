<template>
<v-card width="300px" id="rv" >
  <v-card-title>
    Device Report
  </v-card-title>
  <v-card-subtitle></v-card-subtitle>
  <v-form lazy-validation @submit.prevent="RenderReport" class="form" >
    <v-card-text>
      <v-select :items="list" label="Select Device" required v-model="selectedDevice" ></v-select>
      <v-divider class="p-0 my-0" ></v-divider>
      <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              v-model="date_range"
              label="Report Date Range"
              persistent-hint
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="date_range"
            no-title
            range
        ></v-date-picker>
        <v-btn text @click="menu=!menu" >
          save
        </v-btn>
      </v-menu>
    </v-card-text>
    <v-card-actions>
      <v-btn type="submit" >Render Report</v-btn>
    </v-card-actions>
  </v-form>
</v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
  name: "DeviceReport",
  data: ()=>({
    list: [],
    selectedDevice: null,
    menu: null,
    date_range: []
  }),
  methods: {
    ...mapActions(['setData']),
    initList(){
      Object.values(Object.values(this.devices)).forEach((e)=>{
        this.list.push(e.code)
      })
    },
    RenderReport(){
      if(this.selectedDevice==undefined || this.date_range == []){
        this.$emit('reportViewError',{color:'amber darken-2',message:'Select Device and Set Date Range'})
      }else{
        const data = {date:this.date_range,device_code:this.selectedDevice}
        this.setData(data)
        this.$router.push('/report')
      }
    }
  },
  created() {
    this.initList()
  },
  computed: {
    ...mapGetters({
      devices: 'getDevices'
    })
  }
}
</script>

<style scoped>
#rv{
  position: fixed;
  z-index: 999;
  transform: translateX(10px) translateY(60px);
}
</style>