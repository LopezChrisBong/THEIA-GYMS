<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <!-- <v-col align="center" cols="12" md="6">
          <div class="left-panel">
            <v-img class="lp-img" src="../../assets/img/dnsc-logo2-1.png" width="400px"></v-img>
            <br />
            <div class="title">
              DNSC - HRMIS
              <div class="underline">
                <div class="u1"></div>
                <div class="u2"></div>
              </div>
            </div>
            <br />
            <v-img class="lp-img" src="../../assets/img/lmis-logo.png" width="300px"></v-img>
          </div>
        </v-col> -->
        <v-col align="center" cols="12" md="6" v-if="!isValidated">
          <v-card max-width="500" class="rounded-card">
            <v-card-title class="justify-center pa-4">
              <h2>Email Confirmation</h2>
              <p class="text-subtitle-1">
                Please enter your OTP (One-Time Passcode) below.
              </p>
            </v-card-title>
            <v-form ref="Formref">
              <v-row class="mx-5 pt-2">
                <v-col cols="12">
                  <!-- <OtpInput /> -->
                  <div id="otp">
                    <input type="text" id="first" maxlength="1" />
                    <input type="text" id="second" maxlength="1" />
                    <input type="text" id="third" maxlength="1" />
                    <input type="text" id="fourth" maxlength="1" />
                    <input type="text" id="fifth" maxlength="1" />
                    <input type="text" id="sixth" maxlength="1" />
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center">
                    <v-btn
                      depressed
                      color="teal darken-2"
                      class="white--text py-2 font-size-14"
                      :loading="isLoading"
                      @click="handleSubmit()"
                      >Confirm</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
        <v-col align="center" cols="12" md="6" v-if="isValidated">
          <v-card max-width="500" class="rounded-card">
            <v-card-title class="justify-center pa-4">
              <h2>Email confirmation completed!</h2>
              <p class="text-subtitle-1">You may now login to the system.</p>
            </v-card-title>
            <v-col cols="12">
              <div class="d-flex justify-center">
                <v-btn
                  depressed
                  color="teal darken-2"
                  class="white--text py-2 font-size-14"
                  :loading="isLoading"
                  @click="loginRedirect()"
                  >Confirm</v-btn
                >
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    ></fade-away-message-component>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {
    // OtpInput: () => import("../../components/Utils/OtpInput.vue"),
  },
  data: () => ({
    isLoading: false,
    email: "",
    password: "",
    otp: null,
    show1: false,
    isValidated: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "System Message!",
      message: "",
      top: 10,
    },
  }),
  mounted() {
    console.log(this.$store.getters.getEmail);
    this.OTPInput();
    // if (this.$store.state.user) {
    //   if (!this.$store.state.user.roleID) {
    //     this.deleteToken();
    //     setTimeout(function () {
    //       location.reload();
    //     }, 5000);
    //   }
    // }
  },
  beforeUnmount() {
    document.getElementById("first").value = "";
    document.getElementById("second").value = "";
    document.getElementById("third").value = "";
    document.getElementById("fourth").value = "";
    document.getElementById("fifth").value = "";
    document.getElementById("sixth").value = "";
  },

  methods: {
    // dologin() {
    //   if (this.$refs.Formref.validate()) {
    //     this.isLoading = true;
    //     let data = new FormData();
    //     data.append("email", this.email);
    //     data.append("password", this.password);
    //     this.axiosCall("/login", "POST", data).then((res) => {
    //       this.isLoading = false;
    //       if (res.data.status) {
    //         localStorage.setItem("token", res.data.data.data.user.token);
    //         location.reload();
    //       } else {
    //         if (res.data.message === "otp") {
    //           this.$router.replace({ path: "/register/" + this.email });
    //         } else {
    //           this.fadeAwayMessage.show = true;
    //           this.fadeAwayMessage.type = "error";
    //           this.fadeAwayMessage.message = res.data.message;
    //           this.fadeAwayMessage.header = "System Message";
    //         }
    //       }
    //     });
    //   }
    // },
    OTPInput() {
      const inputs = document.querySelectorAll("#otp > *[id]");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("keydown", function (event) {
          if (event.key === "Backspace") {
            inputs[i].value = "";
            if (i !== 0) inputs[i - 1].focus();
          } else {
            if (i === inputs.length - 1 && inputs[i].value !== "") {
              return true;
            } else if (event.keyCode > 47 && event.keyCode < 58) {
              inputs[i].value = event.key;
              if (i !== inputs.length - 1) inputs[i + 1].focus();
              event.preventDefault();
            } else if (event.keyCode > 64 && event.keyCode < 91) {
              inputs[i].value = String.fromCharCode(event.keyCode);
              if (i !== inputs.length - 1) inputs[i + 1].focus();
              event.preventDefault();
            }
          }
        });
      }
    },

    loginRedirect() {
      this.$router.push("/login");
    },
    handleSubmit() {
      this.isLoading = true;
      const first = document.getElementById("first").value;
      const second = document.getElementById("second").value;
      const third = document.getElementById("third").value;
      const fourth = document.getElementById("fourth").value;
      const fifth = document.getElementById("fifth").value;
      const sixth = document.getElementById("sixth").value;

      this.otp =
        first +
        "" +
        second +
        "" +
        third +
        "" +
        fourth +
        "" +
        fifth +
        "" +
        sixth;

      let data = {
        email: this.$store.getters.getEmail,
        otp: this.otp,
      };
      this.axiosCall("/auth/confirmOtp", "POST", data).then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          this.isLoading = false;
          this.$store.dispatch("setEmail", null);
          this.isValidated = true;
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "success";
          this.fadeAwayMessage.message =
            "You are now registered, please wait for the admin confirmation. Thank you.";
          this.fadeAwayMessage.header = "System Message";
          this.$router.push("/login");
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message = res.data.msg;
          this.fadeAwayMessage.header = "System Message";
        }
      });
    },
  },
};
</script>

<style scoped>
#first,
#second,
#third,
#fourth,
#fifth,
#sixth {
  border: 2px solid black;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-right: 2px;
  margin-left: 2px;
  font-size: 28px;
  text-align: center;
}

.content {
  background: #00523f;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 100px;
  overflow-y: auto;
}
.title {
  color: #fff;
  font-size: 35px !important;
  position: relative;
  font-weight: bold;
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 40%;
  height: 5px;
  margin: 0 5px;
}
.title .underline .u2 {
  background: #fff;
  width: 5%;
  height: 5px;
  margin: 0 5px;
}
.lp-img {
  -webkit-filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
  filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.09));
}
.rounded-card {
  border-radius: 10px;
}
</style>