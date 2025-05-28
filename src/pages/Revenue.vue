<template>
  <div class="revenue-view">
    <h1>Revenue </h1>

    <div class="card-box-style">
      <div class="card">
        <div class="icon">
          <h3>Total Orders</h3>
          <span><i class="fa-solid fa-shop fa-lg" style="color: #3498db;"></i></span>
        </div>
        <p>{{ totalOrders }}</p>
      </div>

      <div class="card">
        <div class="icon">
          <h3>Total Revenue</h3>
          <span><i class="fa-solid fa-arrow-trend-up fa-lg" style="color: #42b983;"></i></span>
        </div>
        <p>${{ totalRevenue.toFixed(2) }}</p>
      </div>

      <div class="card">
        <div class="icon">
          <h3>Avg. Order Value</h3>
          <span><i class="fa-solid fa-box fa-lg" style="color: #e67e22;"></i></span>
        </div>
        <p>${{ avgOrderValue.toFixed(2) }}</p>
      </div>
    </div>

    <div class="select-view">
      <label>
        Time :
        <select v-model="timeView">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </label>

      <label>
        Category:
        <select v-model="CategSelected">
          <option value="all">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </label>
    </div>

    <div class="charts">
      <div class="chart-container">
        <h3>Revenue Trend</h3>
        <LineChart :data="revenueData" />
      </div>
      <div class="chart-container">
        <h3>Orders Trend</h3>
        <BarChart :data="ordersData" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import LineChart from '../components/LineChart.vue'
import BarChart from '../components/BarChart.vue'

export default {
  components: {
    LineChart,
    BarChart
  },
  props: {
    orders: Array,
    products: Array
  },
  setup(props) {
    const timeView = ref('daily')
    const CategSelected = ref('all')

    const categories = computed(() => {
      const seen = new Set()
      props.products.forEach(p => seen.add(p.category))
      return [...seen]
    })

    const filteredOrders = computed(() => {
      if (CategSelected.value === 'all') return props.orders

      return props.orders.filter(o =>
        o.items.some(item => {
          const match = props.products.find(p => p.id === item.productId)
          return match?.category === CategSelected.value
        })
      )
    })
    // console.log(filteredOrders.value)
    const totalOrders = computed(() => filteredOrders.value.length)
    const totalRevenue = computed(() => filteredOrders.value.reduce((sum, o) => sum + o.total, 0))
    const avgOrderValue = computed(() => totalOrders.value ? totalRevenue.value / totalOrders.value : 0)

    const timeSelectedView = (orders, valueField = 'total') => {
      const groupMap = {}
      orders.forEach(o => {
        const d = new Date(o.date)
        let key

        switch (timeView.value) {
          case 'weekly':
            key = `${d.getFullYear()}-W${formatDates(d)}`; break
          case 'monthly':
            key = `${d.getFullYear()}-${d.getMonth() + 1}`; break
          case 'annually':
            key = d.getFullYear().toString(); break
          default:
            key = o.date
        }

        if (!groupMap[key]) groupMap[key] = valueField === 'total' ? 0 : 0
        groupMap[key] += valueField === 'total' ? o.total : 1
      })

      return {
        labels: Object.keys(groupMap),
        datasets: [{
          label: valueField === 'total' ? 'Revenue' : 'Orders',
          data: Object.values(groupMap),
          backgroundColor: valueField === 'total' ? '#42b983' : '#3498db',
          borderColor: valueField === 'total' ? '#42b983' : '#3498db',
          tension: 0.1
        }]
      }
    }
    // console.log(timeSelectedView(filteredOrders.value,'total'))
    function formatDates(date) {
      date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
      return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
    }

    return {
      timeView,
      CategSelected,
      categories,
      totalOrders,
      totalRevenue,
      avgOrderValue,
      revenueData: computed(() => timeSelectedView(filteredOrders.value, 'total')),
      ordersData: computed(() => timeSelectedView(filteredOrders.value, 'count'))
    }
  }
}
</script>

<style>
.revenue-view {
  max-width: 1200px;
  margin: 0 auto;
 
}

.revenue-view h1,
.revenue-view h3 {
  background: linear-gradient(90deg, #005C97, #363795, #00c9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; 
  color: transparent;
}



.icon {
  display: flex;
  justify-content: space-between;
}

.card-box-style {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
}

.card p {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .card-box-style {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }


  .charts {
    grid-template-columns: 1fr !important;
  }
}


.select-view {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.select-view label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.select-view select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin-top: 0;
}

</style>
