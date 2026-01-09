<!-- <template>
  <v-app>
    <v-fade-transition mode="out-in">
      <template v-if="!isUnderMaintenance">
        <router-view v-if="$store.state.user || render" />
        <loading-screen v-else />
      </template>

      <UnderMaintainance v-else />
    </v-fade-transition>
  </v-app>
</template> -->
<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </router-view>
  </v-app>
</template>

<script>
import { VFadeTransition } from "vuetify/components";

export default {
  name: "AppPage",

  components: {
    VFadeTransition,
    "loading-screen": () => import("./components/Utils/LoadingScreen.vue"),
    UnderMaintainance: () => import("./views/Pages/UnderMaintainance.vue"),
  },

  data() {
    return {
      render: false,
      isUnderMaintenance: false,
    };
  },

  created() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const email = params.get("email");
    const password = params.get("pass");

    this.render = true;

    if (token) {
      localStorage.setItem("token", token);
      this.$store.commit("setExpiryDate");
      location.replace("/");
    } else if (email && password) {
      this.logout?.();

      localStorage.clear();
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setEmail", null);
      this.$store.dispatch("setEmp", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.$store.state.expiryDate = null;
    } else {
      this.getUser();
    }
  },

  methods: {
    // getUser() {
    //   if (!localStorage.getItem("token")) {
    //     this.render = true;
    //     return;
    //   }
    //   this.axiosCall("/auth/current_user", "GET")
    //     .then((res) => {
    //       if (res.data.statusCode !== 401) {
    //         const data = res.data.userdetail;
    //         this.$store.dispatch("setUser", data);
    //         this.$store.dispatch("setIsAuthenticated", 1);
    //       } else {
    //         localStorage.clear();
    //         location.reload();
    //       }
    //     })
    //     .catch(() => {
    //       this.render = true;
    //     });
    // },
    getUser() {
      if (!localStorage.getItem("token")) {
        this.render = true;
        return;
      }

      this.axiosCall("/auth/current_user", "GET")
        .then((res) => {
          if (res.data.statusCode !== 401) {
            this.$store.dispatch("setUser", res.data.userdetail);
            this.$store.dispatch("setIsAuthenticated", 1);
          } else {
            this.logout();
          }
        })
        .finally(() => {
          this.render = true;
        });
    },
  },
};
</script>

<style>
/* SCROLL BAR CUSTOMIZE*/
/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgb(206, 196, 196);
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #9da19c;
  border-radius: 5px;
}
</style>
