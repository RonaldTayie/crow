<template>
  <v-app id="inspire">
    <v-app-bar app flat class="no-print" ></v-app-bar>
    <v-main>
      <div class="container">

      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "ReportView",
  created() {
    this.$vuetify.theme.dark = false
  }
}
</script>

<style scoped>

</style>