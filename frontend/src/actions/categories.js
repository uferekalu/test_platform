import {
    CREATE_CATEGORIES,
    RETRIEVE_CATEGORIES,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_ALL_CATEGORIES
  } from "./types";
  
  import CategoriesDataService from "../services/categories-services";
  
  export const createCategory = (name) => async (dispatch) => {
    try {
      const res = await CategoriesDataService.create({ name });
  
      dispatch({
        type: CREATE_CATEGORIES,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const retrieveCategory = () => async (dispatch) => {
    try {
      const res = await CategoriesDataService.getAll();
  
      dispatch({
        type: RETRIEVE_CATEGORIES,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const updateCategory = (id, data) => async (dispatch) => {
    try {
      const res = await CategoriesDataService.update(id, data);
  
      dispatch({
        type: UPDATE_CATEGORY,
        payload: data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const deleteCategory = (id) => async (dispatch) => {
    try {
      await CategoriesDataService.delete(id);
      dispatch({
        type: DELETE_CATEGORY,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const deleteAllCategory = () => async (dispatch) => {
    try {
      const res = await CategoriesDataService.deleteAll();
  
      dispatch({
        type: DELETE_ALL_CATEGORIES,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  export const simpleUpdateCategory = (payload) => {
    return {
      type: UPDATE_CATEGORY,
      payload
    }
  }