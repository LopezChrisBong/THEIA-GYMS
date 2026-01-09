<template>
  <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl">
       <v-toolbar-title><strong>Voided Works</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <VoidedWorksDataTable />
    </v-col>
    </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    components: {
        VoidedWorksDataTable : () => import('../../components/Reports/VoidedWorksDataTable.vue'),
    },
    data: () => ({
    }),
    methods: {
    },

  }
</script>