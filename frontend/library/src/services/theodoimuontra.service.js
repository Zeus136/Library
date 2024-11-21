import apiClient from "./api.service";

export default {
  getTheodoimuontra() {
    return apiClient.get("/theodoimuontra").then((response) => response.data);
  },
  getTheodoimuontraById(id) {
    return apiClient
      .get(`/theodoimuontra/${id}`)
      .then((response) => response.data);
  },
  createTheodoimuontra(theodoimuontraData) {
    return apiClient
      .post("/theodoimuontra", theodoimuontraData)
      .then((response) => response.data);
  },
  updateTheodoimuontra(id, theodoimuontraData) {
    return apiClient
      .put(`/theodoimuontra/${id}`, theodoimuontraData)
      .then((response) => response.data);
  },
  deleteTheodoimuontra(id) {
    return apiClient
      .delete(`/theodoimuontra/${id}`)
      .then((response) => response.data);
  },
};
