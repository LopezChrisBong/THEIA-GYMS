<template>
  <v-container fluid class="login-bg d-flex align-center justify-center">
    <v-card max-width="620" class="login-card pa-6" elevation="10">
      <v-form ref="Formref" style="width: 300px">
        <!-- LOGO -->
        <div class="text-center mb-4">
          <v-avatar size="120" class="mb-2">
            <v-img src="/img/img_avatar.png" />
          </v-avatar>

          <h3 class="font-weight-medium mb-1">
            Welcome to
            <span class="brand-text">THEIA GEMS</span>
          </h3>

          <p class="text-medium-emphasis text-caption">Sign in to continue</p>
        </div>

        <!-- EMAIL -->
        <v-text-field
          v-model="email"
          label="Email address"
          prepend-inner-icon="mdi-email-outline"
          :rules="[formRules.required, formRules.email]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          class="mb-3"
          @keyup.enter="dologin()"
        />

        <!-- PASSWORD -->
        <v-text-field
          v-model="password"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          :rules="[formRules.required]"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          @click:append-inner="show1 = !show1"
          @keyup.enter="dologin()"
        />

        <!-- ACTION -->
        <v-btn
          block
          size="large"
          class="login-btn mt-4"
          :loading="isLoading"
          @click="dologin()"
        >
          Sign In
        </v-btn>

        <!-- OPTIONAL LINKS -->
        <!-- <div class="text-center mt-4 text-caption">
          <span class="link" @click="doForgotPassword()">
            Forgot password?
          </span>
        </div> -->
      </v-form>
    </v-card>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </v-container>
</template>

<script>
export default {
  name: "loginPage",

  watch: {
    "$store.state.user": {
      immediate: true,
      handler(user) {
        if (!user || !user.user) return;

        const userType = user.user.usertypeID;
        const roleID = user.user.user_roleID;

        if (userType == 1) {
          this.$router.replace("/admin/dashboard");
        } else if (roleID == 5) {
          this.$router.replace("/superadmin/dashboard");
        } else {
          this.$router.replace("/employee/dashboard");
        }
      },
    },
  },
  mounted() {
    // if (this.$store.state.user) {
    //   if (!this.$store.state.user.usertype.id) {
    //     setTimeout(function () {
    //       location.reload();
    //     }, 0);
    //   } else {
    //     const userType = this.$store.state.user.user.usertypeID;
    //     const roleID = this.$store.state.user.user.user_roleID;
    //     if (userType == 1) {
    //       this.$router.replace("/admin/dashboard");
    //     } else if (roleID == 5) {
    //       this.$router.replace("/superadmin/dashboard");
    //     } else {
    //       this.$router.replace("/employee/dashboard");
    //     }
    //   }
    // }
  },
  methods: {
    // dologin() {
    //   if (this.$refs.Formref.validate()) {
    //     this.isLoading = true;
    //     let data = {
    //       email: this.email,
    //       password: this.password,
    //     };
    //     this.axiosCall("/auth/login", "POST", data).then((res) => {
    //       this.isLoading = false;
    //       if (
    //         res.data.status == 200 ||
    //         res.data.status == 201 ||
    //         res.data.status == 202
    //       ) {
    //         localStorage.setItem("token", res.data.token);
    //         this.$store.dispatch("setIsAuthenticated", 1);
    //         this.$store.commit("setExpiryDate");
    //         location.replace("/");
    //       } else {
    //         this.fadeAwayMessage.show = true;
    //         this.fadeAwayMessage.type = "error";
    //         this.fadeAwayMessage.message = res.data.message;
    //         this.fadeAwayMessage.header = "System Message";
    //       }
    //     });
    //   }
    // },

    // async dologin() {
    //   if (!this.$refs.Formref.validate()) return;

    //   this.isLoading = true;
    //   const data = {
    //     email: this.email,
    //     password: this.password,
    //   };
    //   try {
    //     const res = await this.axiosCall("/auth/login", "POST", data);
    //     this.isLoading = false;

    //     if ([200, 201, 202].includes(res.data.status)) {
    //       localStorage.setItem("token", res.data.token);
    //       this.$store.dispatch("setIsAuthenticated", 1);
    //       this.$store.commit("setExpiryDate");
    //       location.replace("/");
    //       // Redirect using Vue Router

    //       // const roleID = this.$store.state.user.user.user_roleID;
    //       // if (userType == 1) {
    //       //   this.$router.replace("/admin/dashboard");
    //       // } else if (roleID == 5) {
    //       //   this.$router.replace("/superadmin/dashboard");
    //       // } else {
    //       //   this.$router.replace("/employee/dashboard");
    //       // }
    //     } else {
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.message = res.data.message;
    //       this.fadeAwayMessage.header = "System Message";
    //     }
    //   } catch (error) {
    //     this.isLoading = false;
    //     this.fadeAwayMessage.show = true;
    //     this.fadeAwayMessage.type = "error";
    //     this.fadeAwayMessage.message = error;
    //     this.fadeAwayMessage.header = "System Message";
    //   }
    // },

    async dologin() {
      if (!this.$refs.Formref.validate()) return;

      this.isLoading = true;

      try {
        const res = await this.axiosCall("/auth/login", "POST", {
          email: this.email,
          password: this.password,
        });

        this.isLoading = false;

        if ([200, 201, 202].includes(res.data.status)) {
          localStorage.setItem("token", res.data.token);
          this.$store.dispatch("setIsAuthenticated", 1);
          this.$store.commit("setExpiryDate");
          location.replace("/");
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message = res.data.message;
          this.fadeAwayMessage.header = "System Message";
        }
      } catch (err) {
        this.isLoading = false;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message = err;
        this.fadeAwayMessage.header = "System Message";
      }
    },
    getUser() {
      if (!localStorage.getItem("token")) {
        this.render = true;
        return;
      }
      this.axiosCall("/auth/current_user", "GET")
        .then((res) => {
          if (res.data.statusCode !== 401) {
            const data = res.data.userdetail;
            this.$store.dispatch("setUser", data);
            this.$store.dispatch("setIsAuthenticated", 1);
          } else {
            localStorage.clear();
            location.reload();
          }
        })
        .catch(() => {
          this.render = true;
        });
    },
    doRegister() {
      this.$router.push("/register");
    },
    doForgotPassword() {
      this.$router.push("/forgot-pw");
    },
  },
  data: () => ({
    isLoading: false,
    email: "",
    password: "",
    show1: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
};
</script>

<style scoped>
/* BACKGROUND */
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #d6a89c, #c89b8c);
}

/* CARD */
.login-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

/* BRAND */
.brand-text {
  color: #8e6e25;
  font-family: "Times New Roman", serif;
}

/* BUTTON */
.login-btn {
  background: linear-gradient(135deg, #8e6e25, #c89b8c);
  color: white;
  font-weight: 500;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* LINKS */
.link {
  color: #8e6e25;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}
</style>
