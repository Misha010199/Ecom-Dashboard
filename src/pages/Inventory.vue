<template>
  <div class="inventory-veiw">
    <h1>Inventory</h1>

    <div class="stats">
      <div class="stat-item">
        <div class="icon">
          <h3>Total Products</h3>
          <i class="fa-solid fa-box fa-lg" style="color:#4CAF50"></i>
        </div>
        <p>{{ products.length }}</p>
      </div>
      <div class="stat-item">
        <div class="icon">
          <h3>Low Stock</h3>
          <i class="fa-solid fa-tags fa-lg" style="color:#2196F3"></i>
        </div>
        <p>{{ stock_low }}</p>
      </div>
      <div class="stat-item">
        <div class="icon">
          <h3>Critical Stock</h3>
          <i class="fa-solid fa-triangle-exclamation" style="color: #f44336; font-size: 24px;"></i>
        </div>
        <p>{{ critical_count }}</p>
      </div>
    </div>

    <div class="select-option">
      <input type="text" v-model="searchList" placeholder="Search products..." class="search-box">

      <select v-model="categoryFilter" class="category-filter">
        <option value="all">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>

      <select v-model="sortList" class="sort-by">
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="stock-asc">Stock (Low-High)</option>
        <option value="stock-desc">Stock (High-Low)</option>
      </select>
    </div>

    <div class="table-wrapper">
      <div class="th-list">
        <div class="th">
          <div class="ht-view">Image</div>
          <div class="ht-view">Product</div>
          <div class="ht-view">Category</div>
          <div class="ht-view">Price</div>
          <div class="ht-view">Stock</div>
          <div class="ht-view">Status</div>
          <div class="ht-view">Actions</div>
        </div>

        <div v-for="item in filterList" :key="item.id" class="table-row" :class="{ 'low-stock': item.stock < 10 }">
          <div class="item">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="image-box-view">
            <div v-else class="no-image">No Image</div>
          </div>
          <div class="item">{{ item.name }}</div>
          <div class="item">{{ item.category }}</div>
          <div class="item">${{ item.price.toFixed(2) }}</div>
          <div class="item">
            <input type="number" v-model.number="item.stock" min="0" @change="updateStock(item.id, item.stock)"
              class="stock-input">
          </div>
          <div class="item">
            <span v-if="item.stock < 5" class="status alert">Critical</span>
            <span v-else-if="item.stock < 10" class="status less">Low</span>
            <span v-else class="status high">OK</span>
          </div>
          <div class="item btn-action">
            <button @click="deleteItem(item.id)" class="delete-btn"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div v-if="filterList.length === 0" class="not-found">
          <i class="fas fa-search" style="font-size: 2rem; color: #999; margin-bottom: 1rem;"></i>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    </div>
  </div>
  <dialog ref="openDialog" class="delete-box">
    <h3>Confirm Deletion</h3>
    <p>Are you sure you want to delete this product?</p>
    <div class="delete-btns">
      <button @click="deleteAsk" class="confirm-btn"> <i class="fas fa-trash"></i> Delete</button>
      <button @click="handleCancel" class="cancel-btn"> <i class="fas fa-times"></i> Cancel</button>
    </div>
  </dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  emits: ['update-inventory', 'delete-product'],
  setup(props, { emit }) {
    const searchList = ref('')
    const categoryFilter = ref('all')
    const sortList = ref('name-asc')
    const openDialog = ref(null)
    const deleteIndex = ref(null)


    const categories = computed(() => {
      const cats = new Set()
      props.products.forEach(p => cats.add(p.category))
      return [...cats]
    })

    const filterList = computed(() => {
      let ListSort = [...props.products]

      if (searchList.value) {
        const searchVal = searchList.value.toLowerCase()
        ListSort = ListSort.filter(product => product.name.toLowerCase().includes(searchVal) || product.description.toLowerCase().includes(searchVal))
      }

      if (categoryFilter.value !== 'all') {
        ListSort = ListSort.filter(product => product.category === categoryFilter.value)
      }

      const sortOpt = {
        'name-asc': (a, b) => a.name.localeCompare(b.name),
        'name-desc': (a, b) => b.name.localeCompare(a.name),
        'stock-asc': (a, b) => a.stock - b.stock,
        'stock-desc': (a, b) => b.stock - a.stock
      }

      ListSort.sort(sortOpt[sortList.value])
      return ListSort
    })

    const stock_low = computed(() => props.products.filter(p => p.stock < 10).length)
    const critical_count = computed(() => props.products.filter(p => p.stock < 5).length)

    const updateStock = (id, stock) => {
      emit('update-inventory', id, stock)
    }

    const deleteItem = (id) => {
      deleteIndex.value = id
      openDialog.value.showModal()
    }

    const deleteAsk = () => {
      emit('delete-product', deleteIndex.value)
      toast.success('Product deleted successfully!')
      openDialog.value.close()
    }

    const handleCancel = () => {
      deleteIndex.value = null
      openDialog.value.close()
    }
    return {
      searchList,
      categoryFilter,
      sortList,
      categories,
      filterList,
      stock_low,
      critical_count,
      updateStock,
      deleteItem,
      openDialog,
      deleteAsk,
      handleCancel
    }
  }
}
</script>
<style>
.inventory-veiw {
  max-width: 1200px;
  margin: 0 auto;
}

.inventory-veiw h1,
.inventory-veiw h3 {
  background: linear-gradient(90deg, #005C97, #363795, #00c9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
}

.stat-item p {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .stats {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }

  .select-option {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

  }

  .th-list {
    width: max-content;
    min-width: 100%;
  }

}


.icon {
  display: flex;
  justify-content: space-between;
}

.select-option {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box,
.category-filter,
.sort-by {
  padding: 9px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-box {
  flex: 1;
}

.th-list {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
 
  background: white
}

.th,
.table-row {
  display: grid;
  grid-template-columns: 100px 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 20px;
  align-items: center;
}

.th {
  background-color: #2964BD;
  color: white;
  font-weight: bold;
}

.table-row {
  border-bottom: 1px solid #eee;
  box-shadow: #999;

}

.table-row:last-child {
  border-bottom: none;
}

.table-row.low-stock {
  background-color: #fff8e1;
}

.stock-input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status {

  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status.alert {
  background-color: #ffcdd2;
  color: #c62828;
}

.status.less {
  background-color: #ffecb3;
  color: #ff8f00;
}

.status.high {
  background-color: #c8e6c9;
  color: #388e3c;
}

.btn-action {
  display: flex;
  gap: 5px;
}

.delete-btn {
  background-color: #ef5350;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #e53935;
}



.image-box-view {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.no-image {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 4px;
  color: #999;
  font-size: 0.8rem;
}

.delete-box {
  border: none;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.delete-box::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.delete-box h3 {
  margin-top: 0;
  color: #333;
}

.delete-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  background-color: #ef5350;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #e53935;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #bdbdbd;
}

.not-found {
  padding: 40px 20px;
  text-align: center;
  background: white;
  border-bottom: 1px solid #eee;
}

.not-found h3 {
  color: #555;
  margin-bottom: 10px;
}

.not-found p {
  color: #777;
  margin-bottom: 20px;
}
</style>