import {
    RETRIEVE_RESULTS,
  } from "./types";
  
  import ResultsDataService from "../services/results-service";
  
  export const retrieveResult = () => async (dispatch) => {
    try {
      const res = await ResultsDataService.getAll();
  
      dispatch({
        type: RETRIEVE_RESULTS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
