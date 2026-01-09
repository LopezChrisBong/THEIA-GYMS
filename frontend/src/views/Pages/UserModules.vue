<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row class="px-2">
        <v-col cols="12">
          <!-- <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong class="text-gray-100 ">{{
                $route.meta.title
              }}</strong></v-toolbar-title
            >
            <v-spacer></v-spacer> -->
          <!-- <v-btn
              class="white--text rounded-lg"
              color="#519043"
              @click="addPosition()"
            >
              <v-icon left> mdi-plus-box-outline </v-icon>
              Add New Position
            </v-btn> -->
          <!-- </v-toolbar> -->
          <UserModulesDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import UserModulesDataTable from "../../components/Utils/UserModulesDataTable.vue";
export default {
  components: {
    UserModulesDataTable,
  },
  data: () => ({
    headers: [
      { text: "Name", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    headers1: [
      { text: "Modules", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    headers2: [
      { text: "Sub-modules", value: "name", align: "start" },
      {
        text: "Actions",
        value: "actions",
        align: "right",
      },
    ],
    typeData: [],
    action: null,
    reload: false,
  }),

  created() {
    // console.log("created");
    if (this.$store.state.expiryDate < Date.now()) {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setIsAuthenticated", 0);
      this.render = true;
      this.$router.push("/");
      // location.reload();
    }
  },
  methods: {},
};
</script>

<style></style>
