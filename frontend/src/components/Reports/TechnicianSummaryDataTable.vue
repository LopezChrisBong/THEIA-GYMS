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
      <v-col cols="12" md="6" class="flex-items">
        <v-autocomplete
          v-model="ClientID"
          dense
          outlined
          class="rounded-lg mr-2"
          item-text="name"
          label="Clients"
          item-value="id"
          color="#239FAB"
          hide-details
          :items="clients"
        >
        </v-autocomplete>
        <v-autocomplete
          v-model="month"
          dense
          outlined
          class="rounded-lg mr-2"
          item-text="desc"
          label="Months"
          item-value="val"
          color="#239FAB"
          :rules="[formRules.required]"
          hide-details
          :items="months"
        >
        </v-autocomplete>
      <vue-json-to-csv :json-data="csv_data"
      :labels="{ 
        wticket_order: { title: 'Work Order Ticket' },
        endClient: { title: 'Customer' },
        technician: { title: 'Technicians' },
        ticket_no: { title: 'Ticket #' },
        wdate: { title: 'Date' },
        start_time: { title: 'IN Time' },
        end_time: { title: 'OUT Time' },
        break_time: { title: 'Break Time' },
        total_work_time: { title: 'Work Hours' },
        travel_hours: { title: 'Travel Hours' },
        total_hours: { title: 'Total Hours' },
        work_desc: { title: 'Work Decription' },
        note: { title: 'Notes' },
      }"
      :csv-title="csv_title"
      >
      <v-btn
        color="green darken-2"
        class="white--text mr-1"
        outlined
        :disabled="data.length == 0"
      >
        <v-icon>mdi-microsoft-excel</v-icon>
        CSV
      </v-btn>
      </vue-json-to-csv>
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
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="py-4">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <b>IN Time:</b> {{item.start_time}}
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>OUT Time:</b> {{item.end_time}}
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>Break Time:</b> {{item.break_time}}
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>Work Hours:</b> {{item.total_work_time}}
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>Travel Hours:</b> 00000
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>Total Hours:</b> 00000
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6">
                <b>Work Description:</b> {{item.work_desc}}
              </v-col>
              <v-col cols="12" lg="6">
                <b>Notes:</b> {{item.work_desc}}
              </v-col>
            </v-row>
          </td>
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
      expanded: [],
      singleExpand: false,
      headers: [
          { text: 'Work Order Ticket', value: 'wticket_order' },
          { text: 'End Client', align: 'start', sortable: false, value: 'endClient.name'},
          // { text: 'Location', align: 'start', sortable: false, value: 'country.name'},
          { text: 'Technician', align: 'start', sortable: false, value: 'technician'},
          { text: 'Ticket #', align: 'center', sortable: false, value: 'ticket_no'},
          // { text: 'Type of Request', value: 'requesttype.description', color:'#828282' },
          { text: 'Date', align: 'center', value: 'wdate' },
          // { text: 'Start Time', value: 'start_time', align: 'center'},
          { text: 'Action', value: 'action', align: 'center' },
        ],
      data: [],
      csv_data: [],
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
      clients: [],
      ClientID: null,
      month: null,
      months: [],
      monthName : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      csv_title: 'Invoice Summary',
    }),
    watch: {
      options: {
        handler () {
         this.initialize();
        },
        deep: true,
      },
      ClientID: {
        handler () {
         this.initialize();
        },
        deep: true,
      },
    },
    mounted() {
    this.getClients();
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
        if(this.ClientID){
        this.axiosCall(
          "/work-details/getClientActivity",
          "POST", {clientID: this.ClientID}
        ).then((res) => {
          if (res) {
            this.data = res.data;
            let dates = [];
            this.csv_data = [];
            if(res.data){
                this.data.forEach(item => {
                  let [year, month, day] = item.wdate.split("-");
                  console.log(day)
                  dates.push({val: month + '-' + year, desc: this.monthName[parseInt(month)-1] + ' ' + year});
                  item.month = month + '-' + year;
                  this.csv_data.push({
                    wticket_order: item.wticket_order,
                    endClient: item.endClient.name,
                    technician: this.getTechNames(item.technician).join(', '),
                    ticket_no: item.ticket_no,
                    wdate: item.wdate,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    break_time: item.break_time,
                    total_work_time: item.total_work_time,
                    travel_hours: 0,
                    total_hours: item.total_work_time + 0,
                    work_desc: item.work_desc,
                    note: "sample langggggggg"
                  })
                });
              this.months = dates;
              this.month = this.months[0].val;
              let client = this.clients.find(item => item.id = this.ClientID).name;
              let month = this.months.find(item => item.val = this.month).desc;
              this.csv_title = client + "_Activity Dispatch Sheet_" + month;
            }
          }
        });
        this.loading = false;
        } 
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
       },
       getClients() {
      this.axiosCall("/client", "GET").then((res) => {
        if (res) {
          this.clients = res.data;
          this.ClientID = res.data[0].id
        }
      });
    },
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