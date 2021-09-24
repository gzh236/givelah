import { Row, Col, message, Typography, Card, Button, Image } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

import wishlist from "../images/wishlist.jpeg";
import sadDog from "../images/sad_dog.jpg";

const { Title } = Typography;
const { Meta } = Card;

export const AllWishlistedItems = () => {
  const Auth = useContext(AuthContext);

  const [items, setItems] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    // get all items that are listed on wishlist
    // query by user model *REQUIRES CHANGE*
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

      setItems(resp.data);

      console.log(items);
    };
    getWishlistedItems();
  });

  return (
    <div id="page">
      <Title>All Wishlist Items</Title>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {!items ? (
          items.map((user: any, index: number) =>
            user[index].forEach((item: any) => (
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
                        user.photoUrl
                          ? `http://localhost:8000/api/v1/users/picture/${user.photoUrl}`
                          : wishlist
                      }
                    />
                  }
                >
                  <Meta
                    key={index}
                    title={`${user.username} wants a ${item.name}!`}
                    description={`${user.username}'s summary: ${user.selfSummary}`}
                  />
                  <p>
                    {user.username} needs/wants the {item.name} because:
                  </p>
                  <p>{item.description}</p>
                  <p>
                    View the {item.name}{" "}
                    <a href={item.itemUrl} target="_blank" rel="noreferrer">
                      here!
                    </a>
                  </p>

                  <>
                    <Button key={index}>
                      <Link to={`/items/view/${item.id}`}>View</Link>
                    </Button>
                  </>
                </Card>
              </Col>
            ))
          )
        ) : (
          <Title level={2}>
            <Image
              style={{ width: "100%", maxHeight: "60%" }}
              src={sadDog}
              alt="please give"
            ></Image>
            <Link to="/items/donate/">
              No listed items yet.. Click to list an item!
            </Link>
          </Title>
        )}
      </Row>
    </div>
  );
};
