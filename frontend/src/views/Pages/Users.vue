<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-toolbar flat class="rounded-xl mb-7">
            <v-toolbar-title
              ><strong>{{ $route.meta.title }}</strong></v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <UsersDataTable />
        </v-col>
      </v-row>
    </v-card>

    <!-- <UserTypeDialog :data="typeData" :action="action" /> -->
  </div>
</template>

<script>
import UsersDataTable from "../../components/Utils/UsersDataTable.vue";
export default {
  name: "UserPage",
  components: {
    UsersDataTable,
    // UserTypeDialog: () =>
    //   import("../../components/Dialogs/Forms/UserTypeDialog.vue"),
  },
  data: () => ({
    typeData: [],
    action: null,
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
  methods: {
    // addRequest() {
    //   this.typeData = [{ id: null }];
    //   this.action = "Add";
    // },
  },
};
</script>

<style></style>
