<template>
  <div>
    <v-row class="mx-2">
      <v-col cols="12" md="6" class="flex-items">
          <span class="px-2">Show</span>
          <span>
            <v-select
            dense
            outlined
            hide-details
            :value="options.itemsPerPage"
            style="max-width: 90px;"
            class="rounded-lg"
            @change="options.itemsPerPage = parseInt($event, 10)"
            :items="perPageChoices">
        </v-select>
          </span>
          <span class="px-2">
            Entries
          </span>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="invoiceStatusID"
          dense
          outlined
          hide-details
          class="rounded-lg mr-2"
          item-text="description"
          item-value="id"
          label="Status"
          color="#239FAB"
          :items="invoice_status"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
      <v-text-field
          v-model="search"
          outlined
          prepend-inner-icon="search"
          label="Search"
          single-line
          hide-details
          class="rounded-lg"
          color="#239FAB"
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-card class="mx-5 mt-5 mb-1 dt-container" elevation="0" outlined>
    <v-data-table
      :loading="loading"
       :headers="headers"
        :items="data"
        item-key="id"
        :search="search"
        :options.sync="options"
        @pagination="pagination"
        hide-default-footer
    >
    <template v-slot:item.wticket_order="{ item }">
      <span v-if="item.parentWorkDetail_ID">{{item.wticket_order}}-S</span>
      <span v-else>{{item.wticket_order}}</span>
    </template>
    <template v-slot:item.status="{ item }">
      <v-chip
        class="chip-status-4"
      >
       <span>{{item.status.description}}</span>
      </v-chip>
    </template>
    <template v-slot:item.technician="{ item }">
      <span>{{getTechNames(item.technician).join(', ')}}</span>
    </template>
        <template v-slot:item.action="{ item }">
              <v-btn
                small
                color="grey"
                icon
                class="mr-2"
                @click="view(item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
        </template>
    </v-data-table>
    </v-card>
    <v-row class="mb-2 mx-5" align="center">
    <v-col cols="auto" class="mr-auto text-truncate" no-gutters>
     Showing {{ paginationData.pageStart + 1 }} to {{ paginationData.pageStop }} of {{ paginationData.itemsLength }} entries
    </v-col>
    <v-col cols="auto">
        <v-pagination
            v-model="options.page"
            class="rounded-lg"
            :total-visible="7"
            color="#239FAB"
            :length="paginationData.pageCount">
        </v-pagination>
    </v-col>
      </v-row>
      <DispatchingCompletedDialog :data="viewData" />
</div>
</template>
<script>
  export default {
    props: {
      tab: null,
    },
    components: {
        DispatchingCompletedDialog : () => import('../Dialogs/Views/DispatchingCompletedDialog.vue'),
    },
    data: () => ({
      search: '',
      headers: [
          { text: 'Work Order Ticket', value: 'wticket_order' },
          { text: 'Client', align: 'start', sortable: false, value: 'client.name'},
          { text: 'End Client', align: 'start', sortable: false, value: 'endclient.name'},
          { text: 'Technician', align: 'start', sortable: false, value: 'technician'},
          { text: 'Type of Request', value: 'requesttype.description', color:'#828282' },
          { text: 'Date', value: 'wdate' },
          // { text: 'Start Time', value: 'start_time', align: 'center'},
          { text: 'Action', value: 'action', align: 'center' },
        ],
      data: [],
      perPageChoices: [
          {text:'5' , value: 5},
          {text:'10' , value: 10},
          {text:'20' , value: 20},
          {text:'50' , value: 50},
          {text:'100' , value: 100},
          {text:'250' , value: 250},
          {text:'500' , value: 500},
      ],
      options: {},
      paginationData: {},
      loading: false,
      viewData: [],
      invoice_status: [],
      invoiceStatusID: null,
    }),
    watch: {
      options: {
        handler () {
         this.initialize();
        },
        deep: true,
      },
    },
    mounted() {
    this.eventHub.$on('closeDispatchingDialog', ()=>{
        this.initialize();
      });
    },
    beforeDestroy() {
         this.eventHub.$off('closeDispatchingDialog'); 
    },
    methods: {
      pagination(data){
      this.paginationData = data;
      },
      initialize (){
        this.loading = true;
        this.axiosCall('/work-details/getWorkDetailByStatus/6', 'GET').then((res) => {
              this.loading = false
              this.data = res.data;
          })
      },
      view(data){
        this.viewData = data;
      },
      getTechNames(data){
        let names = [];
        data.forEach(item => {
          names.push(item.firstName + ' ' + item.lastName)
        });
        return names;
       }
    }
  }
</script>
<style scoped>
.chip-status-1{
  background-color: #FEFFE5 !important;
  color: #FFBC10 !important;
}
.chip-status-2{
  background-color: #FFF0F0 !important;
  color: #EB5757 !important;
}
.chip-status-3{
  background-color: #EBFDFF !important;
  color: #1ABBB9 !important;
}
.chip-status-4{
  background-color: #FFF0F0 !important;
  color: #ffcc99 !important;
}
.chip-status-5{
  background-color: #F0FFF8 !important;
  color: #ff3300 !important;
}
.chip-status-6{
  background-color: #F0FFF8 !important;
  color: #18AB56 !important;
}
</style>