import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();

  const items = [
    {
      key: "/",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/">Manage Order</Link>,
    },
    {
      key: "/products",
      icon: <AppstoreOutlined />,
      label: <Link to="/products">Manage Product</Link>,
    },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "#001529",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: 18,
          marginRight: 40,
        }}
      >
        Admin Panel
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
        style={{ flex: 1 }}
      />
    </Header>
  );
};

export default Navbar;
