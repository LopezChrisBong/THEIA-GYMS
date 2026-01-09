<template>
  <div class="pa-4">
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default {
  name: "PiePage",

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      chartInstance: null,
    };
  },

  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.renderChart(val.label, val.data);
        }
      },
    },
  },

  methods: {
    renderChart(labels, data) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.chartInstance = new Chart(this.$refs.chart, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "#0096FF",
                "#17C800",
                "#20C745",
                "#FC7300",
                "#F8B102",
                "#66d9ff",
                "#ff4da6",
                "#99e600",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              color: "grey",
              font: {
                weight: "bold",
                size: 15,
              },
              formatter(value) {
                return value > 0 ? value.toLocaleString() : "";
              },
            },
          },
        },
      });
    },
  },

  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>
