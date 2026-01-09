<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="500" class="rounded-card" align="start">
            <v-form ref="Formref" @submit.prevent>
              <v-row class="mx-5 pt-12">
                <v-col cols="12" class="pa-0 px-4 mb-2">
                  <div class="text-h6" align="center">
                    <strong>Forgot Password |</strong> Password Reset
                  </div>
                  <v-divider class="mt-2 mb-2"></v-divider>
                </v-col>
                <v-col
                  v-if="showEmail == true"
                  cols="12"
                  class="pa-0 px-4 mt-3"
                >
                  <v-text-field
                    color="#6DB249"
                    class="font-size-14 rounded-lg"
                    v-model="email"
                    :rules="
                      showEmail == true
                        ? [formRules.required, formRules.email]
                        : []
                    "
                    label="Email address"
                    dense
                    required
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" v-show="showOTP == true">
                  <v-row class="mx-5">
                    <v-col cols="12" class="pa-0 px-4 mb-2">
                      <p class="text-body-2 text-center">
                        Please enter the OTP that was sent to your email address
                        to continue resetting your acount.
                      </p>
                    </v-col>
                    <v-col cols="12" class="mb-4">
                      <p class="text-caption text-gray-100 text-center">
                        Please enter your One Time Pin
                      </p>
                      <!-- <div style="max-width: 300px;position: relative;">
                        <v-otp-input length="6" type="number"></v-otp-input>
                      </div> -->

                      <div id="otp" class="otp-div">
                        <input type="text" id="first" maxlength="1" />
                        <input type="text" id="second" maxlength="1" />
                        <input type="text" id="third" maxlength="1" />
                        <input type="text" id="fourth" maxlength="1" />
                        <input type="text" id="fifth" maxlength="1" />
                        <input type="text" id="sixth" maxlength="1" />
                      </div>
                    </v-col>
                    <v-col cols="12" class="pa-0 px-4">
                      <v-btn
                        :loading="isLoading"
                        @click="submitOTP()"
                        block
                        depressed
                        :color="$vuetify.theme.themes.light.submitBtns"
                        class="white--text py-5 font-size-14 rounded-lg"
                        >CONFIRM</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-col>

                <v-col v-if="showPass == true" cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    color="#6DB249"
                    class="font-size-14 rounded-lg"
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="
                      showPass == true
                        ? [formRules.required, formRules.password]
                        : []
                    "
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="New Password"
                    dense
                    outlined
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col v-if="showPass == true" cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    color="#6DB249"
                    class="font-size-14 rounded-lg"
                    v-model="confirm_pass"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formRules.required]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    dense
                    outlined
                    @click:append="show2 = !show2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-5">
                  <div class="d-flex justify-center" v-if="showEmail == true">
                    <v-btn
                      block
                      depressed
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text py-2 font-size-15 rounded-lg"
                      :loading="isLoading"
                      @click="checkEmail()"
                      >Check Email</v-btn
                    >
                  </div>

                  <!-- <div class="d-flex justify-center" v-if="showOTP == true">
                    <v-btn
                      block
                      depressed
                      color="#123E4D"
                      class="white--text py-2 font-size-15 rounded-lg"
                      :loading="isLoading"
                      @click="checkOTP()"
                      >Verify OTP</v-btn
                    >
                  </div> -->

                  <div class="d-flex justify-center" v-if="showPass == true">
                    <v-btn
                      block
                      depressed
                      :color="$vuetify.theme.themes.light.submitBtns"
                      class="white--text py-2 font-size-15 rounded-lg"
                      :loading="isLoading"
                      @click="changePass()"
                      >Reset Password</v-btn
                    >
                  </div>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mb-5">
                  <div class="d-flex justify-center pb-3 font-size-14">
                    Already have an account?
                    <router-link class="pl-2" to="/login"> Sign In</router-link>
                  </div>
                </v-col>
              </v-row>
            </v-form>
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
  mounted() {
    this.OTPInputs();

    if (this.$store.state.email) {
      this.showEmail = false;
      this.showPass = false;
      this.showOTP = true;
    }
  },

  beforeUnmount() {
    document.getElementById("first").value = "";
    document.getElementById("second").value = "";
    document.getElementById("third").value = "";
    document.getElementById("fourth").value = "";
    document.getElementById("fifth").value = "";
    document.getElementById("sixth").value = "";
  },
  data: () => ({
    isLoading: false,
    user_id: "",
    email: "",
    password: "",
    confirm_pass: "",
    otp: "",
    showEmail: true,
    showOTP: false,
    showPass: false,
    show1: false,
    show2: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
  methods: {
    OTPInputs() {
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
    submitOTP() {
      const first = document.getElementById("first").value;
      const second = document.getElementById("second").value;
      const third = document.getElementById("third").value;
      const fourth = document.getElementById("fourth").value;
      const fifth = document.getElementById("fifth").value;
      const sixth = document.getElementById("sixth").value;

      let otp =
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
        email: this.$store.state.email,
        otp: otp,
      };
      if (first && second && third && fourth && fifth && sixth) {
        this.isLoading = true;

        console.log(data);
        this.axiosCall("/auth/compareOTP", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.isLoading = false;
            this.showEmail = false;
            this.showPass = true;
            this.showOTP = false;
            // this.$router.push("/registration-success");
          } else {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
          }
        });
      } else {
        this.isLoading = false;
        this.fadeAwayMessage.show = true;
        this.fadeAwayMessage.type = "error";
        this.fadeAwayMessage.message = "Please fill all the fields.";
        this.fadeAwayMessage.header = "System Message";
      }
    },
    checkEmail() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        this.axiosCall("/auth/sendOTP/" + this.email, "GET").then((res) => {
          if (res.data.status == 200) {
            this.$store.dispatch("setEmail", this.email);
            this.isLoading = false;
            this.showEmail = false;
            this.showPass = false;
            this.showOTP = true;
            this.email = res.data.user;
          } else if (res.data.status == 400) {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
          } else if (res.data.status == 404) {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.msg;
            this.fadeAwayMessage.header = "System Message";
          }
        });
      }
    },
    // checkOTP() {
    //   let formData = { email: this.email, otp: this.otp };
    //   this.axiosCall("/auth/compareOTP", "POST", formData).then((res) => {
    //     if (res.data.status == 200) {
    //       this.isLoading = false;
    //       this.showEmail = false;
    //       this.showPass = true;
    //       this.showOTP = false;
    //       this.email = res.data.user;
    //     } else {
    //       this.isLoading = false;
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.message = "OTP not match";
    //       this.fadeAwayMessage.header = "System Message";
    //     }
    //   });
    // },
    changePass() {
      if (this.$refs.Formref.validate()) {
        this.isLoading = true;
        if (
          this.password &&
          this.confirm_pass &&
          this.password == this.confirm_pass
        ) {
          let formData = {
            email: this.$store.state.email,
            password: this.password,
          };
          this.axiosCall("/auth/resetPassword", "POST", formData).then(
            (res) => {
              if (res.data.status == 200) {
                this.$store.dispatch("setEmail", null);
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "success";
                this.fadeAwayMessage.message = "Password changed successfully";
                this.fadeAwayMessage.header = "System Message";
                this.isLoading = false;
                setTimeout(() => {
                  this.$router.push({ path: "/login" });
                }, 2000);
              } else {
                this.fadeAwayMessage.show = true;
                this.fadeAwayMessage.type = "error";
                this.fadeAwayMessage.message = "Error changing password";
                this.fadeAwayMessage.header = "System Message";
              }
            }
          );
        } else {
          this.fadeAwayMessage.show = true;
          this.fadeAwayMessage.type = "error";
          this.fadeAwayMessage.message = "Password not match";
          this.fadeAwayMessage.header = "System Message";
        }
      }
    },
    handleOnComplete(value) {
      this.otp = value;
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
  },
};
</script>

<style scoped>
.otp-div {
  display: flex;
  justify-content: center;
}
.content {
  background-color: #d6a89c;
  /* background: url("../../assets/img/new_bg.png"); */
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
}
.title {
  color: #fff;
  font-size: 35px !important;
  position: relative;
  font-weight: bold;
  line-height: 40px;
}
.title .underline {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.title .underline .u1 {
  background: #fff;
  width: 70%;
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
  border-radius: 50%;
  background: #fff;
}
.rounded-card {
  border-radius: 10px;
}
/* OTP */
#first,
#second,
#third,
#fourth,
#fifth,
#sixth {
  border: 2px solid;
  border-color: #6db249;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 2px;
  margin-left: 2px;
  font-size: 28px;
  text-align: center;
}
</style>
