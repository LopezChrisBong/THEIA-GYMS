<template>
  <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl">
       <v-toolbar-title style="width:400px;"><strong>Invoice Logs
       </strong>
       </v-toolbar-title>
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <InvoiceLogsDataTable />
    </v-col>
    </v-row>
    </v-card>
  </div>
</template>

<script>
  export default {
    components: {
        InvoiceLogsDataTable : () => import('../../components/Reports/InvoiceLogsDataTable.vue'),
    },
    data: () => ({
      tab: 0,
    }),
    watch: {
      tab: {
        handler () {
        },
        deep: true,
      },
    },
    methods: {
    },

  }
</script>