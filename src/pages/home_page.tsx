import "../styles/home_page.css";
import giveNowImg from "../images/give_thanks.jpg";
import receive from "../images/receive.jpg";

import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";
import { Link } from "react-router-dom";

import { Row, Col, Typography, Card } from "antd";
import { GiftFilled, SearchOutlined, StarOutlined } from "@ant-design/icons";

import wishlist from "../images/wishlist.jpeg";

const { Meta } = Card;
const { Title } = Typography;

export const HomePage = () => {
  const Auth = useContext(AuthContext);

  return (
    <div id="body">
      <Title id="header">{`Welcome back, ${Auth?.user}!`}</Title>

      <Row className="half">
        <Col className="column2" span={8}>
          <Card
            className="card"
            cover={
              <img
                style={{ minHeight: "300px", maxHeight: "300px" }}
                alt="give"
                src={giveNowImg}
              />
            }
            actions={[
              <Link to="/items/donate/">
                {" "}
                <GiftFilled key="give" style={{ fontSize: "30px" }} />
              </Link>,
            ]}
          >
            <Meta
              style={{ fontSize: "16px" }}
              description="Start giving your unused items a fresh breath of life today!"
            />
          </Card>
        </Col>
        <Col className="column2" span={8}>
          <Card
            className="card"
            cover={
              <img
                style={{ minHeight: "300px", maxHeight: "300px" }}
                alt="wishlist"
                src={wishlist}
              />
            }
            actions={[
              <Link to="/items/wishlist">
                <StarOutlined key="give" style={{ fontSize: "30px" }} />
              </Link>,
            ]}
          >
            <Meta
              style={{ fontSize: "16px" }}
              description="Eyeing something that isn't listed yet? Add an item to your wishlist now!"
            />
          </Card>
        </Col>
        <Col className="column2" span={8}>
          <Card
            className="card"
            cover={
              <img
                style={{ minHeight: "300px", maxHeight: "300px" }}
                alt="receive"
                src={receive}
              />
            }
            actions={[
              <Link to="/items/search/">
                <SearchOutlined key="give" style={{ fontSize: "30px" }} />
              </Link>,
            ]}
          >
            <Meta
              style={{ fontSize: "16px" }}
              description="Do you need an item? Search the Givelah community now!"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
