import "../styles/view_items.css";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";

import sadDog from "../images/sad_dog.jpg";

import { Row, Col, Typography, message, Image } from "antd";
import { ViewItemCard } from "../components/viewItem";

const { Title } = Typography;

export const UserDonatedItems = () => {
  const Auth = useContext(AuthContext);
  const userId = Auth?.userId;

  const [items, setItems] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  async function getItems() {
    let res;

    try {
      res = await axios.get(
        `http://localhost:8000/api/v1/items/show/donated/${userId}`,
        {
          headers: headers,
        }
      );

      setItems(res.data);
    } catch (err: any) {
      console.log(err);
      return message.error(`Oops Error!`);
    }
  }

  useEffect(() => {
    getItems();
    console.log(items);
  }, [userId]);

  return (
    <div
      className="display-items"
      style={{ paddingTop: "3%", minHeight: "100vh" }}
    >
      <Title key="title" level={2}>
        My Listed Items
      </Title>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ marginTop: "3%" }}
      >
        {items ? (
          items.map((item: any, index: number) => {
            return (
              <Col className="item-display" span={8}>
                <ViewItemCard item={item} index={index} />
              </Col>
            );
          })
        ) : (
          <Title level={2}>
            {" "}
            <Image
              style={{ width: "100%", maxHeight: "60%" }}
              src={sadDog}
              alt="please give"
            ></Image>
            <Link to="/items/donate/">
              You have not listed items yet.. Click to list an item now!
            </Link>
          </Title>
        )}
      </Row>
    </div>
  );
};
