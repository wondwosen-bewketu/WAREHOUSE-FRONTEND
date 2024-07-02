import axios from "axios";
import { BASE_URL } from "./baseURL";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization header
export const setAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Function to set multipart form data and Authorization header
export const setFormDataAndAuthHeaders = (formData, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  return {
    headers,
    data: formData,
  };
};

// Function to change password
export const changePassword = async (formData, token) => {
  try {
    setAuthHeaders();
    const response = await api.put("/user/changepassword", formData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw new Error("Failed to change password");
  }
};

// Function to post user
export const postUser = async (userData) => {
  try {
    setAuthHeaders();
    const response = await api.post("user/postuser", userData);
    return response.data;
  } catch (error) {
    console.error("Error posting user:", error.message);
    throw new Error("Failed to post user");
  }
};

// Function to log in user
export const loginUser = async (loginData) => {
  try {
    const response = await api.post(`user/login`, loginData);
    const { token } = response.data;
    localStorage.setItem("token", token);
    setAuthHeaders();
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw new Error("Failed to login");
  }
};

export const addProduct = async (formData) => {
  try {
    setAuthHeaders();
    const response = await api.post("product/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error.message);
    throw new Error("Failed to add product");
  }
};

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}product/all`);
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Response data is not an array:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const recordSale = async (productId, saleData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}sales/record/${productId}`, // Use `${BASE_URL}sales/record/${productId}` for the URL
      saleData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error recording sale:", error);
    throw error;
  }
};

export const transferSale = async (productId, saleData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}transfer/transfer-to-sale/${productId}`,
      saleData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error recording sale:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
