// src/services/book.service.js
import apiClient from "./api.service";

export default {
  getBooks() {
    return apiClient.get("/sach").then((response) => response.data);
  },
  getBookById(id) {
    return apiClient.get(`/sach/${id}`).then((response) => response.data);
  },
  createBook(bookData) {
    return apiClient.post("/sach", bookData).then((response) => response.data);
  },
  updateBook(id, bookData) {
    return apiClient
      .put(`/sach/${id}`, bookData)
      .then((response) => response.data)
      .catch((error) => {
        throw error.response ? error.response.data : error;
      });
  },
  deleteBook(id) {
    return apiClient.delete(`/sach/${id}`).then((response) => response.data);
  },
};
