import http from "../http-common";

class ResultsDataService {
  getAll() {
    return http.get("/results");
  }

  get(id) {
    return http.get(`/result/${id}`);
  }

  getParticipants() {
    return http.get(`/get-participants`);
  }

  submit(data) {
    return http.post("/results/submit", data);
  }
}

export default new ResultsDataService();