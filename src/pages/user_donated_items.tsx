import "../styles/user_donated_item_page.css";

import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import axios from "axios";

import sadDog from "../images/sad_dog.jpg";
import placeholder from "../images/placeholder.png";

import { Row, Col, Typography, message, Card, Image, Button } from "antd";

const { Title } = Typography;
const { Meta } = Card;

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
      <Title key="title" level={2}>
        My Listed Items
      </Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {items ? (
          items.map((item: any, index: number) => (
            <Col span={8}>
              <Card
                className="card"
                key={index}
                hoverable
                style={{ maxWidth: "50%" }}
                cover={
                  <img
                    key={index}
                    alt="example"
                    src={
                      item?.ItemImages[index]
                        ? `http://localhost:8000/api/v1/itemImages/${item?.ItemImages[index].imageUrl}`
                        : placeholder
                    }
                  />
                }
              >
                <Meta
                  key={index}
                  title={item.name}
                  description={` ${item.description}`}
                />
                <Link to={`/items/edit/${item.id}`}>Edit</Link>
              </Card>
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
              No listed items yet.. Click to list an item!
            </Link>
          </Title>
        )}{" "}
      </Row>
      )
    </div>
  );
};
