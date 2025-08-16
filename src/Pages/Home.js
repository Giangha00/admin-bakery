import { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

const Home = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const rs = await axios.get(
        "http://localhost:8888/api/get_all_orders.php"
      );
      const data = rs.data;
      console.log("Fetched orders:", data);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await axios.post("http://localhost:8888/api/update_status_order.php", {
        order_id: id,
        status: newStatus,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  console.log("Orders:", orders);

  return (
    <div className="home-container">
      <h1>Admin Control</h1>
      <p>Welcome to the admin dashboard!</p>
      <div className="order-container">
        <h2>Mangament Order</h2>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{new Date(o.created_at).toISOString().split("T")[0]}</td>
                  <td>{o.grand_total}</td>
                  <td>{o.status}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleChangeStatus(o.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
