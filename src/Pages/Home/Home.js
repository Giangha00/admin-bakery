import { useEffect, useState } from "react";
import { Table, Button, Tag, Select, Popconfirm, message } from "antd";
import axios from "axios";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({});

  const fetchOrders = async () => {
    try {
      const rs = await axios.get(
        "http://localhost:8888/api/get_all_orders.php"
      );
      setOrders(rs.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = (orderId, newStatus) => {
    setPendingStatus((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleConfirmChangeStatus = async (orderId) => {
    const newStatus =
      pendingStatus[orderId] ?? orders.find((o) => o.id === orderId)?.status;

    try {
      await axios.post(
        "http://localhost:8888/api/update_status_order.php",
        new URLSearchParams({
          order_id: orderId,
          status: newStatus,
        })
      );
      message.success("Status updated successfully!");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setPendingStatus((prev) => {
        const { [orderId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Lỗi khi cập nhật!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 180,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Grand Total",
      dataIndex: "grand_total",
      key: "grand_total",
      width: 150,
      render: (total) => <strong>${total}</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        let color =
          status === "Pending"
            ? "orange"
            : status === "Processing"
            ? "blue"
            : status === "Completed"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Change",
      key: "change",
      width: 180,
      render: (_, record) => (
        <Select
          value={pendingStatus[record.id] ?? record.status}
          style={{ width: "100%" }}
          onChange={(val) => handleChangeStatus(record.id, val)}
          options={[
            { value: "Pending", label: "Pending" },
            { value: "Processing", label: "Processing" },
            { value: "Completed", label: "Completed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 160,
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => handleConfirmChangeStatus(record.id)}
          >
            Confirm
          </Button>
          <Popconfirm
            title="Are you sure delete this order?"
            onConfirm={() => message.success(`Deleted order ${record.id}`)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Manage Order</h1>
      <Table
        rowKey="id"
        dataSource={orders}
        columns={columns}
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default Home;
