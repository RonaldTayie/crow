<template>
  <v-dialog width="320" v-model="is_open">
    <v-card>
      <v-card-title>
        Add Fleet
        <v-spacer></v-spacer>
        <v-btn icon color="white" class="bg-danger" small @click="$emit('exitFleetAddDialog')">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <form @submit.prevent="doAddFleet">
        <v-alert v-if="isAlertOpen" type="error">
          Please select a manager for this fleet.
        </v-alert>

        <v-card-text>
          <v-text-field v-model="fleet.name" required placeholder="Fleet Name (Unique)"
                        label="Fleet Name"></v-text-field>
          <v-subheader v-if="selectedManager">
            Selected Manager
          </v-subheader>
          <v-list-item dense v-if="selectedManager">
            <v-list-item-avatar>
              <v-img :src="selectedManager.profile_img"/>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ selectedManager.first_name }}
                {{ selectedManager.last_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedManager.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="selectedManager"></v-divider>
          <v-menu
              :close-on-content-click="false"
              offset-x
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  dark
                  v-bind="attrs"
                  v-on="on"
              >
                Select Manager
              </v-btn>
            </template>

            <v-card>
              <v-divider></v-divider>
              <v-list>
                <v-list-item-group>
                  <v-list-item v-for="m in managers" :key="m.uid" @click="setSelectedManager(m.uid)">
                    <v-list-item-avatar>
                      <v-img :src="m.profile_img"/>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ m.first_name }}
                        {{ m.last_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ m.email }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-btn class="bg-success" type="submit">
            Submit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="bg-warning" text color="black" type="reset">
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
  name: "AddFleetDialog",
  data: () => ({
    selectedManager: null,
    isAlertOpen: null,
    fleet: {
      name: null,
      manager: null
    }
  }),
  props: ['is_open'],
  methods: {
    ...mapActions(['LoadManagers', 'LoadFleets', 'addFleet']),
    async doAddFleet() {
      if (this.fleet.manager != null) {
        let result = await this.addFleet(this.fleet)
        if (result) {
          this.$emit('snack', {type: 'success', message: 'Fleet Added Successfully.'})
          await this.LoadFleets()
          this.$emit('exitFleetAddDialog')
        } else {
          this.$emit('snack', {type: 'error', message: 'Failed to add Fleet.'})
        }
      } else {
        this.isAlertOpen = true
      }
    },
    async setSelectedManager(uid) {
      this.selectedManager = this.managers[uid]
      this.fleet.manager = this.managers[uid].uid
    }
  },
  computed: {
    ...mapGetters({
      managers: 'getManagers',
      fleets: 'getFleets'
    })
  },
  created() {
    this.LoadFleets()
    this.LoadManagers()
  },
}
</script>

<style scoped>

</style>