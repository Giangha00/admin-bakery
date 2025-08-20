import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Select,
  Popconfirm,
  message,
  Input,
  DatePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({});
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null); 

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
      message.error("Failed to update!");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const res = await axios.post(
        "http://localhost:8888/api/delete_order.php",
        new URLSearchParams({ order_id: orderId })
      );

      if (res.data.status) {
        message.success(`Deleted order ${orderId}`);
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
      } else {
        message.error(res.data.message || "Delete failed!");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Delete failed!");
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
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
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
          disabled={record.status === "Completed" || record.status === "Cancelled"}
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
            disabled={record.status === "Completed" || record.status === "Cancelled"}
          >
            Confirm
          </Button>
          <Popconfirm
            title="Are you sure delete this order?"
            onConfirm={() => handleDeleteOrder(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={record.status === "Completed" || record.status === "Cancelled"}
          >
            <Button 
              danger 
              size="small"
              disabled={record.status === "Completed" || record.status === "Cancelled"}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesId = idFilter ? String(order.id).includes(idFilter) : true;
    const matchesName = nameFilter
      ? order.customer_name.toLowerCase().includes(nameFilter.toLowerCase())
      : true;
    const matchesDate = dateFilter
      ? dayjs(order.created_at).format("YYYY-MM-DD") ===
        dayjs(dateFilter).format("YYYY-MM-DD")
      : true;
    return matchesStatus && matchesId && matchesName && matchesDate;
  });

  console.log("Filtered Orders:", filteredOrders);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Manage Order</h1>
      <div
        style={{ marginBottom: 20, display: "flex", gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <label style={{ marginRight: 8 }}>Status:</label>
          <Select
            value={statusFilter}
            style={{ width: 120 }}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Processing", label: "Processing" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "All", label: "All" },
            ]}
          />
        </div>
        <div>
          <label style={{ marginRight: 8 }}>ID:</label>
          <Input
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            placeholder="Enter ID"
            style={{ width: 120 }}
            allowClear
          />
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Customer:</label>
          <Input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Enter Name"
            style={{ width: 150 }}
            allowClear
          />
        </div>
        <div>
          <label style={{ marginRight: 8 }}>Created Date:</label>
          <DatePicker
            value={dateFilter}
            onChange={(date) => setDateFilter(date)}
            disabledDate={(current) => {
              if (!current) return false;
              const today = dayjs();
              const oneMonthAgo = today.subtract(1, "month");
              return (
                current.isAfter(today, "day") ||
                current.isBefore(oneMonthAgo, "day")
              );
            }}
            format="YYYY-MM-DD"
            placeholder="Select Date"
            style={{ width: 150 }}
            allowClear
          />
        </div>
      </div>
      <Table
        rowKey="id"
        dataSource={filteredOrders}
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