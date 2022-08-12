<template>
<v-card width="300" dense class="optionCard" >
  <v-card-title>
    Options
  </v-card-title>
  <v-card-text class="p-0" >
    <v-list dense ripple >
      <v-list-item-group>
        <v-list-item dense>
          <v-list-item-avatar>
            <v-icon>
              mdi-fence
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Geofence(s)
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu
                right
                origin="center right"
                transition="scale-transition"
                offset-x
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small outlined v-bind="attrs" v-on="on" >
                  <v-icon>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item @click="hideDeviceDetails" >
                  <v-list-item-title>Show Fences</v-list-item-title>
                </v-list-item>
                <v-list-item to="/geofence/" >
                  <v-list-item-title>Create Fences</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
        <v-list-item to="fleet" >
          <v-list-item-avatar>
            <v-icon>
              mdi-car-multiple
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Fleet
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="toggleStaffMenu(true)" >
          <v-list-item-avatar>
            <v-icon>
              mdi-card-account-details-outline
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Staff
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card-text>
</v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "Options",
  methods: {
    ...mapActions(['toggleGeoFenceListView','toggleStaffMenu']),
    hideDeviceDetails() {
      this.toggleGeoFenceListView(true)
      this.$emit('hideDetails')
    }
  }
}
</script>

<style scoped>
.optionCard {
  position: fixed;
  z-index: 999;
  transform: translateX(10px) translateY(80px);
}
</style>