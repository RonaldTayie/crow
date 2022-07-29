<template>
  <v-app id="inspire">
    <v-navigation-drawer class="pt-4" floating fixed expand-on-hover style="z-index: 9999;">
      <v-menu bottom min-width="200px" rounded offset-x s>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar color="brown" size="48">
              <img :src="api+ user.profile_img.substring(1,user.profile_img.length)" alt="John">
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <div class="text-center pt-5">
            <v-avatar class="ml-auto mr-auto" size="56">
              <img :src="api+ user.profile_img.substring(1,user.profile_img.length)">
            </v-avatar>
          </div>
          <v-list dense class="py-0">
            <v-list-item-group>

              <v-list-item dense class="py-0" disabled inactive>
                <v-list-item-avatar size="25">
                  <v-icon small>
                    mdi-account
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.first_name }} {{ user.last_name[0] }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item dense class="py-0" disabled inactive>
                <v-list-item-avatar size="25">
                  <v-icon small>
                    mdi-email
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.email }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item dense class="py-0">
                <v-list-item-avatar size="25">
                  <v-icon small>
                    mdi-tools
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    Settings
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item dense class="py-0 bg-danger">
                <v-list-item-avatar size="25">
                  <v-icon small>
                    mdi-location-exit
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    Logout
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-list-item-group>
          </v-list>

        </v-card>
      </v-menu>

      <v-divider></v-divider>

      <v-list
          nav
          dense
      >
        <v-list-item link @click="toggleDeviceMenu(true)">
          <v-list-item-icon>
            <v-icon>mdi-chip</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Devices</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="toggleReportWindow(true)">
          <v-list-item-icon>
            <v-icon>mdi-file-document-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Reports</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-system-bar>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-signal-cellular-outline</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span>12:30</span>
    </v-system-bar>

    <v-main>

      <v-snackbar
          v-model="snackbar.visible"
          :timeout="snackbar.timeout"
          absolute
          style="z-index: 9999;"
          top
          right
          :color="snackbar.color"
      >
        {{ snackbar.message }}

        <template v-slot:action="{ attrs }">
          <v-btn
              v-bind="attrs"
              @click="hideSnackbar()"
              icon
              small
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </template>
      </v-snackbar>

      <div class="container-fluid pl-14">
        <DevicesMenu :broadcast="markers" @focus="showDeviceDetails" v-if="isDeviceMenuOpen"/>
        <DeviceReport v-if="isReportOpen" @reportViewError="triggerSnackBar"/>
        <DeviceDetails v-if="focusMarker.is_open" :uid="focusMarker.uid"
                       @closeDeviceDetails="focusMarker.is_open=false"/>
        <l-map :zoom="zoom" :center="home" class="map" ref="map" :markerZoomAnimation="true" :zoomAnimation="true">
          <l-tile-layer :url="mapUrl" :attribution="mapAttribution" layer-type="base"></l-tile-layer>
          <l-marker :lat-lng="markers.home"></l-marker>
          <l-marker :lat-lng="v.last_location" v-for="(v,k) in devices" :key="k" @click="showDeviceDetails(k)"></l-marker>
          <l-circle
              :lat-lng="markers.home"
              :radius="geoFences.circles['C1'].radius"
              :color="geoFences.circles['C1'].color"
          />
        </l-map>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import {LMap, LTileLayer, LMarker, LCircle} from 'vue2-leaflet';
import {mapActions, mapGetters, mapMutations} from "vuex";
import DevicesMenu from "@/components/DevicesMenu";
import DeviceDetails from "@/components/DeviceDetails";
import DeviceReport from "@/components/DeviceReport";
import {latLng} from "leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    DevicesMenu,
    DeviceDetails,
    DeviceReport,
    LCircle,
  },
  data() {
    return {
      drawer: true,
      mapZoom: 15,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 10,
      home: [-26.8748, 26.6532],
      focusMarkerID: null,
      views: {
        devices: false
      },
      markers: {
        home: latLng(-26.8748, 26.6532)
      },
      geoFences: {
        is_fencing: false,
        circles: {
          'C1': {
            center: [47.413220, -1.0482],
            radius: 4500,
            color: 'red'
          }
        },
        polygons: {
          "1": {}
        }
      },
      focusMarker: {
        is_open: false,
        uid: null,
      }
    };
  },
  methods: {
    ...mapActions(['connect_User', 'LoadDevices', 'mutateBroadcast', 'loadPackages', 'loadHazards', 'toggleDeviceMenu', 'setFocusDeviceUID', 'toggleReportWindow', 'setSnackbarMessage', 'setSnackbarColor', 'showSnackbar', 'hideSnackbar']),
    ...mapMutations(['updateDeviceLocation',]),
    updateMap() {
      // this.markers.home = latLng(-26.8748, 26.6532)
    },
    showDeviceDetails(uid) {
      this.focusMarkerID = uid
      this.focusMarker.is_open = true
      this.focusMarker.uid = uid

      this.home = this.devices[uid].last_location
      this.zoom = 15

      this.setFocusDeviceUID(uid)
    },
    recenter(coords){
      this.home = [coords.lat, coords.lng]
    },
    triggerSnackBar(v) {
      this.setSnackbarColor(v.color)
      this.setSnackbarMessage(v.message)
      this.showSnackbar()
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
          editableLayers.addLayer(layer);
        });
      });
    }
  },
  computed: {
    ...mapGetters({
      mapAttribution: 'getMapAttribution',
      mapUrl: 'getMapUrl',
      user: 'getUserData',
      api: 'getApi',
      broadcast: 'getBroadcast',
      socket: 'getUserConnection',
      devices: 'getDevices',
      drawingToolsStatus: 'drawingToolsStatus',
      isDeviceMenuOpen: 'getDeviceMenuState',
      isReportOpen: 'getReportWindowState',
      snackbar: 'getSnackbar'
    })
  },
  created() {
    this.connect_User()
    this.LoadDevices()
    this.loadPackages()
    this.loadHazards()
    this.socket.onmessage = (v) => {
      const message = JSON.parse(v.data)
      const key = message['device']
      if ("data" in message) {
        const msg = message['data']
        const value = latLng(msg.lon, msg.lat)
        const broadcast = {}
        broadcast[key] = value
        broadcast.speed = msg.speed
        this.markers[key] = value
        if(key === this.focusMarkerID){
          this.recenter(value)
        }
        this.updateDeviceLocation({key, location: value})
        this.mutateBroadcast(broadcast)

        this.updateMap()
        // !this.geoFences.is_fensing ? this.updateMap() : null
      }
    }
  },
  mounted() {
    this.drawingToolsStatus ? this.InitDrawingTools() : null
  }
}
</script>

<style scoped>
.map {
  height: 97vh;
}
</style>