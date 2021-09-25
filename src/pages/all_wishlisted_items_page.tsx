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

  const [user, setUser] = useState<any>([]);

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

      setUser(resp.data);
      console.log(user);
    };
    getWishlistedItems();
  }, []);

  return (
    <div id="page">
      <Title>All Wishlist Items</Title>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {user ? (
          user.map((user: any, index: number) => {
            return (
              <Col span={8}>
                <Card
                  className="card"
                  key={index}
                  hoverable
                  style={{ maxWidth: "50%" }}
                  cover={
                    <img
                      key={`i ${index}`}
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
                    key={`m${index}`}
                    title={`${user.username} wants a ${user.Items[0].name}!`}
                    description={`${user.username}'s wants ${user.Items[0].name} because: ${user.description}`}
                  />
                  <p>
                    View the {user.Items[0].name}{" "}
                    <a
                      href={user.Items[0].itemUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      here!
                    </a>
                  </p>

                  <>
                    <Button key={`B${index}`}>
                      <Link to={`/items/view/${user.Items[index].id}`}>
                        View
                      </Link>
                    </Button>
                  </>
                </Card>
              </Col>
            );
          })
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
