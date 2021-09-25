import "../styles/user_donated_item_page.css";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";

import sadDog from "../images/sad_dog.jpg";
import wishlist from "../images/wishlist.png";

import { Row, Col, Typography, message, Card, Button, Image } from "antd";
import { CommentOutlined, EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Meta } = Card;

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
          `http://localhost:8000/api/v1/items/show/wishlist/items/${user}`,
          {
            headers: headers,
          }
        );

        console.log(res);
      } catch (err: any) {
        console.log(err);
        return;
      }

      if (!res) {
        return setItems("");
      }

      if (res?.data[0].userId === userId) {
        setIsAuthor(true);
      }

      setItems(res.data);
    }

    getWishlistItems();
  }, [user]);

  return (
    <div className="display-items">
      <Title level={2}>My Wishlist</Title>
      <Image height="250px" src={wishlist}></Image>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {items ? (
          items.map((item: any, index: number) => {
            return (
              <Col span={8}>
                <Card
                  className="card"
                  key={index}
                  hoverable
                  style={{ maxWidth: "40%" }}
                >
                  <Meta
                    key={index}
                    title={item.name}
                    description={` ${item.description}`}
                  />
                  {isAuthor ? (
                    <>
                      <Link to={`/items/edit/${item.id}`}>Edit</Link> | {""}
                      <Link to={`/items/${item.id}/my-chats/view`}>
                        View Chats
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button>
                        <CommentOutlined key="comment" />
                      </Button>
                      <Button>
                        <EyeOutlined key="view" />
                      </Button>
                    </>
                  )}
                </Card>
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
