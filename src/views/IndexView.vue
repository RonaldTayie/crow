<template>
  <v-app id="inspire">
    <v-main>
      <v-dialog
          v-model="login.loginDialog"
          hide-overlay
          persistent
          timout="5000"
          width="300"
      >
        <v-card
            dark
        >
          <v-card-text class="pb-0">
            Please stand by
            <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
            ></v-progress-linear>
            Logging you in.
          </v-card-text>
        </v-card>
      </v-dialog>
      <div class="wrapper">
        <v-snackbar color="bg-danger" v-model="login.showSnackBar" top :timeout="10000">
          <v-icon red>
            mdi-alert-outline
          </v-icon>
          {{ login.message }}
        </v-snackbar>

        <div class="stage"  >
          <form @submit.prevent="doLogin()" v-if="width>450" >
            <v-card id="form-card" light>
              <v-card-text>
                <v-text-field
                    v-model="user.username"
                    prepend-icon="mdi-email"
                    label="E-mail"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="user.password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    hint="Password"
                    counter
                    @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                    class="mr-4"
                    type="submit"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </form>
          <v-card width="320" >
            <v-banner two-line v-if="width<=450">
              <v-avatar
                  slot="icon"
                  color="red accent-4"
                  size="40"
              >
                <v-icon
                    icon="mdi-lock"
                    color="white"
                >
                  mdi-alert-octagram-outline
                </v-icon>
              </v-avatar>
              <p>Sorry, you will need a larger device to access.</p>
              <p>A laptop or desktop will do just fine. Else, if you are using a smartphone you can use the <i><b>Desktop Site</b></i> option in your browser app.</p>
            </v-banner>
          </v-card>
        </div>
        <l-map :zoom="zoom"
               :center="home"
               class="map"
        >
          <l-tile-layer :url="mapUrl" :attribution="mapAttribution"></l-tile-layer>
          <l-marker :lat-lng="home"></l-marker>
        </l-map>
      </div>
    </v-main>
  </v-app>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {LMap, LMarker, LTileLayer} from "vue2-leaflet";

export default {
  name: "IndexView",
  data: () => ({
    width: window.innerWidth,
    height: window.innerWidth,
    home: [-20.95095611323343, 29.014987476711582],
    zoom: 15,
    showPassword: false,
    user: {
      username: null,
      password: null,
    },
    rules: {
      required: value => !!value || 'Required.',
      emailMatch: () => (`The email and password you entered don't match`),
    },
    login: {
      showSnackBar: false,
      message: "",
      loginDialog: false
    }
  }),
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  methods: {
    ...mapActions(['Login']),
    async doLogin() {
      let login = await this.Login(this.user)
      if ('message' in login && login.status == 'failed') {
        const msg = login.message.response.data.non_field_errors[0]
        this.login.message = msg
        this.login.showSnackBar = true
      } else if (login.status == 'success') {
        this.login.loginDialog = true
        setTimeout(()=>{
          this.$router.push('home')
        },2000)
      }
    }
  },
  computed: {
    ...mapGetters({
      mapAttribution: 'getMapAttribution',
      mapUrl: 'getMapUrl',
    })
  }
}
</script>

<style scoped>

.wrapper {
  height: 100%;
}

.map {
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.stage {
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stage form {
  width: 320px;
  background-color: rgba(0, 0, 0, 0.5);
}

</style>
