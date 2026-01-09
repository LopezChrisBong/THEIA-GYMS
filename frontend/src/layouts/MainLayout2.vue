<template>
  <v-app class="" style="background-color: #519043">
    <div class="d-flex">
      <div>
        <Navbar3 />
      </div>
      <div style="width: 100%" class="pa-0">
        <v-main>
          <div class="white mr-2 rounded-t-lg h-screen">
            <v-app-bar
              elevation="4"
              elevate-on-scroll
              color="white rounded-t-lg"
              class="mt-2 mb-2"
              height="50"
            >
              <!-- <v-btn icon>
                <v-icon class="text-green-6DB249" @click="closeNav()"
                  >mdi-menu-open</v-icon
                >
              </v-btn> -->
              <div class="pt-4">
                <h4 class="text-gray-100">
                  Welcome {{ $store.state.user.fname }}!
                </h4>
                <p class="text-caption text-gray-200">{{ getCurrentDate() }}</p>
              </div>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon class="text-green-6DB249">mdi-bell</v-icon>
              </v-btn>

              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-on="on"
                    color="white"
                    class="rounded-lg d-flex py-2"
                  >
                    <v-avatar left size="100"
                      ><img :src="profImg" max-width="60" />
                      <!-- <img
                        src="../assets/img/img_avatar.png"
                        max-width="60"
                        v-if="$store.state.user.profile_img == null"
                      /> -->
                    </v-avatar>
                    <span style="width: 130px; text-align: center"
                      ><strong
                        >{{ $store.state.user.fname }}
                        {{
                          $store.state.user.lname.charAt(0).toUpperCase()
                        }}.</strong
                      ><br />{{ $store.state.user.usertype.description }}</span
                    >
                    <v-icon right> mdi-chevron-down </v-icon>
                  </v-chip>
                </template>
                <v-card width="240">
                  <v-list color="#6DB249">
                    <v-list-item>
                      <v-list-item-avatar
                        ><img :src="profImg" max-width="60" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="white--text"
                          >{{ $store.state.user.fname }}
                          {{
                            $store.state.user.lname.charAt(0).toUpperCase()
                          }}.</v-list-item-title
                        >
                        <v-list-item-subtitle class="white--text">{{
                          $store.state.user.usertype.description
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon @click="menu = false">
                          <v-icon class="white--text">mdi-close-circle</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-list>
                    <v-list-item @click="toProfile()">
                      <v-list-item-action>
                        <v-icon>mdi-cog-outline</v-icon>
                      </v-list-item-action>
                      <v-list-item-subtitle
                        ><strong>Profile</strong></v-list-item-subtitle
                      >
                    </v-list-item>
                    <v-list-item @click="logout()">
                      <v-list-item-action>
                        <v-icon>mdi-logout</v-icon>
                      </v-list-item-action>
                      <v-list-item-subtitle
                        ><strong>Sign Out </strong></v-list-item-subtitle
                      >
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-app-bar>
            <v-alert
              v-model="alert"
              type="warning"
              icon="mdi-alert-circle-outline"
              dense
              dismissible
              close-label="Close Alert"
            >
              <p class="text-subtitle-2">
                You are allowed to update your Personal Data Sheet (PDS) from
                {{ formatDate(date_from) }} until
                {{ formatDate(date_to) }} only.
              </p>
            </v-alert>

            <router-view v-on:reloadProfile="loadImg" />
          </div>
          <!-- </v-col>
      </v-row> -->

          <!-- </v-col>
      </v-row> -->
        </v-main>
      </div>
    </div>
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
    alert: true,
    profImg: null,
    date_from: null,
    date_to: null,
  }),
  mounted() {
    this.getInPDSUpdateActive();
    this.loadImg();
    //   this.onResize();
    //   window.addEventListener("resize", this.onResize, { passive: true });
    //   if (!this.$vuetify.breakpoint.mdAndUp) {
    //     this.mini = true;
    //   }
  },
  methods: {
    loadImg() {
      this.axiosCall("/user-details/getUserProfileImg", "GET").then((res) => {
        this.profImg =
          process.env.VUE_APP_SERVER +
          "/user-details/getProfileImg/" +
          res.data.profile_img;
      });
    },
    // onResize() {
    //   if (window.innerWidth < 900) {
    //     this.mini = true;
    //   }
    // },
    getInPDSUpdateActive() {
      this.axiosCall("/allow-pds-update/isPDSUpdateActive", "GET").then(
        (res) => {
          if (res.data) {
            this.alert = true;
            this.date_from = res.data.date_from;
            this.date_to = res.data.date_to;
          } else {
            this.alert = false;
          }
        }
      );
    },
    toProfile() {
      var usertype = this.$store.state.user.usertype.description;

      this.$router.push("/" + usertype.toLowerCase() + "/profile");
    },
    getCurrentDate() {
      const cur_date = new Date();
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return (
        day[cur_date.getDay()] +
        ", " +
        month[cur_date.getMonth()] +
        " " +
        cur_date.getDate() +
        "; " +
        this.formatAMPM(cur_date)
      );
    },
    formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
  },
};
</script>

<style scoped>
.main_div {
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
}
.div_col {
  height: 92%;
}
</style>
