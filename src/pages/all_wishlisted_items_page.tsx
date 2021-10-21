import "../styles/view_items.css";

import { Row, Col, Typography, Image } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

import wishlist from "../images/wishlist.png";
import sadDog from "../images/sad_dog.jpg";
import { ViewItemCard } from "../components/viewItem";

const { Title } = Typography;

export const AllWishlistedItems = () => {
  const Auth = useContext(AuthContext);
  const userId = Number(Auth?.userId);

  const [user, setUser] = useState<any>([]);

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    // get all items that are listed on wishlist

    const getWishlistedItems = async () => {
      let resp;

      try {
        resp = await axios.get(
          "http://localhost:8000/api/v1/items/view/listed/wishlist/all",
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        return `Error finding items`;
      }

      setUser(resp.data);
    };
    getWishlistedItems();
  }, []);

  return (
    <div id="page" style={{ paddingTop: "3%", minHeight: "100vh" }}>
      <Title>All Wishlisted Items</Title>
      <Image
        preview={false}
        style={{ height: "300px", marginBottom: "10%" }}
        src={`${wishlist}`}
      />

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {user ? (
          user.map((user: any, index: number) => {
            // need to iterate through the Items array for each user
            return user.Items.map((id: any) => {
              return (
                <Col className="item-display" span={8}>
                  <ViewItemCard
                    author={userId === id.userId ? true : false}
                    wishlist={true}
                    user={user}
                    item={id}
                    index={index}
                  />
                </Col>
              );
            });
          })
        ) : (
          <Title level={2}>
            <Image preview={false} src={sadDog} alt="please give"></Image>
            <Link to="/items/donate/">
              Nothing on your wishlist yet - add one now!
            </Link>
          </Title>
        )}
      </Row>
    </div>
  );
};
