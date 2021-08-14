import {
    CREATE_TESTS,
    RETRIEVE_TESTS,
    UPDATE_TEST,
    DELETE_TEST,
    DELETE_ALL_TESTS
  } from "./types";
  
  import testsDataService from "../services/tests-services";
  
  export const createTest = (name, category, questions, passPercentage) => async (dispatch) => {
    try {
      const res = await testsDataService.create({ name, category, questions, passPercentage });
  
      dispatch({
        type: CREATE_TESTS,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const retrieveTest = () => async (dispatch) => {
    try {
      const res = await testsDataService.getAll();
  
      dispatch({
        type: RETRIEVE_TESTS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const updateTest = (id, data) => async (dispatch) => {
    try {
      const res = await testsDataService.update(id, data);
  
      dispatch({
        type: UPDATE_TEST,
        payload: data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const deleteTest = (id) => async (dispatch) => {
    try {
      await testsDataService.delete(id);
      dispatch({
        type: DELETE_TEST,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const deleteAllTest = () => async (dispatch) => {
    try {
      const res = await testsDataService.deleteAll();
  
      dispatch({
        type: DELETE_ALL_TESTS,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  export const simpleUpdateTest = (payload) => {
    return {
      type: UPDATE_TEST,
      payload
    }
  }