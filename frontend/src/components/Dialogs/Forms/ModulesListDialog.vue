<template>
  <div>
    <v-dialog v-model="dialog" eager scrollable max-width="600px">
      <v-form ref="ModulesListFormref" @submit.prevent>
        <v-card elevation="4" class="rounded-lg">
          <!-- Header -->
          <v-card-title class="dialog-header px-6 py-4">
            <span class="text-h6 font-weight-medium">{{ action }} Module</span>
            <!-- <v-btn icon @click="closeD" class="text-white" variant="tonal">
              <v-icon>mdi-close</v-icon>
            </v-btn> -->
          </v-card-title>

          <!-- Content -->
          <v-card-text
            style="max-height: 700px; overflow-y: auto"
            class="py-6 px-6"
          >
            <v-container fluid>
              <v-row dense>
                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="title"
                    label="Title"
                    :rules="[formRules.required]"
                    outlined
                    dense
                    clearable
                    color="primary"
                    hint="Enter the module title"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" class="mb-4">
                  <v-text-field
                    v-model="icon"
                    label="Icon Name"
                    :rules="[formRules.required]"
                    outlined
                    dense
                    clearable
                    color="primary"
                    hint="Use mdi- icon names, e.g. mdi-home"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="6" class="d-flex align-center">
                  <span class="subtitle-2 font-weight-medium"
                    >Icon Preview:</span
                  >
                </v-col>
                <v-col cols="6" class="d-flex align-center">
                  <v-icon size="32">{{ icon }}</v-icon>
                </v-col>

                <v-col cols="12" class="my-4">
                  <v-autocomplete
                    v-model="isParent"
                    :items="isParentList"
                    label="Is Parent Route"
                    :rules="[formRules.required]"
                    outlined
                    dense
                    clearable
                    color="primary"
                  />
                </v-col>

                <template v-if="isParent === 'No'">
                  <v-col cols="12" class="mb-4">
                    <v-text-field
                      v-model="route"
                      label="Route"
                      :rules="[formRules.required]"
                      outlined
                      dense
                      clearable
                      color="primary"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-autocomplete
                      v-model="parentID"
                      :items="parentModuleList"
                      item-title="title"
                      item-value="id"
                      label="Parent Module"
                      outlined
                      dense
                      clearable
                      color="primary"
                    />
                  </v-col>
                </template>
              </v-row>
            </v-container>
          </v-card-text>

          <v-divider />

          <!-- Actions -->
          <v-card-actions class="px-6 py-4 justify-end">
            <v-btn
              variant="text"
              color="red"
              rounded="lg"
              elevation="1"
              @click="closeD"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              v-if="action === 'Add'"
              color="primary"
              @click="add"
              rounded
              elevation="2"
            >
              <v-icon left>mdi-check-circle</v-icon>
              Add
            </v-btn>

            <v-btn
              v-else-if="action === 'Update'"
              variant="text"
              color="primary"
              rounded="lg"
              elevation="1"
              @click="update"
            >
              Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </div>
</template>
<script>
import eventBus from "@/eventBus";
export default {
  props: {
    data: Object,
    action: String,
  },
  data() {
    return {
      dialog: false,

      id: null,
      title: null,
      icon: null,
      route: null,
      parentID: null,
      isParent: null,
      parentModuleList: [],
      isParentList: ["Yes", "No"],

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        this.dialog = true;
        this.initialize();
        this.$refs.ModulesListFormref.resetValidation();
        console.log(data);
        if (data.id) {
          this.id = data.id;
          this.title = data.title;
          this.icon = data.icon;
          this.route = data.route;
          this.parentID = parseInt(data.parentID);
          this.isParent = data.isParent == 1 ? "Yes" : "No";
        } else {
          this.id = null;
          this.title = null;
          this.icon = null;
          this.route = null;
          this.parentID = null;
          this.isParent = null;
        }
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.getParentModules();
    },
    getUserType() {
      this.axiosCall("/user-type/getAllUsertype", "GET").then((res) => {
        if (res.data) {
          this.usertypeList = res.data;
        }
      });
    },
    closeD() {
      eventBus.emit("closeModulesListDialog", false);
      this.dialog = false;
    },
    add() {
      if (this.$refs.ModulesListFormref.validate()) {
        let data = {
          id: this.id,
          title: this.title,
          icon: this.icon,
          route: this.route,
          parentID: this.parentID,
          isParent: this.isParent == "Yes" ? true : false,
        };

        this.axiosCall("/sys-modules", "POST", data).then((res) => {
          if (res.data.status == 201) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.PositionFormref.reset();
            this.closeD();
          }
        });
      }
    },

    update() {
      if (this.$refs.ModulesListFormref.validate()) {
        let data = {
          title: this.title,
          icon: this.icon,
          route: this.route,
          parentID: this.parentID,
          isParent: this.isParent == "Yes" ? true : false,
        };

        this.axiosCall("/sys-modules/" + this.id, "PATCH", data).then((res) => {
          if (res.data.status == 200) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "success";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.closeD();
          } else if (res.data.status == 400) {
            this.dialog = false;
            this.fadeAwayMessage.show = true;
            this.fadeAwayMessage.type = "error";
            this.fadeAwayMessage.header = "System Message";
            this.fadeAwayMessage.message = res.data.msg;
            this.$refs.PositionFormref.reset();
            this.closeD();
          }
        });
      }
    },

    getParentModules() {
      this.axiosCall("/sys-modules/getParentModules", "GET").then((res) => {
        console.log("Parent Module", res.data);
        this.parentModuleList = res.data;
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
    getUseRoles() {
      this.axiosCall("/user-role", "GET").then((res) => {
        this.userRoleList = res.data;
      });
    },
    getAssignedModules() {
      this.axiosCall("/assigned-modules", "GET").then((res) => {
        this.assignedModulesList = res.data;
      });
    },
  },
};
</script>
<style scoped>
.dialog-header {
  /* consistent height & spacing */
  min-height: 56px;
}

.v-text-field {
  /* slightly bigger inputs */
  font-size: 1rem;
}

.v-icon {
  transition: color 0.3s ease;
}

.v-icon:hover {
  color: #1976d2;
}

.v-card {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

.v-card-actions > .v-btn {
  min-width: 120px;
}
</style>
