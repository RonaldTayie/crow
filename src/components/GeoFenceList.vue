<template>
<v-card width="300" height="450" class="Fensecard" >
  <v-card-title>
    GeoFences
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleGeoFenceListView(false)" class="btn-danger" >
      <v-icon >
        mdi-close
      </v-icon>
    </v-btn>
  </v-card-title>
  <v-card-text class="p-0" >
    <v-list dense >
      <v-list-item-group>
        <v-list-item v-for="fence in fences" :key="fence.properties.uid" @click="updateFocusGeoFence(fence.properties.uid)" >
          <v-list-item-content>
            <v-list-item-title>
              {{ fence.properties.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip small :color="fence.properties.is_active?'green':'red'" >
                {{ fence.properties.is_active ? "Activated":"Deactivated" }}
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon small  :to="'/geofence/'+fence.properties.uid">
              <v-icon small >
                mdi-feather
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card-text>
</v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "GeoFenceList",
  props: ['devices','fences'],
  methods: {
    ...mapActions([
        'updateFocusGeoFence',
        'toggleGeoFenceListView'
    ]),
  }
}
</script>

<style scoped>
.Fensecard {
  position: absolute;
  z-index: 999;
  width: 300px;
  margin-top: 10px;
  margin-left: calc(100% - 370px);
}
</style>