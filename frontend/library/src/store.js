// src/store.js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    _id: null,
    MSNV: null,
    HoTenNV: null,
    ChucVu: null,
    DiaChi: null,
    SoDienThoai: null,
    Password: null,
    nhanViens: [],
    docGias: [],
  },
  mutations: {
    setUserData(state, userData) {
      state._id = userData._id;
      state.MSNV = userData.MSNV;
      state.HoTenNV = userData.HoTenNV;
      state.ChucVu = userData.ChucVu;
      state.DiaChi = userData.DiaChi;
      state.SoDienThoai = userData.SoDienThoai;
      state.Password = userData.Password;
    },
    clearUserData(state) {
      state._id = null;
      state.MSNV = null;
      state.HoTenNV = null;
      state.ChucVu = null;
      state.DiaChi = null;
      state.SoDienThoai = null;
      state.Password = null;
    },
    setNhanViens(state, nhanViens) {
      state.nhanViens = nhanViens;
    },
    addNhanVien(state, nhanVien) {
      state.nhanViens.push(nhanVien);
    },
    updateNhanVien(state, updatedNhanVien) {
      const index = state.nhanViens.findIndex(
        (nv) => nv._id === updatedNhanVien._id
      );
      if (index !== -1) {
        state.nhanViens.splice(index, 1, updatedNhanVien);
      }
    },
    deleteNhanVien(state, nhanVienId) {
      state.nhanViens = state.nhanViens.filter((nv) => nv._id !== nhanVienId);
    },
    setDocGias(state, docGias) {
      state.docGias = docGias;
    },
    addDocGia(state, docGia) {
      state.docGias.push(docGia);
    },
    updateDocGia(state, updatedDocGia) {
      const index = state.docGias.findIndex(
        (dg) => dg._id === updatedDocGia._id
      );
      if (index !== -1) {
        state.docGias.splice(index, 1, updatedDocGia);
      }
    },
    deleteDocGia(state, docGiaId) {
      state.docGias = state.docGias.filter((dg) => dg._id !== docGiaId);
    },
  },
  actions: {
    login({ commit }, userData) {
      commit("setUserData", userData);
    },
    logout({ commit }) {
      commit("clearUserData");
    },
    async checkSession({ commit }) {
      try {
        const response = await axios.get("/api/auth/session");
        commit("setUserData", response.data);
      } catch (error) {
        commit("clearUserData");
        console.error("Session invalid or expired", error);
      }
    },
    async fetchNhanViens({ commit }) {
      const response = await axios.get("/api/nhanvien");
      commit("setNhanViens", response.data);
    },
    async createNhanVien({ commit }, nhanVienData) {
      const response = await axios.post("/api/nhanvien", nhanVienData);
      commit("addNhanVien", response.data);
    },
    async updateNhanVien({ commit }, nhanVienData) {
      const response = await axios.put(
        `/api/nhanvien/${nhanVienData._id}`,
        nhanVienData
      );
      commit("updateNhanVien", response.data);
    },
    async deleteNhanVien({ commit }, nhanVienId) {
      await axios.delete(`/api/nhanvien/${nhanVienId}`);
      commit("deleteNhanVien", nhanVienId);
    },
    async fetchNhanVienById({ commit }, id) {
      const response = await axios.get(`/api/nhanvien/${id}`);
      return response.data;
    },
    async fetchDocGias({ commit }) {
      const response = await axios.get("/api/docgia");
      commit("setDocGias", response.data);
    },
    async createDocGia({ commit }, docGiaData) {
      const response = await axios.post("/api/docgia", docGiaData);
      commit("addDocGia", response.data);
    },
    async updateDocGia({ commit }, docGiaData) {
      const response = await axios.put(
        `/api/docgia/${docGiaData._id}`,
        docGiaData
      );
      commit("updateDocGia", response.data);
    },
    async deleteDocGia({ commit }, docGiaId) {
      await axios.delete(`/api/docgia/${docGiaId}`);
      commit("deleteDocGia", docGiaId);
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.MSNV,
    _id: (state) => state._id,
    MSNV: (state) => state.MSNV,
    HoTenNV: (state) => state.HoTenNV,
    ChucVu: (state) => state.ChucVu,
    DiaChi: (state) => state.DiaChi,
    SoDienThoai: (state) => state.SoDienThoai,
    Password: (state) => state.Password,
    nhanViens: (state) => state.nhanViens,
    docGias: (state) => state.docGias,
  },
  plugins: [createPersistedState()],
});
