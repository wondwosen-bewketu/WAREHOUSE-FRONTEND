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

export const createWarehouse = async (formData) => {
  try {
    setAuthHeaders(); // Optional: If you need to set headers for this operation
    const response = await api.post("warehouse/create", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating warehouse:", error);
    throw error;
  }
};

export const getWarehouses = async () => {
  try {
    const response = await api.get(`warehouse/all`);
    return response.data.warehouses;
  } catch (error) {
    console.error("Error fetching warehouses", error);
    throw error;
  }
};

export const fetchSalesUsers = async () => {
  try {
    const response = await api.get("/user/sales-users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sales users", error);
    throw error;
  }
};

// Function to fetch users by warehouse ID
export const fetchUsersByWarehouse = async (warehouseId) => {
  try {
    const response = await api.get(`warehouse/${warehouseId}/users`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
};
export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${userId}`);
    return response.data;
  } catch (error) {
    // Handle the error appropriately
    console.error("Error deleting user by ID:", error);
    throw error; // Or handle the error differently based on your
  }
};

export const getWarehouseById = async (id) => {
  try {
    const response = await api.get(`warehouse/${id}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    throw error;
  }
};

// Fetch warehouses associated with admin by ID
export const getAdminsWarehouseProducts = async (adminId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}warehouse/${adminId}/warehouses`
    );
    console.log("API response:", response); // Add logging for debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching admin's warehouse products:", error);
    throw error;
  }
};

export const sendProductToWarehouse = async (productData) => {
  try {
    const response = await api.post("warehouse/send-to-warehouse", productData);
    return response.data;
  } catch (error) {
    console.error("Error sending product to warehouse:", error.message);
    throw new Error("Failed to send product to warehouse");
  }
};

export const requestProducts = async (productData) => {
  try {
    const response = await api.post("request/new", productData);
    return response.data;
  } catch (error) {
    console.error("Error request product:", error.message);
    throw new Error("Failed to request product");
  }
};

export const fetchProductRequests = async () => {
  try {
    const response = await api.get(`request/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product requests:", error);
    throw error;
  }
};

// Function to fetch all transactions
export const getAllTransactions = async () => {
  setAuthHeaders();
  const response = await api.get("warehouse/transactions");
  return response.data;
};
export const getUsers = async () => {
  try {
    const response = await api.get("/user/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error("Failed to fetch users");
  }
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
    const response = await api.post("user/create", userData);
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
    const response = await api.post("warehouse/add", formData, {
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

export const transferProductToSales = async (data) => {
  try {
    const response = await api.post("sales/transfer", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error transferring product to sales:", error.message);
    throw new Error("Failed to transfer product to sales");
  }
};

export const restockProduct = async (data) => {
  try {
    setAuthHeaders();
    const response = await api.post("/warehouse/restockProduct", data);
    return response.data;
  } catch (error) {
    console.error("Error restocking product:", error.message);
    throw new Error("Failed to restock product");
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

export const transferToSale = async (productId, data) => {
  try {
    const formData = new FormData();
    formData.append("quantityToTransfer", data.quantityToTransfer);
    formData.append("stockTransferNumber", data.stockTransferNumber);
    formData.append("remark", data.remark);

    if (data.stockTransferImage) {
      formData.append("stockTransferImage", data.stockTransferImage);
    }

    const response = await axios.post(
      `${BASE_URL}transfer/transfer-to-sale/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const restock = async (productId, data) => {
  try {
    const formData = new FormData();
    formData.append("quantityToTransfer", data.quantityToTransfer);
    formData.append("stockTransferNumber", data.stockTransferNumber);
    formData.append("remark", data.remark);

    if (data.stockTransferImage) {
      formData.append("stockTransferImage", data.stockTransferImage);
    }

    const response = await axios.post(
      `${BASE_URL}transfer/restock-from-sale/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};

export const getDashboardCounts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}dashboard/counts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    throw error;
  }
};

export const getStockTransferData = async (period) => {
  try {
    const response = await axios.get(
      `${BASE_URL}dashboard/stock-transfer-data`,
      {
        params: { period },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    throw error;
  }
};

export const getTransfersToSale = async () => {
  try {
    const response = await axios.get(`${BASE_URL}transfer/all/transferToSale`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    throw error;
  }
};

export const getRestocksFromSale = async () => {
  try {
    const response = await axios.get(`${BASE_URL}transfer/all/restockFromSale`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    throw error;
  }
};

export const updateProductQuantity = async (productId, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}product/update-quantity/${productId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
