<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-form ref="UserModuleFormref" @submit.prevent>
        <v-card>
          <v-card-title class="dialog-header d-flex pl-6 py-3">
            <span>Assign Modules</span>
            <v-spacer></v-spacer>
            <!-- <v-btn color="red" outlined @click="closeD">
              <v-icon size="large">mdi-close</v-icon>
            </v-btn> -->
          </v-card-title>

          <v-card-text style="max-height: 900px" class="pa-4">
            <v-row>
              <v-col cols="12" class="px-2 mt-2">
                <v-text-field
                  v-model="description"
                  :rules="[formRules.required]"
                  dense
                  outlined
                  required
                  label="Description"
                  class="rounded-lg"
                  color="#dc0b70"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="mt-n2">
                <v-row>
                  <!-- Main Modules -->
                  <v-col cols="4" class="px-2">
                    <div class="div_drag_head text-center">
                      <h4 class="my-2 white--text">Main modules</h4>
                    </div>
                    <draggable
                      class="draggable-list div_drag_foot py-2"
                      :list="assignedlist"
                      group="my-group"
                      item-key="id"
                    >
                      <template #item="{ element }">
                        <div
                          style="cursor: pointer"
                          class="drag-list-item main_module text-body-1"
                          @click="addSubList($event, element)"
                        >
                          {{ element.title }}
                          <v-icon v-if="element.isParent == 1"
                            >mdi-chevron-right</v-icon
                          >
                        </div>
                      </template>
                    </draggable>
                  </v-col>

                  <!-- Sub Modules -->
                  <v-col cols="4" class="px-2">
                    <div class="div_drag_head text-center">
                      <h4 class="my-2 white--text">Sub-modules</h4>
                    </div>
                    <draggable
                      class="draggable-list div_drag_foot py-2"
                      :class="hasSublistClicked ? '' : 'disable_drag'"
                      :list="sublist"
                      :group="hasSublistClicked ? 'my-group' : ''"
                      @change="afterAdd"
                      item-key="title"
                    >
                      <template #item="{ element }">
                        <div
                          style="cursor: pointer"
                          class="drag-list-item text-body-1"
                        >
                          {{ element.title }}
                          <v-icon v-if="element.isParent == 1"
                            >mdi-chevron-right</v-icon
                          >
                        </div>
                      </template>
                    </draggable>
                  </v-col>

                  <!-- All Modules -->
                  <v-col cols="4" class="px-2">
                    <div class="div_drag_head text-center">
                      <h4 class="my-2 white--text">All modules</h4>
                    </div>
                    <draggable
                      class="draggable-list div_drag_foot py-2"
                      :list="moduleslist"
                      :group="{ name: 'my-group', put: true }"
                      item-key="id"
                    >
                      <template #item="{ element }">
                        <div
                          style="cursor: pointer"
                          class="drag-list-item text-body-1"
                        >
                          {{ element.title }}
                          <span
                            ><i>({{ element.route }})</i></span
                          >
                          <v-icon v-if="element.isParent == 1"
                            >mdi-chevron-right</v-icon
                          >
                        </div>
                      </template>
                    </draggable>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions class="py-2 pr-4">
            <v-btn color="red" rounded="lg" elevation="1" @click="closeD()">
              <v-icon>mdi-close-circle-outline</v-icon>
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="action == 'Add'"
              color="green"
              rounded="lg"
              elevation="1"
              @click="save()"
            >
              <v-icon>mdi-plus-circle</v-icon>
              Add
            </v-btn>

            <v-btn
              v-if="action == 'Update'"
              color="primary"
              rounded="lg"
              elevation="1"
              @click="update()"
            >
              <v-icon>mdi-pencil-circle</v-icon>
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
    ></fade-away-message-component>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import eventBus from "@/eventBus";
export default {
  props: {
    data: Object,
    action: String,
  },
  components: {
    draggable,
  },
  data() {
    return {
      dialog: false,
      id: null,
      description: null,
      assignedlist: [],
      sublist: [],
      hasSublistClicked: false,
      moduleslist: [],
      itemSelected: [],

      fadeAwayMessage: {
        show: false,
        type: "success",
        header: "Successfully Added!",
        message: "",
        top: 10,
      },
    };
  },
  mounted() {},
  watch: {
    data: {
      handler(data) {
        this.dialog = true;

        if (data.id) {
          this.getRemainingModules(data.id);
          this.id = data.id;
          this.description = data.description;
          this.hasSublistClicked = false;
          this.sublist = [];
          this.assignedlist = JSON.parse(data.assign_mods);
        } else {
          // this.$refs.UserModuleFormref.resetValidation();
          this.getAllModules();
          this.hasSublistClicked = false;
          this.id = null;
          this.description = null;
          this.assignedlist = [];
          this.sublist = [];
        }
      },
      deep: true,
    },
  },
  methods: {
    toggleActive() {
      let modules = document.querySelectorAll(".main_module");

      for (let i = 0; i < modules.length; i++) {
        const element = modules[i];
        element.classList.remove("active");
      }
    },
    addSubList($event, item) {
      console.log(item);
      this.toggleActive();
      $event.target.classList.add("active");
      if (item.isParent == "1" || item.isParent == 1) {
        this.hasSublistClicked = true;
        this.itemSelected = item;

        for (let j = 0; j < this.assignedlist.length; j++) {
          let sL = this.assignedlist[j];
          if (sL.id == item.id) {
            if (sL.subLink.length == 0) {
              this.sublist = [];
            } else {
              this.sublist = [];
              this.sublist = [...this.assignedlist[j].subLink];
            }
          }
        }
      } else {
        this.hasSublistClicked = false;
        this.sublist = [];
      }
    },

    afterAdd() {
      for (let i = 0; i < this.assignedlist.length; i++) {
        let element = this.assignedlist[i];
        if (element.id == this.itemSelected.id) {
          this.assignedlist[i].subLink = [...this.sublist];
        }
      }
    },
    getAllModules() {
      this.axiosCall("/sys-modules", "GET").then((res) => {
        if (res.data) {
          // console.log(res.data);
          this.moduleslist = res.data;
        }
      });
    },

    getRemainingModules(id) {
      this.axiosCall("/assigned-modules/getRemainingModules/" + id, "GET").then(
        (res) => {
          if (res.data) {
            // console.log(res.data);
            this.moduleslist = res.data;
          }
        }
      );
    },
    closeD() {
      eventBus.emit("closeUserModulesDialog", false);
      this.dialog = false;
    },
    save() {
      if (this.$refs.UserModuleFormref.validate()) {
        let data = {
          description: this.description,
          assign_mods: JSON.stringify(this.assignedlist),
        };

        this.axiosCall("/assigned-modules", "POST", data).then((res) => {
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
      if (this.$refs.UserModuleFormref.validate()) {
        let data = {
          description: this.description,
          assign_mods: JSON.stringify(this.assignedlist),
        };

        this.axiosCall("/assigned-modules/" + this.id, "PATCH", data).then(
          (res) => {
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
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.active {
  background-color: #8e6e25;
  border-radius: 5px;
  color: white;
}
.disable_drag {
  background-color: #e0e0e0;
}
.draggable-list {
  height: 400px;
  overflow-y: auto;
}
.div_drag_head {
  border: 1px solid #8e6e25;
  background-color: #8e6e25;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.div_drag_foot {
  border: 1px solid #8e6e25;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.drag-list-item {
  border-bottom: 1px solid #e0e0e0;
  padding-left: 5px;
  padding-top: 5px;
}

.drag-list-item:hover {
  background-color: #8e6e25;
  border-radius: 5px;
  color: white;
}
</style>
