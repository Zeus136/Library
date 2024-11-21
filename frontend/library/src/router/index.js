// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Infor from "@/views/Infor.vue";
import ManageStaff from "@/views/ManageStaff.vue";
import ManageDG from "@/views/ManageDG.vue";
import ManageSach from "@/views/ManageBook.vue";
import ManageNXB from "@/views/ManageNXB.vue";
import ManageMuonTra from "@/views/MuonTra.vue";

const routes = [
  { path: "/", component: Login, name: "Login" },
  { path: "/infor", component: Infor, name: "Infor" },
  { path: "/manage-staffs", component: ManageStaff, name: "ManageStaffs" },
  { path: "/manage-readers", component: ManageDG, name: "ManageDGs" },
  { path: "/manage-books", component: ManageSach, name: "ManageSachs" },
  { path: "/manage-nxb", component: ManageNXB, name: "ManageNXBs" },
  { path: "/manage-muontra", component: ManageMuonTra, name: "ManageMuonTra" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
