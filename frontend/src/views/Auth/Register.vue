<template>
  <div>
    <v-container fluid fill-height class="content">
      <v-row align="center" justify="center">
        <v-col align="center" cols="12" md="6">
          <v-card max-width="400" class="rounded-card">
            <div class="justify-center pa-4">
              <h3 style="color: #519043">
                Create your <span style="color: #ffb400">Account</span>
                <span class="text-subtitle-1 black--text"> | Sign In</span>
              </h3>
              <p class="text-caption text-gray-100">
                Step {{ step.id }} of 4 - {{ step.name }}
              </p>
            </div>

            <v-form ref="Step1Formref" v-show="step.id == 1">
              <v-row class="mx-5 pt-4">
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    color="#93CB5B"
                    dense
                    class="font-size-14"
                    v-model="firstname"
                    :rules="[formRules.required]"
                    label="Firstname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    color="#93CB5B"
                    dense
                    class="font-size-14"
                    v-model="middlename"
                    label="Middlename"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    class="font-size-14"
                    color="#93CB5B"
                    v-model="lastname"
                    outlined
                    dense
                    :rules="[formRules.required]"
                    label="Surname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-text-field
                    outlined
                    dense
                    color="#93CB5B"
                    class="font-size-14"
                    v-model="suffix"
                    label="Suffix"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-btn
                    @click="next()"
                    block
                    depressed
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text py-5 font-size-14 rounded-lg"
                    >NEXT</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-form ref="Step2Formref" v-show="step.id == 2">
              <v-row class="mx-5 pt-4">
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="empStatusID"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Employment Status"
                    color="#93CB5B"
                    :items="empStatusList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="positionID"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Position"
                    color="#93CB5B"
                    :items="positionList"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-if="
                      positionID == 2 ||
                      // positionID == 3 ||
                      positionID == 20 ||
                      positionID == 21 ||
                      positionID == 22 ||
                      positionID == 23 ||
                      positionID == 24 ||
                      positionID == 25 ||
                      positionID == 26 ||
                      positionID == 27 ||
                      positionID == 28 ||
                      positionID == 29 ||
                      positionID == 30 ||
                      positionID == 31 ||
                      positionID == 32 ||
                      positionID == 33 ||
                      positionID == 34 ||
                      positionID == 35
                    "
                    v-model="instituteID"
                    :rules="
                      positionID == 2 ||
                      // positionID == 3 ||
                      positionID == 20 ||
                      positionID == 21 ||
                      positionID == 22 ||
                      positionID == 23 ||
                      positionID == 24 ||
                      positionID == 25 ||
                      positionID == 26 ||
                      positionID == 27 ||
                      positionID == 28 ||
                      positionID == 29 ||
                      positionID == 30 ||
                      positionID == 31 ||
                      positionID == 32 ||
                      positionID == 33 ||
                      positionID == 34 ||
                      positionID == 35
                        ? [formRules.required]
                        : []
                    "
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Institute"
                    color="#93CB5B"
                    :items="instituteList"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="designationID"
                    dense
                    class="rounded-lg"
                    item-text="description"
                    item-value="id"
                    label="Designation"
                    color="#93CB5B"
                    :items="designationList"
                  >
                  </v-autocomplete>
                </v-col> -->
                <v-col cols="12" class="pa-0 pt-2 px-4">
                  <v-autocomplete
                    v-model="officeID"
                    :rules="[formRules.required]"
                    dense
                    outlined
                    class="rounded-lg"
                    item-text="name"
                    item-value="id"
                    label="Office"
                    color="#93CB5B"
                    :items="officeList"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" class="pa-0 px-4">
                  <v-btn
                    @click="next()"
                    block
                    depressed
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text py-5 font-size-14 rounded-lg"
                    >NEXT</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-form ref="Step3Formref" v-show="step.id == 3">
              <v-row class="mx-5 pt-4">
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    outlined
                    dense
                    class="font-size-14"
                    v-model="email"
                    :rules="[formRules.required, formRules.email]"
                    label="Email address"
                    color="#93CB5B"
                    required
                    @change="checkEmail()"
                    :error-messages="emailError"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    class="font-size-14"
                    color="#93CB5B"
                    outlined
                    dense
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[formRules.required, formRules.password]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Password"
                    @click:append="show1 = !show1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4 mt-2">
                  <v-text-field
                    class="font-size-14"
                    outlined
                    color="#93CB5B"
                    dense
                    v-model="confirmPassword"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[
                      formRules.required,
                      formRules.confirmPassword(confirmPassword, password),
                    ]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm Password"
                    @click:append="show2 = !show2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pa-0 px-4">
                  <v-btn
                    :loading="isLoading"
                    @click="register()"
                    block
                    depressed
                    :color="$vuetify.theme.themes.light.submitBtns"
                    class="white--text py-5 font-size-14 rounded-lg"
                    >NEXT</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
            <v-form ref="Step4Formref" v-show="step.id == 4">
              <v-row class="mx-5">
                <v-col cols="12" class="pa-0 px-4 mb-2">
                  <p class="text-body-2">
                    Please enter the OTP that was sent to your Email Address to
                    continue your system Registration.
                  </p>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <p class="text-caption text-gray-100">
                    Please enter your One Time Pin
                  </p>
                  <div id="otp">
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
            </v-form>

            <v-col cols="12" class="pa-0">
              <div
                class="d-flex justify-center pt-8 pb-3 text-caption text-gray-100"
              >
                Already have an account?
                <router-link class="pl-2" to="/login"> Sign In</router-link>
              </div>
            </v-col>
          </v-card>
        </v-col>
        <!-- <v-col align="center" cols="12" md="6" v-if="isEmailVerifying">
          <v-card max-width="500" class="rounded-card">
            <v-card-title class="justify-center pa-4">
              <h2>Email Verification</h2>
              <br /><br /><br />
            </v-card-title>
            <v-form ref="Formref">
              <v-row class="mx-5">
                <v-col cols="12">
                  <div class="otp-div">
                    <v-otp-input
                      ref="otpInput"
                      input-classes="otp-input"
                      separator="-"
                      :num-inputs="6"
                      :should-auto-focus="true"
                      :is-input-num="true"
                      @on-complete="handleOnComplete"
                    />
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center">
                    <v-btn
                      depressed
                      color="teal darken-2"
                      class="white--text py-2 font-size-14"
                      :loading="isLoading"
                      :disabled="!enableOTPBtn"
                      @click="confirmOtp()"
                      >Confirm</v-btn
                    >
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex justify-center pt-8 pb-3 font-size-14">
                    Already have an account?
                    <router-link class="pl-2" to="/login"> Login</router-link>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col> -->
      </v-row>
    </v-container>

    <v-dialog v-model="termsDialog" persistent max-width="450">
      <v-card>
        <v-card-title class="text-h5"> Data Privacy Act of 2012 </v-card-title>
        <v-card-text
          ><span class="font-weight-bold">Data Privacy Act of 2012</span>, I
          consent to the following terms and conditions on the collection, use,
          processing and disclosure of my personal data: I am aware that the
          <span class="font-weight-bold">Davao del Norte State College</span>
          has collected and stored my personal data upon accomplishment of this
          form. These data include my full name, contact details like addresses,
          and landline/mobile numbers. I express my consent for the
          <span class="font-weight-bold">Davao del Norte State College</span> to
          collect, store my personal information. I hereby affirm my right to be
          informed, object to processing, access, and rectify and to suspend or
          withdraw my personal data pursuant to the provisions of the
          <a
            href="https://www.officialgazette.gov.ph/2012/08/15/republic-act-no-10173/"
            ><span class="font-bold underline">RA 10173 </span></a
          >
          and its implementing rules and regulations.<br /><br />
          By clicking the <span class="font-weight-bold">Agree</span> button
          below, I warrant that I have read, understood all of the above
          provisions, and agreed with its full implementation.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="disagree()"> Disagree </v-btn>
          <v-btn
            :color="$vuetify.theme.themes.light.submitBtns"
            text
            @click="agree()"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: "RegisterPage",
  mounted() {
    this.OTPInput();
    this.getOffices();
    this.getPositions();
    this.getDesignations();
    this.getEmpStatus();
    this.getInstitutes();

    if (this.$store.state.user) {
      this.deleteToken();
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setEmail", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      setTimeout(function () {
        location.reload();
      }, 0);
    }
    if (this.$store.getters.getEmail) {
      this.step = { id: 4, name: "Otp Confirmation" };
      this.email = this.$store.getters.getEmail;
    }
  },

  data: () => ({
    otp: null,
    termsDialog: true,
    isAgreed: null,
    step: { id: 1, name: "Personal Information" },
    isLoading: false,
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    email: "",
    password: "",
    confirmPassword: "",
    positionID: null,
    instituteID: null,
    empStatusID: null,
    designationID: null,
    officeID: null,
    officeList: [],
    instituteList: [],
    designationList: [],
    positionList: [],
    empStatusList: [],

    show1: false,
    show2: false,
    emailError: "",
    emailChecking: false,
    isEmailVerifying: false,
    enableOTPBtn: false,
    fadeAwayMessage: {
      show: false,
      type: "success",
      header: "Successfully Added!",
      message: "",
      top: 10,
    },
  }),
  beforeUnmount() {
    document.getElementById("first").value = "";
    document.getElementById("second").value = "";
    document.getElementById("third").value = "";
    document.getElementById("fourth").value = "";
    document.getElementById("fifth").value = "";
    document.getElementById("sixth").value = "";
  },
  methods: {
    agree() {
      this.termsDialog = false;
    },
    disagree() {
      this.$router.push("/");
    },
    next() {
      if (this.step.id == 1) {
        if (this.$refs.Step1Formref.validate()) {
          this.step = { id: 2, name: "Employment Information" };
        }
      } else if (this.step.id == 2) {
        if (this.$refs.Step2Formref.validate()) {
          this.step = { id: 3, name: "Account Information" };
        }
      } else if (this.step.id == 3) {
        if (this.$refs.Step3Formref.validate()) {
          this.step = { id: 4, name: "Otp Confirmation" };
        }
      }
    },

    // confirmOtp() {
    //   this.isLoading = true;
    //   let data = new FormData();
    //   data.append("otp", this.otp);
    //   data.append("email", this.email);
    //   this.axiosCall("/validate", "POST", data).then((res) => {
    //     this.isLoading = false;
    //     if (res.data.status) {
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "success";
    //       this.fadeAwayMessage.message = res.data.message;
    //       this.fadeAwayMessage.header = "System Message";
    //       this.$router.replace({ path: "/login" });
    //     } else {
    //       this.fadeAwayMessage.show = true;
    //       this.fadeAwayMessage.type = "error";
    //       this.fadeAwayMessage.message = res.data.message;
    //       this.fadeAwayMessage.header = "System Message";
    //     }
    //   });
    // },
    checkEmail() {
      this.emailChecking = true;
      this.axiosCall("/auth/checkEmailIfExist/" + this.email, "GET").then(
        (res) => {
          console.log(res.data);
          if (res.data) {
            this.emailError = "Email Already Exist!";
          } else {
            this.emailError = "";
          }
          this.emailChecking = false;
        }
      );
    },
    register() {
      if (this.$refs.Step3Formref.validate()) {
        this.isLoading = true;
        let data = {
          fname: this.firstname,
          mname: this.middlename,
          lname: this.lastname,
          suffix: this.suffix,
          email: this.email,
          password: this.password,
          officeID: this.officeID,
          positionID: this.positionID,
          instituteID: this.instituteID,
          designationID: this.designationID,
          empStatusID: this.empStatusID,
        };

        this.axiosCall("/auth/registerUser", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.isLoading = false;
            this.$store.dispatch("setEmail", this.email);
            this.next();
            // this.$router.push("/otp");
          } else {
            this.isLoading = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.message = res.data.message;
            this.fadeAwayMessage.header = "System Message";
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
        email: this.$store.getters.getEmail,
        otp: otp,
      };
      if (first && second && third && fourth && fifth && sixth) {
        this.isLoading = true;
        this.axiosCall("/auth/confirmOtp", "POST", data).then((res) => {
          if (res.data.status == 200) {
            this.isLoading = false;
            this.$router.push("/registration-success");
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

    handleOnComplete(value) {
      //console.log('OTP completed: ', value);
      if (value.length < 6) {
        this.enableOTPBtn = false;
      } else {
        this.enableOTPBtn = true;
      }
      this.otp = value;
    },

    getOffices() {
      this.axiosCall("/offices", "GET").then((res) => {
        this.officeList = res.data;
      });
    },
    getPositions() {
      this.axiosCall("/positions", "GET").then((res) => {
        this.positionList = res.data;
      });
    },
    getDesignations() {
      this.axiosCall("/designations", "GET").then((res) => {
        this.designationList = res.data;
      });
    },
    getEmpStatus() {
      this.axiosCall("/employment-status", "GET").then((res) => {
        this.empStatusList = res.data;
      });
    },

    getInstitutes() {
      this.axiosCall("/institutes", "GET").then((res) => {
        this.instituteList = res.data;
      });
    },
  },
};
</script>

<style scoped>
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
