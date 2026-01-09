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
      <!-- <vue-json-to-csv :json-data="csv_data"
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
      </vue-json-to-csv> -->
      <v-btn
        color="green darken-2"
        class="white--text mr-1"
        outlined
        :disabled="data.length == 0"
        @click="exportCSV()"
      >
        <v-icon>mdi-microsoft-excel</v-icon>
        CSV
      </v-btn>
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
                <b>Travel Hours:</b> {{item.workaccount.travel_time ? item.workaccount.travel_time : 0}}
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <b>Total Hours:</b> {{getTotalHrs(item.total_work_time, item.workaccount.travel_time)}}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="6">
                <b>Work Description:</b> {{item.work_desc}}
              </v-col>
              <v-col cols="12" lg="6">
                <b>Notes:</b> {{item.worknote.note || ''}}
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
    <v-dialog
      v-model="exportDialog"
      max-width="1200px"
      persistent
      scrollable
    >
      <v-card>
        <v-card-title  dark class="dialog-header">
        <span>Export Work Summary</span>
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="exportDialog = false"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-card-text style="max-height:900px">
            <v-row class="mt-5">
              <v-col cols="12">
                <h2>Work Details</h2>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3"  v-for="(item, index) in csv_label_temp.work_detail" :key="index">
                <v-checkbox
                  v-model="csv_label_selected"
                  :label="item.title"
                  :value="index"
                  color="#239FAB"
                  class="ma-0 mb-2 pa-0"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <h2>Work Before</h2>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3"  v-for="(item, index) in csv_label_temp.work_before" :key="index">
                <v-checkbox
                  v-model="csv_label_selected"
                  :label="item.title"
                  :value="index"
                  color="#239FAB"
                  class="ma-0 mb-2 pa-0"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <h2>Work After</h2>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3"  v-for="(item, index) in csv_label_temp.work_after" :key="index">
                <v-checkbox
                  v-model="csv_label_selected"
                  :label="item.title"
                  :value="index"
                  color="#239FAB"
                  class="ma-0 mb-2 pa-0"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <h2>Work Note</h2>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3"  v-for="(item, index) in csv_label_temp.work_note" :key="index">
                <v-checkbox
                  v-model="csv_label_selected"
                  :label="item.title"
                  :value="index"
                  color="#239FAB"
                  class="ma-0 mb-2 pa-0"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12">
                <h2>Work Account</h2>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3"  v-for="(item, index) in csv_label_temp.work_account" :key="index">
                <v-checkbox
                  v-model="csv_label_selected"
                  :label="item.title"
                  :value="index"
                  color="#239FAB"
                  class="ma-0 mb-2 pa-0"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12"><v-divider></v-divider></v-col>
              <v-col cols="12">
                <v-subheader>
                  Selected Fields
                </v-subheader>
                    <v-simple-table
                    v-if="csv_label_selected.length > 0"
                    >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center" v-for="(item, index) in csv_label_filtered" :key="index">
                              {{item.title}}
                            </th>
                          </tr>
                        </thead>
                      </template>
                    </v-simple-table>
                    <h5 v-else class="text-center"><i>No fields selected</i></h5>
              </v-col>
              <v-col cols="12">
                <vue-json-to-csv :json-data="csv_data"
                :labels="csv_label_filtered"
                :csv-title="csv_title"
                >
                <v-btn
                  color="green darken-2"
                  class="white--text mr-1"
                  block
                  :disabled="data.length == 0"
                  @click="exportCSV()"
                >
                  <v-icon>mdi-microsoft-excel</v-icon>
                  Export as CSV
                </v-btn>
                </vue-json-to-csv>
              </v-col>
              <v-col cols="12">
                  <h4>Pre-defined reports</h4>
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="12" md="12" >
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
                    v-if="ClientID == 3"
                    >
                    <v-btn
                      color="green darken-2"
                      class="white--text mr-1"
                      outlined
                      :disabled="data.length == 0"
                    >
                      <v-icon>mdi-microsoft-excel</v-icon>
                      Computer Gate
                    </v-btn>
                    </vue-json-to-csv>
                    <h5 v-else ><i>No pre-defined reports</i></h5>
                </v-col>
            </v-row>
      </v-card-text>
      <v-divider></v-divider>
    <v-card-actions class="pa-5">
    </v-card-actions> 
    </v-card>      
    </v-dialog>
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
      exportDialog: false,
      csv_label: {},
      csv_label_filtered: {},
      csv_label_selected: [],
      csv_label_temp: {},
      task_status: [],
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
      csv_label_selected: {
        handler (data) {
          if(this.csv_data.length > 0){
            this.csv_label_filtered = {}
            data.forEach(item => {
                Object.assign(this.csv_label_filtered, {[item]: this.csv_label[item]})
          });
          // console.log(this.csv_label_filtered)
          }
        },
        deep: true,
      },
    },
    mounted() {
    this.getClients();
    this.getTaskStatus();
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
            console.log(res.data)
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
                    technician: this.getTechNames(item.technician).join(', '),
                    client: item.client.name,
                    endClient: item.endClient.name,
                    ticket_no: item.ticket_no,
                    PO_number: item.PO_number,
                    wdate: item.wdate,
                    work_desc: item.work_desc,
                    request_sched: item.requestSched.description,
                    request_type: item.requestType.description,
                    eta: item.eta,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    break_time: item.break_time,
                    total_work_time: item.total_work_time,
                    travel_hours: item.workaccount.travel_time ? item.workaccount.travel_time : 0,
                    total_hours: this.getTotalHrs(item.total_work_time,item.workaccount.travel_time),
                    dateCompleted: item.dateCompleted ? this.formatDate(item.dateCompleted) : '',
                    dateApproved: item.dateApproved ? this.formatDate(item.dateApproved) : '',
                    GC_created: this.getStatus(item.workbefore.GC_created),
                    WOTicketProvided: this.getStatus(item.workbefore.WOTicketProvided),
                    SiteandPOConfirmed: this.getStatus(item.workbefore.SiteandPOConfirmed),
                    TechReminded: this.getStatus(item.workbefore.TechReminded),
                    FBLink: item.workbefore.FBLink ? item.workbefore.FBLink : '',
                    WorkCompleted: this.getStatus(item.workafter.WorkCompleted),
                    ReleasedByRE: this.getStatus(item.workbefore.ReleasedByRE),
                    SWRSigned: this.getStatus(item.workafter.SWRSigned),
                    FERepCreated: this.getStatus(item.workafter.FERepCreated),
                    SWRSent: this.getStatus(item.workafter.SWRSent),
                    FERepSent: this.getStatus(item.workafter.FERepSent),
                    SupportPhotoSent: this.getStatus(item.workafter.SupportPhotoSent),
                    SavedReptoGDrive: this.getStatus(item.workafter.SavedReptoGDrive),
                    SavedPhotostoGDrive: this.getStatus(item.workafter.SavedPhotostoGDrive),
                    GDriveLink: item.workafter.GDriveLink,
                    note: item.worknote.note ? item.worknote.note : '',
                    resolution: item.worknote.resolution ? item.worknote.resolution : '',
                    rates: item.workaccount.rates ? item.workaccount.rates : '',
                    travel_cost: item.workaccount.travel_cost ? item.workaccount.travel_cost : '',
                    travel_time: item.workaccount.travel_time ? item.workaccount.travel_time : '',
                  })
                });
              this.months = dates;
              this.month = this.months[0].val;
              let client = this.clients.find(item => item.id = this.ClientID).name;
              let month = this.months.find(item => item.val = this.month).desc;
              this.csv_title = client + "_Activity Dispatch Sheet_" + month;
              this.csv_label = { 
                  wticket_order: { title: 'Work Order Ticket' },
                  work_desc: { title: 'Work Decription' },
                  client: { title: 'Client' },
                  endClient: { title: 'End Client' },
                  technician: { title: 'Technicians' },
                  ticket_no: { title: 'Ticket #' },
                  wdate: { title: 'Work Date' },
                  request_sched: { title: 'Request Schedule' },
                  request_type: { title: 'Request Type' },
                  eta: { title: 'ETA' },
                  start_time: { title: 'IN Time' },
                  end_time: { title: 'OUT Time' },
                  break_time: { title: 'Break Time' },
                  total_work_time: { title: 'Work Hours' },
                  travel_hours: { title: 'Travel Hours' },
                  total_hours: { title: 'Total Hours' },
                  PO_number: { title: 'PO Number' },
                  DateApproved: { title: 'Date Approved' },
                  DateCompleted: { title: 'Date Completed' },
                  GC_created: { title: 'Whatsapp GC Created?' },
                  WOTicketProvided: { title: 'WO Ticket Provided?' },
                  SiteandPOConfirmed: { title: 'Site Location and POC Confirmed?' },
                  TechReminded: { title: 'Reminded Tech a Day Before?' },
                  FBLink: { title: 'Facebook Link' },
                  WorkCompleted: { title: 'Work Completed?' },
                  ReleasedByRE: { title: 'Released by RE?' },
                  SWRSigned: { title: 'Service Work Report Signed?' },
                  FERepCreated: { title: 'FE Report Created?' },
                  SWRSent: { title: 'Service Work Report Sent?' },
                  FERepSent: { title: 'FE Report Sent?' },
                  SupportPhotoSent: { title: 'Supportive Photo Sent?' },
                  SavedReptoGDrive: { title: 'Save Report on GDrive?' },
                  SavedPhotostoGDrive: { title: 'Saved Photos on GDrive?' },
                  GDriveLink: { title: 'GDrive Link' },
                  note: { title: 'Note' },
                  resolution: { title: 'Resolution' },
                  rates: { title: 'Rate' },
                  travel_cost: { title: 'Travel Cost' },
                  travel_time: { title: 'Travel Time' },
              };
              this.csv_label_temp = { 
                work_detail:{
                  wticket_order: { title: 'Work Order Ticket' },
                  work_desc: { title: 'Work Decription' },
                  client: { title: 'Client' },
                  endClient: { title: 'End Client' },
                  technician: { title: 'Technicians' },
                  ticket_no: { title: 'Ticket #' },
                  wdate: { title: 'Work Date' },
                  request_sched: { title: 'Request Schedule' },
                  request_type: { title: 'Request Type' },
                  eta: { title: 'ETA' },
                  start_time: { title: 'IN Time' },
                  end_time: { title: 'OUT Time' },
                  break_time: { title: 'Break Time' },
                  total_work_time: { title: 'Work Hours' },
                  travel_hours: { title: 'Travel Hours' },
                  total_hours: { title: 'Total Hours' },
                  PO_number: { title: 'PO Number' },
                  DateApproved: { title: 'Date Approved' },
                  DateCompleted: { title: 'Date Completed' }
                },
                work_before: {
                  GC_created: { title: 'Whatsapp GC Created?' },
                  WOTicketProvided: { title: 'WO Ticket Provided?' },
                  SiteandPOConfirmed: { title: 'Site Location and POC Confirmed?' },
                  TechReminded: { title: 'Reminded Tech a Day Before?' },
                  FBLink: { title: 'Facebook Link' },
                },
                work_after: {
                  WorkCompleted: { title: 'Work Completed?' },
                  ReleasedByRE: { title: 'Released by RE?' },
                  SWRSigned: { title: 'Service Work Report Signed?' },
                  FERepCreated: { title: 'FE Report Created?' },
                  SWRSent: { title: 'Service Work Report Sent?' },
                  FERepSent: { title: 'FE Report Sent?' },
                  SupportPhotoSent: { title: 'Supportive Photo Sent?' },
                  SavedReptoGDrive: { title: 'Save Report on GDrive?' },
                  SavedPhotostoGDrive: { title: 'Saved Photos on GDrive?' },
                  GDriveLink: { title: 'GDrive Link' },
                },
                work_note: {
                  note: { title: 'Note' },
                  resolution: { title: 'Resolution' },
                },
                work_account: {
                  rates: { title: 'Rate' },
                  travel_cost: { title: 'Travel Cost' },
                  travel_time: { title: 'Travel Time' },
                },
                other_expenses: {
                  rates: { title: 'Note' },
                  travel_cost: { title: 'Resolution' },
                  travel_time: { title: 'Resolution' },
                },
              }
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
    getTotalHrs(wh,th){
      if(th){
        return parseFloat(wh) + parseFloat(th)
      }
      else{
        return wh
      }
    },
    exportCSV(){
      this.exportDialog = true;
    },
    getTaskStatus() {
      this.axiosCall("/status/status-type/2", "GET").then((res) => {
        if (res) {
          this.task_status = res.data;
        }
      });
    },
    getStatus(id){
      let res = "";
      this.task_status.forEach(item => {
        if(item.id == id){
          res = item.description
        }
      });
      return res;
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