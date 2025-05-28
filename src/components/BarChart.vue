
<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null
    
    onMounted(() => {
      if (chartCanvas.value) {
        renderChart()
      }
    })
    
    watch(() => props.data, () => {
      if (chartInstance) {
        chartInstance.data = props.data
        chartInstance.update()
      } else if (chartCanvas.value) {
        renderChart()
      }
    }, { deep: true })
    
    function renderChart() {
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      chartInstance = new Chart(chartCanvas.value, {
        type: 'bar',
        data: props.data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    }
    
    return {
      chartCanvas
    }
  }
}
</script>

<style>
canvas {
  max-height: 300px;
}
</style>