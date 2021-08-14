import http from "../http-common";

class CategoriesDataService {
  getAll() {
    return http.get("/tests");
  }

  get(id) {
    return http.get(`/test/${id}`);
  }

  create(data) {
    return http.post("/test", data);
  }
  
  update(id, data) {
    return http.put(`/test/${id}`, data);
  }

  delete(id) {
    return http.delete(`/test/${id}`);
  }
}

export default new CategoriesDataService();