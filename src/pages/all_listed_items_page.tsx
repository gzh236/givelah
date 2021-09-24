import { Row, Col, message, Typography, Card, Button, Image } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

import placeholder from "../images/placeholder.png";
import sadDog from "../images/sad_dog.jpg";

const { Title } = Typography;
const { Meta } = Card;

export const AllListedItems = () => {
  const Auth = useContext(AuthContext);
  const [items, setItems] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    // get all items that are listed for donation
    const getListedItems = async () => {
      let resp;

      try {
        resp = await axios.get(
          "http://localhost:8000/api/v1/items/view/listed/all",
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        return message.error(`Error occurred!`);
      }

      if (resp.data.length < 1) {
        setItems("");
        return;
      }

      console.log(resp);

      setItems(resp.data);
      console.log(items);
    };
    getListedItems();
  }, []);

  return (
    <div id="page">
      <Title>All Listed Items for Giveaway</Title>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {items ? (
          items.map((item: any, index: number) => (
            <Col span={8}>
              <Card
                className="card"
                key={index}
                hoverable
                cover={
                  <img
                    key={index}
                    alt="example"
                    src={
                      item.ItemImages[0]
                        ? `http://localhost:8000/api/v1/itemImages/${item.ItemImages[0].imageUrl}`
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

                <Button>
                  {" "}
                  <Link to={`/items/view/${item.id}`}>View</Link>
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <>
            <Image src={sadDog} />
            <Title>No listed items for Giveaway yet...</Title>
          </>
        )}
      </Row>
    </div>
  );
};
