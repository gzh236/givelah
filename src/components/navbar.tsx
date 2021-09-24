import "../styles/navbar.css";

import { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "./AuthProvider";

const { SubMenu } = Menu;

export function Navbar() {
  const Auth = useContext(AuthContext);
  const user = Auth?.user;

  return (
    <Menu id="navbar" mode="horizontal">
      <Menu.Item key="homepage">
        <Link to="/home">Givelah</Link>
      </Menu.Item>

      <SubMenu key="item-categories" title="Item Categories">
        <Menu.Item key="setting:1">
          <Link to="/items/listed/all">Items Listed for Donation</Link>
        </Menu.Item>
        <Menu.Item key="setting:2">
          {" "}
          <Link to="/items/wishlisted/all">Wishlisted Items</Link>
        </Menu.Item>
      </SubMenu>

      <Menu.Item key="chats">
        <Link to={`/chats/${user}`}>My Chats</Link>
      </Menu.Item>

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
