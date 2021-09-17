import "../styles/home_page.css";
import giveNowImg from "../images/give_thanks.jpg";
import receive from "../images/receive.jpg";

import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";
import { Link } from "react-router-dom";

import { Row, Col, Typography, Card } from "antd";
import { GiftFilled, SearchOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Paragraph, Title } = Typography;

export const HomePage = () => {
  // const { user } = useContext(AuthContext);

  return (
    <Row className="half" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col className="column1" span={12}>
        <Card
          className="card"
          style={{ width: 450 }}
          cover={
            <img style={{ height: "290px" }} alt="give" src={giveNowImg} />
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
            title="Hi, <Placeholder>"
            description="Start giving your unused items a fresh breath of life today!"
          />
        </Card>
      </Col>
      <Col className="column2" span={12}>
        <Card
          className="card"
          style={{ width: 450 }}
          cover={
            <img style={{ height: "290px" }} alt="receive" src={receive} />
          }
          actions={[
            <Link to="/items/search/">
              <SearchOutlined key="give" style={{ fontSize: "30px" }} />
            </Link>,
          ]}
        >
          <Meta
            style={{ fontSize: "16px" }}
            title="Hi, <Placeholder>"
            description="Do you need an item? Search the Givelah community now!"
          />
        </Card>
      </Col>
    </Row>
  );
};
