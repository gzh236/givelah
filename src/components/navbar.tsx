import "../styles/navbar.css";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;

export function Navbar(this: any) {
  let [current, setCurrent] = useState("");

  const handleClick = (e: any) => {
    setCurrent(e.key);
  };

  return (
    <div>
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
        {/* introduce conditional rendering for this part */}
        <SubMenu
          key="user"
          title="My Profile"
          icon={<UserOutlined />}
        ></SubMenu>
        <Menu.Item key="login">
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item key="register">
          <Link to="/">Register</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}
