<template>
  <div>
    <canvas id="myChart" width="400" height="300"></canvas>
  </div>
</template>
<script>
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.plugins.register(ChartDataLabels);
export default {
  props: {
    data: Object,
  },
  data() {
    return {
      plugins: {
        datalabels: {
          color: "blue",
          labels: {
            title: {
              font: {
                weight: "bold",
              },
            },
            value: {
              color: "green",
            },
          },
          formatter: function(value) {
            if (value > 0) {
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);
              value = value.join(",");
              return value;
            } else {
              value = "";
              return value;
            }
          },
        },
      },
    };
  },
  watch: {
    data: {
      handler(data) {
        console.log("mydata", data);
        this.render(data.label, data.data);
      },
    },
    deep: true,
  },

  methods: {
    render(label, data) {
      console.log("label", label, "data", data);
      new Chart(this.$el.getElementsByTagName("canvas"), {
        type: "pie",
        data: {
          labels: label,
          datasets: [
            {
              label: "# of Votes",
              data: data,
              backgroundColor: [
                "#0096FF",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
              ],
              borderColor: [
                "#0096FF",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          legend: { display: false },

          plugins: this.plugins,
        },
      });
    },
  },

  mounted() {},
};
</script>
