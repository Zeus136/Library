import apiClient from "./api.service";

export default {
  getNhanVien() {
    return apiClient.get("/nhanvien").then((response) => response.data);
  },
  getNhanVienById(id) {
    return apiClient.get(`/nhanvien/${id}`).then((response) => response.data);
  },
  getNhanVienByMSNV(msnv) {
    return apiClient
      .get(`/nhanvien/msnv/${msnv}`)
      .then((response) => response.data);
  },
  createNhanVien(nhanvienData) {
    return apiClient
      .post("/nhanvien", nhanvienData)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response ? error.response.data : error;
      });
  },
  updateNhanVien(id, nhanvienData) {
    return apiClient
      .put(`/nhanvien/${id}`, nhanvienData)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response ? error.response.data : error;
      });
  },
  updateNhanVienByMSNV(msnv, nhanvienData) {
    return apiClient
      .put(`/nhanvien/msnv/${msnv}`, nhanvienData)
      .then((response) => response.data);
  },
  updatePasswordById(id, password) {
    return apiClient
      .put(`/nhanvien/${id}/password`, { MatKhau: password })
      .then((response) => response.data);
  },
  deleteNhanVien(id) {
    return apiClient
      .delete(`/nhanvien/${id}`)
      .then((response) => response.data);
  },
  login(credentials) {
    return apiClient
      .post("/nhanvien/login", credentials)
      .then((response) => response.data);
  },
};
