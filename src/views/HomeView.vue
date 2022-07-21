<template>
  <v-app id="inspire">
    <v-navigation-drawer
        class="pt-4"
        mini-variant
        floating
        fixed
        style="z-index: 9;"
    >
      <v-avatar
          v-for="n in 6"
          :key="n"
          :color="`grey ${n === 1 ? 'darken' : 'lighten'}-1`"
          :size="n === 1 ? 36 : 20"
          class="d-block text-center mx-auto mb-9"
      ></v-avatar>
    </v-navigation-drawer>
    <v-system-bar>
      <v-spacer></v-spacer>
      <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-signal-cellular-outline</v-icon>
      <v-icon>mdi-battery</v-icon>
      <span>12:30</span>
    </v-system-bar>
    <v-main>
      <div class="container-fluid pl-14">
        <l-map :zoom="mapZoom"
               :center="home"
               class="map">
          <l-tile-layer :url="mapUrl" :attribution="mapAttribution"></l-tile-layer>
          <l-marker :lat-lng="home"></l-marker>
        </l-map>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
import {mapGetters} from "vuex";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  data() {
    return {
      mapZoom: 15,
      home: [51.504, -0.159]
    };
  },
  computed: {
    ...mapGetters({
      mapAttribution:'getMapAttribution',
      mapUrl: 'getMapUrl',
    })
  }
}
</script>

<style scoped>
.map {
  width: 100vw;
  height: 96vh;
  background-color: #15bfaa;
  z-index: 1;
}
</style>