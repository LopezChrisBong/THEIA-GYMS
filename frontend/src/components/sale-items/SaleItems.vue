<template>
  <div class="mx-2">
    <v-card class="mt-2">
      <v-row class="px-2">
        <v-col cols="12">
          <SaleItemsDataTable />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import SaleItemsDataTable from "./SaleItemsDataTable.vue";

export default {
  name: "SaleItems",
  components: {
    SaleItemsDataTable,
  },
};
</script>

<style scoped>
</style>
