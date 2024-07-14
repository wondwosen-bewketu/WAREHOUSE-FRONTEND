import { useState, useEffect } from "react";
import {
  transferProductToSales,
  fetchProducts,
  fetchSalesUsers,
} from "../../api/api";

const TransferProduct = () => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    warehouseId: "",
    salesUserId: "",
    location: "",
    stockTransferNumber: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [salesUsers, setSalesUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const salesUsersData = await fetchSalesUsers();
        setProducts(productsData);
        setSalesUsers(salesUsersData);
      } catch (error) {
        setMessage(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const warehouseId = parsedUser ? parsedUser.warehouse : null;

    if (warehouseId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        warehouseId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Check if all required fields are filled
    if (
      !formData.productId ||
      !formData.quantity ||
      !formData.salesUserId ||
      !formData.location ||
      !formData.stockTransferNumber
    ) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (image) {
      data.append("stockTransferImage", image);
    }

    // Log the FormData contents
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await transferProductToSales(data);
      setMessage(response.message);
    } catch (error) {
      console.error(
        "Error transferring product to sales:",
        error.response?.data || error.message
      );
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    maxWidth: "600px",
    margin: "auto",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
  };

  const buttonStyle = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#1591ea",
    color: "white",
    cursor: "pointer",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", color: "#1591ea" }}>
        Transfer Product
      </h2>
      <select
        name="productId"
        value={formData.productId}
        onChange={handleChange}
        style={selectStyle}
        required
      >
        <option value="" disabled>
          Select Product
        </option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <select
        name="salesUserId"
        value={formData.salesUserId}
        onChange={handleChange}
        style={selectStyle}
        required
      >
        <option value="" disabled>
          Select Sales User
        </option>
        {salesUsers.map((user) => (
          <option key={user._id} value={user._id}>
            {user.fullName}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <input
        type="text"
        name="stockTransferNumber"
        placeholder="Stock Transfer Number"
        value={formData.stockTransferNumber}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <input
        type="file"
        name="stockTransferImage"
        onChange={handleFileChange}
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle} disabled={loading}>
        {loading ? "Loading..." : "Transfer Product"}
      </button>
      {message && (
        <p
          style={{
            textAlign: "center",
            color: message.includes("successfully") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default TransferProduct;
