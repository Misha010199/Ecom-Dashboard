<template>
  <nav class="navbar">
    <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        width="28" height="28" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.293 2.707a1 1 0 001.414 1.414L9 16m6-3h1m-1 0l1.293 2.707a1 1 0 01-1.414 1.414L15 16m-6 0v1a1 1 0 001 1h6a1 1 0 001-1v-1" />
      </svg>
      <router-link to="/revenue" class="logo-text">
        <span>Ecom Dashboard</span>
      </router-link>
    </div>

    <div class="nav-buttons">
      <router-link to="/revenue" class="nav-link" active-class="active">Revenue</router-link>
      <router-link to="/inventory" class="nav-link" active-class="active">Inventory</router-link>
      <router-link to="/add-product" class="nav-link" active-class="active">Add Product</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 12px 24px;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 1.4rem;
  user-select: none;
}

.logo-text {
  text-decoration: none;
  font-weight: 700;
  background: linear-gradient(90deg, #005C97, #363795, #00c9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.nav-buttons {
  display: flex;
  gap: 12px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #1c62a3;
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  background-color: #2964bd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-link:focus {
  outline: 2px solid #313bcc;
  outline-offset: 2px;
}


@media (max-width: 575.98px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 16px;
    height: auto;
  }

  .nav-buttons {
    margin-top: 8px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .nav-link {
    font-size: 0.85rem;
    padding: 4px 12px;
  }

  .logo {
    font-size: 1.1rem;
  }

  .logo svg {
    width: 22px;
    height: 22px;
  }
}
</style>
