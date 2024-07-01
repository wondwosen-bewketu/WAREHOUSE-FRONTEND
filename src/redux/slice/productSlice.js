// productSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { addProduct } from "../../api/api"; // Adjust the path based on your project structure

export const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    addProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addProductSuccess: (state) => {
      state.loading = false;
    },
    addProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { addProductStart, addProductSuccess, addProductFailure } =
  productSlice.actions;

export const addProductAsync = (productData) => async (dispatch) => {
  try {
    dispatch(addProductStart());
    const data = await addProduct(productData);
    dispatch(addProductSuccess(data));
  } catch (error) {
    dispatch(addProductFailure(error.message));
  }
};

export default productSlice.reducer;
