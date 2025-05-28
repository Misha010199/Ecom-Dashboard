import { createRouter, createWebHistory } from "vue-router";

import Revenue from "../pages/Revenue.vue";
import Inventory from "../pages/Inventory.vue";
import AddProduct from "../pages/AddProduct.vue";

const routes = [
  { path: "/", redirect: "/revenue" },
  { path: "/revenue", component: Revenue, props: true },
  { path: "/inventory", component: Inventory, props: true },
  { path: "/add-product", component: AddProduct, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
