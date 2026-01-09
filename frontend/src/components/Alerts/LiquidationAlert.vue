<template>
  <v-dialog v-model="isShown" persistent max-width="500">
    <v-card style="background-color: #FF9800; color: white;">
      <v-card-title class="text-h5" style="word-break: break-word;">
        After Travel Liquidation Reminder!
        <v-spacer></v-spacer>
        <v-btn icon dark @click="handleDismiss()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-for="(i, idx) in data" :key="i">
        <div>
          {{ idx + 1 }}. You need to liquidate your last travel with a TO
          number: <b>{{ i.travel_order_num }}</b> on or before
          {{ formatDate(i.deadline) }}.
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    isShown: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleDismiss() {
      this.isShown = false;
    },
    handleReviewNow() {
      // alert("Redirecting to liquidation dashboard...");
      // this.handleDismiss();
    },
  },
};
</script>
