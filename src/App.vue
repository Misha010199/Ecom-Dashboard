<template>
  <div class="app">
    <NavBar @change-view="HandleViewChange" />
    <div class="container">

      <router-view :products="products" :orders="orders" @update-inventory="UpdateInventory"
        @delete-product="deleteProd" @add-product="addProduct" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import Revenue from './pages/Revenue.vue'
import Inventory from './pages/Inventory.vue'
import AddProduct from './pages/AddProduct.vue'

export default {
  components: {
    NavBar,
    Revenue,
    Inventory,
    AddProduct
  },
  setup() {
    const selectedView = ref('revenue')
    const products = ref([])
    const orders = ref([])


    onMounted(() => {
      try {
        const productSave = localStorage.getItem('ecom-products')
        const orderSave = localStorage.getItem('ecom-orders')

        if (productSave) products.value = JSON.parse(productSave)
        if (orderSave) orders.value = JSON.parse(orderSave)

        if (products.value.length === 0) SampleData()
      } catch (e) {
        console.warn('Failed Data Loading:', e)
      }
    })

    const SampleData = () => {

      products.value = [
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15, description: 'High performance laptop', image: 'https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 2, name: 'Smartphone', category: 'Electronics', price: 699.99, stock: 30, description: 'Latest smartphone model', image: 'https://plus.unsplash.com/premium_photo-1706548331125-1193f17d2650?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 3, name: 'Headphones', category: 'Electronics', price: 149.99, stock: 45, description: 'Noise cancelling headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D' },
        { id: 4, name: 'T-Shirt', category: 'Clothing', price: 19.99, stock: 100, description: 'Cotton t-shirt', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 5, name: 'Jeans', category: 'Clothing', price: 49.99, stock: 60, description: 'Slim fit jeans', image: 'https://plus.unsplash.com/premium_photo-1674828601362-afb73c907ebe?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 6, name: 'Coffee Mug', category: 'Home', price: 9.99, stock: 200, description: 'Ceramic coffee mug', image: 'https://plus.unsplash.com/premium_photo-1669905375150-d2620e207f37?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      ]

      MockOrder()
      persistData()
    }

    const MockOrder = () => {
      const today = new Date()
      orders.value = []

      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(today.getDate() - i)

        const randomOrder = Math.floor(Math.random() * 10) + 1
        for (let j = 0; j < randomOrder; j++) {
          const lineCount = Math.floor(Math.random() * 3) + 1
          const items = []
          let total = 0

          for (let k = 0; k < lineCount; k++) {
            const p = products.value[Math.floor(Math.random() * products.value.length)]
            const qty = Math.floor(Math.random() * 2) + 1

            items.push({
              productId: p.id,
              name: p.name,
              price: p.price,
              quantity: qty,
              subtotal: p.price * qty
            })

            total += p.price * qty
          }
          //  console.log(items)
          orders.value.push({
            id: `order-${i}-${j}`,
            date: date.toISOString().split('T')[0],
            items,
            total
          })

        }
      }
    }

    const HandleViewChange = (viewName) => {
      // console.log(`Switching view to: ${viewName}`)
      selectedView.value = viewName
    }

    const addProduct = (product) => {
      product.id = Date.now()
      products.value.push(product)
      persistData()
    }

    const UpdateInventory = (productId, updatedStock) => {
      const item = products.value.find(p => p.id === productId)
      if (item) {
        item.stock = updatedStock
        persistData()
      }
    }

    const deleteProd = (productId) => {
      products.value = products.value.filter(p => p.id !== productId)
      persistData()
    }

    const persistData = () => {
      try {
        localStorage.setItem('ecom-products', JSON.stringify(products.value))
        localStorage.setItem('ecom-orders', JSON.stringify(orders.value))

        // console.info('p4roduct', JSON.parse(localStorage.getItem('ecom-products')))
      } catch (err) {
        console.error('Error saving to localStorage:', err)
      }
    }

    return {
      selectedView,
      products,
      orders,
      HandleViewChange,
      addProduct,
      UpdateInventory,
      deleteProd
    }
  }
}
</script>

<style>
.app {
  background-color: #fdfaf6; 
  font-family: "Lato", sans-serif;
  min-height: 100vh;
}

.container {
  padding: 50px;

}
</style>
