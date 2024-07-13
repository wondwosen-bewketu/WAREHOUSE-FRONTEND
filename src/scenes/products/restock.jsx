import { useState, useEffect } from "react";
import { restockProduct, fetchProducts, fetchSalesUsers } from "../../api/api";

const RestockProduct = () => {
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
    const warehouseId = localStorage.getItem("warehouse");
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

  const handleSalesUserSelect = (e) => {
    setFormData({ ...formData, salesUserId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (image) {
      data.append("stockTransferImage", image);
    }

    try {
      const response = await restockProduct(data);
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
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
      <h2 style={{ textAlign: "center", color: "#1591ea" }}>Restock Product</h2>
      <select
        name="productId"
        value={formData.productId}
        onChange={handleChange}
        style={selectStyle}
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
      />
      <select
        name="salesUserId"
        value={formData.salesUserId}
        onChange={handleSalesUserSelect}
        style={selectStyle}
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
      />
      <input
        type="text"
        name="stockTransferNumber"
        placeholder="Stock Transfer Number"
        value={formData.stockTransferNumber}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="file"
        name="stockTransferImage"
        onChange={handleFileChange}
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle} disabled={loading}>
        {loading ? "Loading..." : "Restock Product"}
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

export default RestockProduct;
