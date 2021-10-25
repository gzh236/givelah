import "../styles/view_items.css";

import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../components/AuthProvider";
import axios from "axios";

import sadDog from "../images/sad_dog.jpg";
import wishlist from "../images/wishlist.png";

import { Row, Col, Typography, Image } from "antd";
import { Link } from "react-router-dom";
import { ViewItemCard } from "../components/viewItem";

const { Title } = Typography;

const URL = "https://givelah-be.herokuapp.com";

export const UserWishlistItems = () => {
  const Auth = useContext(AuthContext);
  const user = Auth?.user;
  const userId = Auth?.userId;

  const [items, setItems] = useState<any>();
  const [isAuthor, setIsAuthor] = useState(false);

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    // retrieve from backend items that user has wishlisted
    async function getWishlistItems() {
      let res;

      try {
        res = await axios.get(
          `${URL}/api/v1/items/show/wishlist/items/${userId}`,
          {
            headers: headers,
          }
        );
        console.log(res.data);
        setItems(res.data);

        if (res.data.userId === userId) {
          setIsAuthor(true);
        }
      } catch (err: any) {
        console.log(err);
        return;
      }
    }

    getWishlistItems();
  }, [userId]);

  return (
    <div className="display-items">
      <Title level={2} style={{ paddingTop: "3%" }}>
        My Wishlist
      </Title>
      <Image height="250px" src={wishlist}></Image>

      <Row style={{ margin: "2%" }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {items ? (
          items.Items.map((item: any, index: number) => {
            return (
              <Col className="item-display" span={8}>
                <ViewItemCard
                  wishlist={true}
                  author={true}
                  item={item}
                  user={item}
                />
              </Col>
            );
          })
        ) : (
          <Title level={2}>
            {" "}
            <Image width="480" src={sadDog} alt="please give"></Image>
            <Link to={`/items/wishlist`}>
              No wishlisted items yet.. Click to list an item!
            </Link>
          </Title>
        )}
      </Row>
    </div>
  );
};
