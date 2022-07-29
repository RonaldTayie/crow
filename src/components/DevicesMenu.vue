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
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import {latLng} from "leaflet";

export default {
  name: 'DevicesMenu',
  data: () => ({
    tab: 0,
    stream:{}
  }),
  methods: {
    ...mapActions(['toggleDeviceMenu']),
    open(uid){
      this.$emit('focus',uid)
    },
  },
  computed:{
    ...mapGetters({
      socket: 'getUserConnection',
      devices: 'getDevices',
      broadcast:'getBroadcast'
    }),
  },
  created() {
  },
}
</script>
<style>
.tabCard {
  position: fixed;
  z-index: 999;
  transform: translateX(10px) translateY(80px);
}
</style>
