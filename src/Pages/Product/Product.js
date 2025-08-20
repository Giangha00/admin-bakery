import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Image,
  Space,
  Input,
  DatePicker,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import InsertModal from "../../Components/InsertModal/InsertModal";
import EditModal from "../../Components/EditModal/EditModal";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormValues, setEditFormValues] = useState({});
  const [editProductId, setEditProductId] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    type: "",
    description: "",
    qty: "",
    thumbnail: "",
    images: [],
    ingredients: [],
    price: "",
    category_id: "1", // mặc định = 1
  });

  const fetchProducts = async () => {
    try {
      const rs = await axios.get("http://localhost:8888/api/products.php");
      const data = rs.data.data;
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    // filter theo searchText
    if (searchText.trim()) {
      const lowerValue = searchText.trim().toLowerCase();
      tempProducts = tempProducts.filter((item) => {
        const createdDate = new Date(item.created_at)
          .toISOString()
          .split("T")[0];
        const idMatch = item.id.toString() === searchText.trim();
        const nameMatch = item.name.toLowerCase().includes(lowerValue);
        const typeMatch = item.type.toLowerCase().includes(lowerValue);
        const dateMatch = createdDate.includes(searchText.trim());
        return idMatch || nameMatch || typeMatch || dateMatch;
      });
    }

    if (filterDate) {
      const selectedDate = filterDate.format("YYYY-MM-DD");
      tempProducts = tempProducts.filter((item) => {
        const createdDate = new Date(item.created_at)
          .toISOString()
          .split("T")[0];
        return createdDate === selectedDate;
      });
    }

    setFilteredProducts(tempProducts);
  }, [products, searchText, filterDate]);

  const handleDelete = async (id) => {
    try {
      const rs = await axios.post(
        "http://localhost:8888/api/delete_product.php",
        { id }
      );
      if (rs.data.status) {
        console.log("Delete success:", rs.data);
        fetchProducts();
      } else {
        console.error("Delete failed:", rs.data.message);
        alert("Delete failed: " + rs.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product: " + error.message);
    }
  };

  const handleAddProduct = () => {
    setShowModal(true);
    setFormValues({
      name: "",
      type: "",
      description: "",
      qty: "",
      thumbnail: "",
      images: [],
      ingredients: [],
      price: "",
      category_id: "1",
    });
  };

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "type", label: "Type", type: "text", required: true },
    { name: "description", label: "Description", type: "text" },
    { name: "qty", label: "Quantity", type: "number", required: true },
    { name: "thumbnail", label: "Thumbnail URL", type: "text", required: true },
    {
      name: "images",
      label: "Images (JSON Array)",
      type: "text",
      required: true,
    },
    {
      name: "ingredients",
      label: "Ingredients (JSON Array)",
      type: "text",
    },
    { name: "price", label: "Price", type: "number", required: true },
    {
      name: "category_id",
      label: "Category ID",
      type: "number",
      required: true,
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Create Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Update Date",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => new Date(date).toISOString().split("T")[0],
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => `$${value}`,
    },
    {
      title: "Category ID",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: "Ingredients",
      dataIndex: "ingredients",
      key: "ingredients",
      render: (val) => {
        try {
          const arr = typeof val === "string" ? JSON.parse(val) : val;
          if (!Array.isArray(arr)) return val;
          return arr.join(", ");
        } catch {
          return val;
        }
      },
    },

    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (url) => (
        <Image
          src={url}
          alt="thumbnail"
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: 6 }}
        />
      ),
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (imgs) => {
        try {
          const arr = typeof imgs === "string" ? JSON.parse(imgs) : imgs;
          if (!Array.isArray(arr)) return null;
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
                maxWidth: 150,
              }}
            >
              {arr.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`img-${i}`}
                  width={70}
                  height={70}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              ))}
            </div>
          );
        } catch {
          return null;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEditClick(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Are you sure delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const addProduct = async (productData) => {
    try {
      const rs = await axios.post(
        "http://localhost:8888/api/insert_product.php",
        productData
      );
      if (rs.data.status) {
        console.log("Insert success:", rs.data);
        fetchProducts();
        setShowModal(false);
      } else {
        console.error("Insert failed:", rs.data.message);
        alert("Insert failed: " + rs.data.message);
      }
    } catch (error) {
      console.error("Error inserting product:", error);
      alert("Error inserting product: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    console.log("👉 Submit called", formValues);

    const payload = {
      ...formValues,
      images: formValues.images,
      ingredients: formValues.ingredients,
    };

    addProduct(payload);
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    setSearchText(trimmedValue);

    if (!trimmedValue) {
      setFilteredProducts(products);
      return;
    }

    const lowerValue = trimmedValue.toLowerCase();

    const filtered = products.filter((item) => {
      const createdDate = new Date(item.created_at).toISOString().split("T")[0];

      const idMatch = item.id.includes(trimmedValue);

      const nameMatch = item.name.toLowerCase().includes(lowerValue);
      const typeMatch = item.type.toLowerCase().includes(lowerValue);

      const dateMatch = createdDate.includes(trimmedValue);

      return idMatch || nameMatch || typeMatch || dateMatch;
    });

    setFilteredProducts(filtered);
  };

  const handleEditClick = (product) => {
    setEditFormValues(product);
    setEditProductId(product.id);
    setEditModalVisible(true);
  };

  const handleUpdated = () => {
    fetchProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Manage Products</h1>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space size={8}>
          <Input.Search
            placeholder="Search by ID, Name, Type, or Created Date"
            allowClear
            enterButton="Search"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />

          <DatePicker
            value={filterDate}
            onChange={(date) => setFilterDate(date)}
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
            placeholder="Filter by Created Date"
          />
        </Space>

        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <Button type="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </div>
      </Space>

      <Table
        rowKey="id"
        dataSource={filteredProducts}
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

      <InsertModal
        show={showModal}
        title="Add Product"
        fields={fields}
        values={formValues}
        onChange={(e) =>
          setFormValues({ ...formValues, [e.target.name]: e.target.value })
        }
        onSubmit={handleSubmit}
        onClose={() => setShowModal(false)}
      />

      <EditModal
        show={editModalVisible}
        title="Edit Product"
        fields={fields}
        values={editFormValues}
        onChange={(e) =>
          setEditFormValues({
            ...editFormValues,
            [e.target.name]: e.target.value,
          })
        }
        onClose={() => setEditModalVisible(false)}
        productId={editProductId}
        onUpdated={handleUpdated} // 🔥 phải có
      />
    </div>
  );
};

export default Product;
