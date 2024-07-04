import React, { useEffect, useState } from "react";
import { getRestocksFromSale } from "../../api/api";
import "../../Styles/RestockFromSale.css";

const RestocksFromSale = () => {
  const [restocks, setRestocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestocks = async (page = 1) => {
    setLoading(true);
    try {
      const { restocksFromSale, totalPages } = await getRestocksFromSale(page);
      setRestocks(restocksFromSale);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching restocks from sale:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestocks(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Restocks from Sale</h2>
      <div className="responsive-table">
        <div className="table-header">
          <div>Product Name</div>
          <div>Quantity to Transfer</div>
          <div>Transfer Type</div>
          <div>Quantity on Sale</div>
          <div>Total Sold Price</div>
          <div>Stock Transfer Number</div>
          <div>Transferred By</div>
          <div>Remark</div>
        </div>
        {restocks.map((restock) => (
          <div className="table-row" key={restock._id}>
            <div>{restock.productId.name}</div>
            <div>{restock.quantityToTransfer}</div>
            <div>{restock.transferType}</div>
            <div>{restock.quantityOnSale}</div>
            <div>{restock.totalSoldPrice}</div>
            <div>{restock.stockTransferNumber}</div>
            <div>
              {restock.transferredBy ? restock.transferredBy.name : "N/A"}
            </div>
            <div>{restock.remark}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RestocksFromSale;
