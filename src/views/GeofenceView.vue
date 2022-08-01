<template>
  <v-app id="inspire">
    <v-app-bar flat class="no-print" dense>
      <v-app-bar-nav-icon to="/home" class="no-print" >
        <v-icon>
          mdi-home
        </v-icon>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              dark
              v-bind="attrs"
              v-on="on"
              small
              text
          >
            Options <v-icon x-small class="ml-2" >mdi-wrench</v-icon>
          </v-btn>
        </template>
        <v-list dense >
          <v-list-item-group>
            <v-list-item dense class="py-0" @click="doUpdateGeofence" >
              <v-list-item-icon>
                <v-icon small >
                  mdi-content-save
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Save Changes
              </v-list-item-title>
            </v-list-item>
            <v-list-item dense class="py-0" @click="drawNewFence()" >
              <v-list-item-icon>
                <v-icon small >
                  mdi-draw-pen
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                New Fence
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
        <v-card width="250" class="fence-details" >
          <v-card-title>
            Fence Details
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="FenceName" hint="Fence Name" dense class="p-0 m-0" placeholder="Fence Name"></v-text-field>
            <v-row>
              <v-col cols="4"  class="py-0 m-0">
                <v-switch v-model="isFenceActive" ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <l-map :zoom="zoom" :center="home" class="map" ref="map" :markerZoomAnimation="true" :zoomAnimation="true">
          <l-tile-layer :url="mapUrl" :attribution="mapAttribution" layer-type="base"></l-tile-layer>
          <l-marker :lat-lng="v" v-for="(v,k) in polygon" :key="k" draggable @drag="updatePolygon" @dragend="appendChanges(k)" ></l-marker>
          <l-polygon  :lat-lngs.sync="polygon" color="red" fill-color="white"></l-polygon>
        </l-map>
    </v-main>
</v-app>
</template>

<script>

import {LMap,LMarker,LPolygon,LTileLayer} from "vue2-leaflet";
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "GeofenceView",
  components:{
    LMap,
    LMarker,
    LPolygon,
    LTileLayer
  },
  data: ()=>({
    zoom: 12,
    home: [-20.95095611323343, 29.014987476711582],
    polygon: [],
    movedMarker:{
      id: null,
      newLocation: null
    },
    newFence: false,
    FenceName: null,
    isFenceActive: false
  }),
  methods: {
    ...mapActions(['loadGeoFences','LoadDevices','updateGeofence']),
    ...mapMutations(['changeDrawingTools']),
    async loadFence(){
      const uid = this.$route.params.uid
      if(this.fences[uid]){
        const coords = this.fences[uid].geometry.coordinates[0]
        this.polygon = coords
        this.home = coords[0]
      }else{
        await this.loadGeoFences()
        await this.LoadDevices()
      }
    },
    updatePolygon(e){
      this.movedMarker.newLocation = e.target._latlng
    },
    appendChanges(k){
      this.movedMarker.id = k
      const newLoc = this.movedMarker.newLocation
      let p = [...this.polygon]
      p[k] = [newLoc.lat,newLoc.lng]
      this.polygon = p
    },
    doUpdateGeofence(){
      let data = {}
      if(this.newFence){
        data = {
          name: this.FenceName,
          is_active: this.isFenceActive,
          coordinates: this.polygon
        }
        data
      }else{
        data = {
          fence: this.$route.params.uid,
          coordinates: this.polygon
        }
        this.updateGeofence(data)
      }
    },

    InitDrawingTools() {
      this.$nextTick(() => {
        const map = this.$refs.map.mapObject;
        let drawnItems = new window.L.FeatureGroup();
        const drawControl = new window.L.Control.Draw({
          position: 'topright',
          draw: {
            polyline: {
              allowIntersection: true,
              showArea: true
            },
            polygon: true,
            rectangle: true,
            circle: true,
            edit: true,
          },
          edit: {
            featureGroup: drawnItems,
          },
        });
        map.addControl(drawControl);
        const editableLayers = new window.L.FeatureGroup().addTo(map);
        map.on(window.L.Draw.Event.CREATED, (e) => {
          const layer = e.layer;
          let coords = []
          layer._latlngs[0].forEach((c)=>{
            let loc = [c.lat,c.lng]
            coords.push(loc)
          })
          this.polygon = coords
          editableLayers.addLayer(layer);
        });
      });
    },
    drawNewFence(){
      this.polygon = []
      this.newFence = true
      this.isFenceActive = false
      this.FenceName = null
      this.InitDrawingTools()
    }

  },
  computed: {
    ...mapGetters({
      mapAttribution: 'getMapAttribution',
      mapUrl: 'getMapUrl',
      fences: 'getGeofence',
      devices: 'getDevices',
      drawingToolsStatus: 'drawingToolsStatus',
    })
  },
  created() {
    this.loadGeoFences()
    this.LoadDevices()
  },
  mounted() {
    this.drawingToolsStatus ? this.InitDrawingTools() : null
  },
  watch: {
    fences: {
      deep: true,
      handler(v){
        if(v){
          const fence = v[this.$route.params.uid]
          if(fence['properties']){
            this.FenceName = fence.properties.name
            this.isFenceActive = fence.properties.is_active
          }
          this.loadFence()
        }
      }
    }
  }
}
</script>

<style scoped>
.map {
  height: 90vh;
  z-index: 2;
}
.fence-details{
  position: absolute;
  z-index: 9;
  transform: translateX(10px) translateY(15vh);
}
</style>