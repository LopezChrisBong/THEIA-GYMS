<template>
  <v-navigation-drawer
    style="background-color: #519043"
    app
    :hide-overlay="true"
    class="nav-drawer"
    v-model="drawer"
    ><nav>
      <v-list class="mb-1">
        <div class="w-full d-flex justify-end pr-2" v-if="mini">
          <v-btn icon @click="hideNav()">
            <v-icon class="d-flex justify-end"> mdi-backburger </v-icon>
          </v-btn>
        </div>

        <v-list-item class="">
          <div class="d-flex w-full mt-6 mb-5 mx-4">
            <div class="w-50">
              <v-img src="/img/DNSC_LOGO.png" max-width="60"></v-img>
            </div>
            <div
              class="d-flex align-center mx-4 font-weight-bold w-50 white--text"
            >
              DNSC-HRMIS
            </div>
          </div>
        </v-list-item>
      </v-list>
      <!-- <v-list nav dense class="sidebar">
        <div v-for="(link, i) in links" :key="i">
          <v-list-item
            v-if="!link.subLinks"
            :key="link.title"
            router
            :to="'/' + userType + link.route"
            color="#808191"
            class="mx-3 my-1"
          >
            <v-list-item-icon>
              <v-icon class="navIcon">{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="">{{ link.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group v-else :key="link.title" no-action :value="false">
            <v-icon slot="prependIcon" color="">{{ link.icon }}</v-icon>
            <template v-slot:activator>
              <v-list-item-title class="">{{ link.title }}</v-list-item-title>
            </template>
            <div class="sub-item mx-3">
              <v-list-item
                v-for="sublink in link.subLinks"
                router
                :to="'/' + userType + sublink.route"
                :key="sublink.title"
                color="#808191"
              >
                <v-list-item-icon>
                  <v-icon class="">{{ sublink.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="">{{
                  sublink.title
                }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list-group>
        </div>
      </v-list> -->
      <!-- <div class="mx-2">
        <v-expansion-panels id="samp" accordion>
          <v-expansion-panel v-for="(link, i) in links" :key="i">
            <v-expansion-panel-header>{{
              link.title
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              Some content {{ i }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div> -->
    </nav>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: "NavbarPage",
  components: {},
  props: ["toggleNav"],
  watch: {
    toggleNav: {
      handler(data) {
        this.drawer = data;
      },
      deep: true,
    },
  },
  data: () => ({
    drawer: true,
    menu: true,
    userType: "",
    links: [],
    admin_links: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard-outline",
        route: "/dashboard",
      },
      {
        title: "Employees",
        icon: "mdi-account-tie",

        subLinks: [
          {
            title: "PDS",
            icon: "mdi-briefcase-variant-outline",
            route: "/employee-pds",
          },
          {
            title: "Details",
            icon: "mdi-briefcase-variant-outline",
            route: "/employee-details",
          },
        ],
      },

      {
        title: "Utilities",
        icon: "mdi-cog-outline",
        subLinks: [
          {
            title: "Type of Users",
            icon: "mdi-account-tie",
            route: "/user-type",
          },
          {
            title: "Employee Type",
            icon: "mdi-account-tie",
            route: "/employee-type",
          },
          {
            title: "Allow PDS Update",
            icon: "mdi-calendar",
            route: "/allow-update",
          },
          {
            title: "Offices",
            icon: "mdi-calendar",
            route: "/offices",
          },
        ],
      },
      {
        title: "My Profile",
        icon: "mdi-account-circle-outline",
        route: "/profile",
      },
      {
        title: "Settings",
        icon: "mdi-cog-outline",
        subLinks: [
          {
            title: "Modules",
            icon: "mdi-account-group-outline",
            route: "/modules",
          },
          {
            title: "User Modules",
            icon: "mdi-briefcase-variant-outline",
            route: "/user-modules",
          },
          {
            title: "User Type Modules",
            icon: "mdi-briefcase-variant-outline",
            route: "/user-type-modules",
          },
        ],
      },
    ],
    employee_links: [
      {
        title: "Dashboard",
        icon: "mdi-view-dashboard-outline",
        route: "/dashboard",
      },
      {
        title: "My PDS",
        icon: "mdi-calendar-multiselect-outline",
        route: "/my-pds",
      },
      {
        title: "My Leave",
        icon: "mdi-calendar-badge-outline",
        route: "/dashboard",
      },

      {
        title: "Settings",
        icon: "mdi-cog-outline",
        subLinks: [
          {
            title: "My Profile",
            icon: "mdi-account-circle-outline",
            route: "/profile",
          },
          {
            title: "My Credentials",
            icon: "mdi-briefcase-variant-outline",
            route: "/dashboard",
          },
        ],
      },
    ],

    mini: false,
  }),
  beforeDestroy() {
    if (typeof window === "undefined") return;

    window.removeEventListener("resize", this.onResize, { passive: true });
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
    if (!this.$vuetify.breakpoint.mdAndUp) {
      this.hideNav();
      this.mini = false;
      this.drawer = false;
    }
  },
  methods: {
    onResize() {
      this.mini = window.innerWidth < 700;
      if (window.innerWidth < 700 && !this.drawer) {
        this.drawer = false;
        this.mini = true;
      }
    },
    displayNav() {
      this.drawer = !this.drawer;
    },
    hideNav() {
      // this.drawer = false;
      console.log("clicked");
      this.displayNav();
      this.$emit("hideNav");
    },
    getModules(usertypeID) {
      this.axiosCall("/usertype-module/usertype/" + usertypeID, "GET").then(
        (res) => {
          if (res) {
            // this.modules = res.data;
            console.log(res.data);
          }
        }
      );
    },
    loadMenu(userType) {
      // this.getModules(userType);
      switch (userType) {
        case 1:
          this.userType = "admin";
          this.links = this.admin_links;
          break;
        case 2:
          this.userType = "employee";
          this.links = this.employee_links;
          break;
      }
    },
  },
  created: function () {
    let userType = this.$store.state.user.user.usertypeID;
    this.loadMenu(userType);
  },
};
</script>
<style scoped>
#samp {
  background-color: rgba(255, 0, 0, 1) !important;
}

.sidebar .v-list-item {
  border-radius: 5px;
  margin-left: 10px;
  color: white;
}

.sidebar .v-list-item:hover {
  /* background-color: rgba(255, 247, 247, 0.949);
  color: black; */
  border-radius: 10px;
  transition: 0.5s;
}

.sidebar .v-list-item--active {
  background-color: white !important;
  /* color: black !important; */
}

.nav-drawer .item-title {
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
}
.v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 0 8;
}
.sub-item {
  border-radius: 5px;
  background: #519043;
}
</style>
