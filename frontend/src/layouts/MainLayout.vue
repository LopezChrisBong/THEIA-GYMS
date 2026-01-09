<template>
  <v-app class="">
    <!-- <div class="d-flex" style="height: 100dvh"> -->
    <!-- <div style="width: 100%; height: 100dvh" class="d-flex"> -->
    <!-- <div style="width: 100%; height: 100dvh"> -->
    <Navbar3
      v-if="$store.getters.getIsAuthenticated"
      :reloadImg="reloadImg"
      :screenSmall="mini"
      v-on:closeNav="mini = false"
      :isOIC="is_oic"
    />
    <!-- <v-main style="background-color: #147452">
      <div
        v-if="alert"
        class="alert px-4 d-flex justify-space-between align-center white--text"
      >
        <div class="d-flex">
          <v-icon left color="white"> mdi-alert-circle-outline </v-icon>
          <p class="text-subtitle-2 pt-4">
            You are allowed to update your Personal Data Sheet (PDS) from
            {{ formatDate(date_from) }} until {{ formatDate(date_to) }} only.
          </p>
        </div>

        <v-icon
          @click="alert = false"
          style="cursor: pointer"
          right
          color="white"
        >
          mdi-close-circle-outline
        </v-icon>
      </div>
      <div
        v-if="oic_alert"
        class="alert px-4 d-flex justify-space-between align-center white--text"
      >
        <div class="d-flex">
          <v-icon left color="white"> mdi-alert-circle-outline </v-icon>
          <p class="text-subtitle-2 pt-4">
            You are appointed as Officer-in-Charge (OIC) by {{ oic_by }} from
            {{ formatDate(oic_date_from) }} until
            {{ formatDate(oic_date_to) }} only.
          </p>
        </div>

        <v-icon
          @click="oic_alert = false"
          style="cursor: pointer"
          right
          color="white"
        >
          mdi-close-circle-outline
        </v-icon>
      </div>

      <div
        v-if="hasMonitization"
        class="alert px-4 d-flex justify-space-between align-center white--text"
      >
        <div class="d-flex">
          <v-icon left color="white"> mdi-alert-circle-outline </v-icon>
          <p class="text-subtitle-2 pt-4">
            Call for Monetization of Leave Credits from
            {{ mc_date_from }} until {{ mc_date_to }} only.
          </p>
        </div>

        <v-icon
          @click="hasMonitization = false"
          style="cursor: pointer"
          right
          color="white"
        >
          mdi-close-circle-outline
        </v-icon>
      </div>
      <div class="mx-2 fill-height pb-6" style="background-color: white">
        <div class="d-flex justify-space-between pt-4 px-4">
          <strong class="text-gray-100">{{ $route.meta.title }}</strong>
          <div>
            <v-select
              label="Year"
              color="#519043"
              @change="changeFilter()"
              outlined
              v-model="selectedFiter"
              dense
              :items="filterYears"
            ></v-select>
          </div>
        </div>
        <router-view v-on:reloadProfile="loadImg" />
      </div>
    </v-main> -->
  </v-app>
</template>

<script>
import Navbar3 from "../components/Navbar/Navbar3.vue";
export default {
  name: "App",
  components: {
    Navbar3,
  },
  data: () => ({
    mini: false,
    filterYears: [],
    selectedFiter: null,
    // profImg: null,
    date_from: null,
    date_to: null,
    reloadImg: null,
  }),
  mounted() {
    this.loadYearForFilter();
    if (this.$store.getters.isExpired) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.$router.push("/");
    }
  },
  methods: {
    loadImg() {
      setTimeout(() => {
        this.reloadImg = false;
      }, 100);
      this.reloadImg = true;
    },
    loadYearForFilter() {
      let d = new Date();
      let cur = d.getFullYear();
      this.selectedFiter = cur;
      this.$store.commit("setFilterSelected", cur);
      let yearLimit = 2020;
      for (let i = cur; i >= yearLimit; i--) {
        this.filterYears.push(i);
      }
      this.filterYears.push("All");
    },

    changeFilter() {
      this.$store.commit("setFilterSelected", this.selectedFiter);
    },
  },
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
}
/* .main_div {
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
} */
#rem {
  flex-grow: 1;
  background-color: red;
}
.alert {
  position: fixed;
  z-index: 10;
  width: 70%;
  left: 50%;
  transform: translate(-40%, -50%);
  border-radius: 5px;
  padding: 5px;
  background-color: #ff7043;
}
</style>
