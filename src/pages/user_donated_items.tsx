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
  const user = Auth?.user;
  const userId = Auth?.userId;

  const [isAuthor, setIsAuthor] = useState(false);
  const [items, setItems] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    console.log(userId);

    // retrieve from backend items that user has donated
    async function getItems() {
      let res;

      try {
        res = await axios.get(
          `http://localhost:8000/api/v1/items/show/donated/${user}`,
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        message.error(err.message);
      }
      console.log(res);

      if (res?.data.length < 1) {
        setItems("");
      }

      setItems(res?.data);

      if (res?.data[0].userId === userId) {
        setIsAuthor(true);
      }

      console.log(isAuthor);
    }

    getItems();
  }, []);

  return (
    <div className="display-items">
      <Title key="title" level={2} style={{ marginTop: "3%" }}>
        My Listed Items
      </Title>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ marginTop: "5%" }}
      >
        {items ? (
          items.map((item: any, index: number) => (
            <Col className="item-display" span={8}>
              <ViewItemCard item={item} index={index} />
            </Col>
          ))
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
        )}{" "}
      </Row>
    </div>
  );
};
