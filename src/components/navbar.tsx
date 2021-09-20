import "../styles/navbar.css";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "./AuthProvider";

const { SubMenu } = Menu;

export function Navbar() {
  const [current, setCurrent] = useState("");
  const Auth = useContext(AuthContext);
  const user = Auth?.user;

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      id="navbar"
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="homepage">
        <Link to="/home">Givelah</Link>
      </Menu.Item>

      <SubMenu key="item-categories" title="Item Categories">
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
        <Menu.Item key="setting:3">Option 3</Menu.Item>
        <Menu.Item key="setting:4">Option 4</Menu.Item>
      </SubMenu>

      <SubMenu
        key="user"
        title={user ? `${user}'s Profile` : `User Profile`}
        icon={<UserOutlined />}
      >
        {!Auth?.authToken ? (
          <>
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="register">
              <Link to="/">Register</Link>
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item key="my-items">
              <Link to={`/donated-items/${user}`}>My Listed Items</Link>
            </Menu.Item>
            <Menu.Item key="my-wishlist">
              <Link to={`/wishlist-items/${user}`}>My Wishlist</Link>
            </Menu.Item>
            <Menu.Item key="logout">
              <Link onClick={Auth?.logout} to="/">
                Logout
              </Link>
            </Menu.Item>
          </>
        )}
      </SubMenu>
    </Menu>
  );
}
