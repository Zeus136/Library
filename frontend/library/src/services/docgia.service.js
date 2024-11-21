import apiClient from "./api.service";

export default {
  getDocGia() {
    return apiClient.get("/docgia").then((response) => response.data);
  },
  getDocGiaById(id) {
    return apiClient.get(`/docgia/${id}`).then((response) => response.data);
  },
  createDocGia(docgiaData) {
    return apiClient
      .post("/docgia", docgiaData)
      .then((response) => response.data);
  },
  updateDocGia(id, docgiaData) {
    return apiClient
      .put(`/docgia/${id}`, docgiaData)
      .then((response) => response.data);
  },
  deleteDocGia(id) {
    return apiClient.delete(`/docgia/${id}`).then((response) => response.data);
  },
};
