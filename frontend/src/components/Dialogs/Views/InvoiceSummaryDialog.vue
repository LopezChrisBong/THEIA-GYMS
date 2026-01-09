<template>
   <v-dialog
      v-model="dialog"
      max-width="1000px"
      persistent
    >
      <v-card>
        <v-card-title  dark class="dialog-header">
        <span>Invoice Summary</span>
        <v-spacer></v-spacer>
       <v-btn
            icon
            dark
            @click="closeDialog();"
        >
            <v-icon>mdi-close</v-icon>
        </v-btn>
          </v-card-title>
        <v-card-text>
            <v-row>
              <v-col>
                  <v-data-table
                    :headers="headers"
                    :items="summary"
                    item-key="id"
                    :loading="loading"
                    class="elevation-1 mt-4"
                  >
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-spacer></v-spacer>
                      <vue-json-to-csv :json-data="summary"
                      :labels="{ 
                        wDate: { title: 'Work Date' },
                        workDesc: { title: 'Work Description/Items' },
                        rateSched: { title: 'Rate' },
                        qty: { title: 'Qty' },
                        hours: { title: 'Hours' },
                        unitPrice: { title: 'Unit Price' },
                        amount: { title: 'Amount' },
                      }"
                      csv-title="Invoice Summary"
                      >
                      <v-btn
                        color="green darken-2"
                        class="white--text mr-1"
                        outlined
                        :disabled="summary.length == 0"
                      >
                        <v-icon>mdi-microsoft-excel</v-icon>
                        CSV
                      </v-btn>
                      </vue-json-to-csv>
                    </v-toolbar>
                  </template>
                    <template v-slot:item.wDate="{ item }">
                      {{ formatDate(item.wDate) }}
                    </template>
                    <template v-slot:item.unitPrice="{ item }">
                      {{ formatPrice(item.unitPrice) }}
                    </template>
                    <template v-slot:item.amount="{ item }">
                      {{ formatPrice(item.amount) }}
                    </template>
                  </v-data-table>
                </v-col>
            </v-row>
      </v-card-text>
      <v-divider></v-divider>
    <v-card-actions class="pa-5">
        <strong>Sub Total:</strong> {{formatPrice(subtotal)}}
            <v-spacer></v-spacer>
        <strong>Others:</strong> {{formatPrice(other_exp)}}
            <v-spacer></v-spacer>
        <strong>Grand Total:</strong> {{formatPrice(total)}}
      
          <!-- <v-btn
            color="red"
            outlined
            @click="closeDialog();"
          >
          <v-icon>mdi-close-circle-outline</v-icon>
            Close
          </v-btn> -->
        </v-card-actions>
     </v-card>      
    </v-dialog>
</template>

<script>
export default {
    props: {
        data: null
    },
    data () {
      return {
        dialog: false,
        headers: [
        { text: "Date", value: "wDate" },
        { text: "Work Description/Items", value: "workDesc" },
        { text: "Rate", value: "rateSched" },
        { text: "Qty", value: "qty" },
        { text: "Hours", value: "hours" },
        { text: "Unit Price", value: "unitPrice" },
        { text: "Amount", value: "amount" },
      ],
      loading: false,
      summary: [],
      subtotal: 0,
      other_exp: 0,
      total: 0,
      }
    },
    watch: {
      data: {
        handler (data) {
          if(data.length > 0){
            this.getInvoiceSummary(data);
            this.dialog = true;
          }
        },
        deep: true,
      },
    },
    methods: {
    getInvoiceSummary(wds) {
      this.loading = true;
      let data = {
        wds: JSON.stringify(wds)
      }
      this.axiosCall("/client-invoice/getInvoiceSummary", "POST", data).then((res) => {
        if (res) {
          // this.summary = res.data.workdetails;
          let summary = [];
          res.data.workdetails.forEach(item => {
            summary.push({
              wDate: item.workdetail.wdate,
              workDesc: item.workdetail.work_desc,
              rateSched: item.clientData.rateSched,
              qty: item.workdetail.techCount,
              hours: item.workdetail.actual_work_hour,
              unitPrice: item.clientData.rate,
              amount: parseFloat(item.clientData.rate) * parseFloat(item.workdetail.techCount) * parseFloat(item.workdetail.actual_work_hour)
            })
            if(item.expenses){
              item.expenses.forEach(item2 => {
                summary.push({
                wDate: item.workdetail.wdate,
                workDesc: item2.expenseType,
                rateSched: item2.description,
                qty: item2.qty,
                hours: item.workaccount.travel_time,
                unitPrice: item2.amount,
                amount: parseFloat(item2.amount) * parseFloat(item2.qty)
              })
              });
            }
          });
          this.summary = summary
          this.subtotal = res.data.subtotal
          this.other_exp = res.data.other_exp
          this.total = res.data.total
        }
        this.loading = false;
      });
    },
     closeDialog() {
        this.dialog = false;
        this.eventHub.$emit("closeSummaryDialog", true);
      },
    },
}
</script>

