import "../styles/view_items.css";

import { Row, Col, message, Typography, Image } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

import sadDog from "../images/sad_dog.jpg";
import { ViewItemCard } from "../components/viewItem";

const { Title } = Typography;

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
      <Title style={{ paddingTop: "3%" }}>All User Donated Items</Title>
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
          <div id="no-items">
            <Image src={sadDog} />
            <Title>No items up for grabs yet...</Title>
          </div>
        )}
      </Row>
    </div>
  );
};
