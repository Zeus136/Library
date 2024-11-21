import apiClient from "./api.service";

export default {
  getNXBs() {
    return apiClient.get("/nxb").then((response) => response.data);
  },
  getNXBById(id) {
    return apiClient.get(`/nxb/${id}`).then((response) => response.data);
  },
  createNXB(nxbData) {
    return apiClient.post("/nxb", nxbData).then((response) => response.data);
  },
  updateNXB(id, nxbData) {
    return apiClient
      .put(`/nxb/${id}`, nxbData)
      .then((response) => response.data);
  },
  deleteNXB(id) {
    return apiClient.delete(`/nxb/${id}`).then((response) => response.data);
  },
};
