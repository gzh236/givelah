// allow users to view and initiate chat
// author of items can edit and check chats related to item

import {
  message,
  Typography,
  Card,
  Descriptions,
  Row,
  Col,
  Spin,
  Avatar,
  Image,
  Button,
} from "antd";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import wishlist from "../images/wishlist.jpeg";
import { LoadingOutlined } from "@ant-design/icons";
import placeholder from "../images/placeholder.png";

const { Title } = Typography;
const { Meta } = Card;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface ItemIdParams {
  itemId: string;
}

export const ViewItem = () => {
  const Auth = useContext(AuthContext);
  const { itemId } = useParams<ItemIdParams>();

  const [item, setItem] = useState<any>();
  const [isAuthor, setIsAuthor] = useState(false);
  const [user, setUser] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  useEffect(() => {
    async function getItemDetails() {
      let getDetailsResp;

      try {
        getDetailsResp = await axios.get(
          `http://localhost:8000/api/v1/items/show/${itemId}`,
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        return false;
      }
      console.log(getDetailsResp.data);
      setItem(getDetailsResp.data);
    }
    getItemDetails();

    async function getUserDetails() {
      let userDetails;

      try {
        userDetails = await axios.get(
          `http://localhost:8000/api/v1/users/show/${item?.userId}`,
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        return false;
      }
      console.log(userDetails);
      setUser(userDetails.data);
    }

    getUserDetails();

    if (Auth?.userId === item?.userId) {
      setIsAuthor(true);
    }
  }, [itemId, item?.userId]);

  return (
    <div className="body">
      <Title>{item?.name ? item.name : `Fetching Item`}</Title>
      {/* render user card side by side with the item card */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          {/* insert card on top of user info */}
          {item ? (
            <Card
              className="card"
              hoverable
              style={{ maxWidth: "50%" }}
              cover={
                <img
                  alt="example"
                  src={
                    item.ItemImages[0]
                      ? `http://localhost:8000/api/v1/itemImages/${item.ItemImages[0].imageUrl}`
                      : wishlist
                  }
                />
              }
            >
              <Meta title={item?.name} description={` ${item?.description}`} />
            </Card>
          ) : (
            <Spin indicator={antIcon} />
          )}
        </Col>
        <Col
          span={12}
          style={{
            marginTop: "15%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Descriptions title="User Info" bordered>
            <Descriptions.Item label="Profile Picture">
              <Avatar size={150} shape="square">
                <Image
                  style={{ backgroundImage: "cover" }}
                  src={
                    user?.photoUrl
                      ? `http://localhost:8000/api/v1/users/picture/${user.photoUrl}`
                      : placeholder
                  }
                />
              </Avatar>
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {`${user?.username}`}
            </Descriptions.Item>
            <Descriptions.Item label="Self Summary">{`${user?.selfSummary}`}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Button>
        <Link
          to={
            !isAuthor
              ? `/items/${itemId}/chat/${item?.userId}`
              : `/items/${itemId}/my-chats/view`
          }
        >
          {isAuthor ? `View Chat` : `Start Chat!`}
        </Link>
      </Button>
    </div>
  );
};
