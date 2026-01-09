<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      data: [],
      labels: [],
    };
  },
  watch: {
      data: {
        handler () {
        this.renderCharts();
        },
        deep: true,
      },
    },
  mounted() {
    this.renderCharts();
    this.chartData();
  },
methods: {
      chartData(){
      this.axiosCall("/chart/totalLoansPerMonth", "GET").then(
        (res) => {
          this.labels = [];
          this.data = [];
          res.data.data.result.forEach(item => {
            this.labels.push(item.monthname);
          });
          res.data.data.result.forEach(item => {
            this.data.push(item.totalcount);
          });
          this.extends.update();
        }
      );
    },
    renderCharts(){
      this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: "Total Loans Per Month",
            backgroundColor: "#008080",
            data: this.data
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
    }
}
};
</script>
