<template>
  <div class="add-product">
    <h1>Add New Product</h1>

    <form @submit.prevent="submitProduct" class="product-form">
      <div class="product-row">
        <div class="product-grouping input-box-size">
          <label for="name">Product Name</label>
          <input type="text" id="name" v-model="prodVal.name" required class="input-box">
        </div>

        <div class="product-grouping input-box-size">
          <label for="category">Category</label>
          <select id="category" v-model="prodVal.category" required class="input-box">
            <option value="">Select a category</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
            <option value="_new">+ Add New Category</option>
          </select>


          <input v-if="prodVal.category === '_new'" type="text" v-model="categoryVal"
            placeholder="Enter new category name" required class="input-box mt-2">
        </div>
      </div>

      <div class="product-row">
        <div class="product-grouping input-box-size">
          <label for="price">Price ($)</label>
          <input type="number" id="price" v-model.number="prodVal.price" min="0.01" step="0.01" required
            class="input-box">
        </div>

        <div class="product-grouping input-box-size">
          <label for="stock">Initial Stock</label>
          <input type="number" id="stock" v-model.number="prodVal.stock" min="0" required class="input-box">
        </div>
      </div>

      <div class="product-grouping">
        <label for="description">Description</label>
        <textarea id="description" v-model="prodVal.description" rows="3" class="input-box"></textarea>
      </div>

      <div class="product-grouping image-view">
        <label for="image">Product Image</label>
        <input type="file" id="image" @change="SelectImage" accept="image/*" class="input-box">

        <div v-if="previewImg" class="image-view-box">
          <img :src="previewImg" alt="Preview" class="view-box" />

          <button type="button" class="remove-icon" @click="deleteImage" title="Remove Image">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <button type="submit" class="submit-btn">Add Product</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export default {
  props: {
    products: Array
  },
  emits: ['add-product'],
  setup(props, { emit }) {
    const router = useRouter()
    const prodVal = ref({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      image: null
    })

    const categoryVal = ref('')
    const previewImg = ref(null)

    const availableCategories = computed(() => {
      const cats = new Set()
      props.products.forEach(p => p.category && cats.add(p.category))
      return [...cats]
    })

    const SelectImage = (event) => {
      const selected = event.target.files[0]
      if (!selected) return deleteImage()

      const reader = new FileReader()
      reader.onload = e => {
        prodVal.value.image = e.target.result
        previewImg.value = e.target.result
      }
      reader.readAsDataURL(selected)
    }

    const deleteImage = () => {
      prodVal.value.image = null
      previewImg.value = null
    }

    const submitProduct = () => {

      if (prodVal.value.category === '_new') {
        const trimmed = categoryVal.value.trim()
        if (!trimmed) {
          toast.error('Please enter a new category name.')
          return
        }
        prodVal.value.category = trimmed
      }

      const newProduct = {
        ...prodVal.value,
        id: Date.now()
      }

      // console.log('Adding product:', newProduct)
      emit('add-product', newProduct)


      Object.assign(prodVal.value, {
        name: '', category: '', price: 0, stock: 0, description: '', image: null
      })
      categoryVal.value = ''
      previewImg.value = null

      toast.success('Product added!')

      setTimeout(() => router.push('/inventory'), 1000)
    }

    return {
      prodVal,
      categoryVal,
      previewImg,
      availableCategories,
      SelectImage,
      deleteImage,
      submitProduct
    }
  }
}
</script>




<style scoped>
.add-product {
  max-width: 600px;
  margin: 0 auto;
}

.add-product h1,
.add-product h3 {
  background: linear-gradient(90deg, #005C97, #363795, #00c9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; 
  color: transparent;
}

.product-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.product-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}

.mt-2 {
  margin-top: 10px;
}

.input-box-size {
  width: 48%;
}

.product-grouping {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.product-grouping label {
  margin-bottom: 5px;
  font-weight: bold;
}

.input-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea.input-box {
  resize: vertical;
}

.image-view {
  width: 100%;
}

.image-view-box {
  position: relative;
  padding: 5px;
  margin-top: 10px;
  border: 2px dashed #bbb;
  border-radius: 8px;
  max-width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.view-box {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}




.submit-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #3aa876;
}

.remove-icon {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  color: #e74c3c;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.remove-icon:hover {
  background: #e74c3c;
  color: white;
}
</style>
