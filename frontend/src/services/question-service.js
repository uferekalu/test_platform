import http from "../http-common";

class QuestionDataService {
  getAll() {
    return http.get("/questions");
  }

  get(id) {
    return http.get(`/questions/${id}`);
  }

  create(data) {
    return http.post("/questions", data);
  }

  update(id, data) {
    return http.put(`/questions/${id}`, data);
  }

  delete(id) {
    return http.delete(`/questions/${id}`);
  }

  deleteAll() {
    return http.delete(`/questions`);
  }

  findByDescription(description) {
    return http.get(`/questions?title=${description}`);
  }
}

export default new QuestionDataService();