import "../styles/donate_item_page.css";

import { AuthContext } from "../components/AuthProvider";

import { useContext } from "react";
import { Row, Col, Typography } from "antd";

const { Title } = Typography;

export const DonateItem = () => {
  // const { user } = useContext(AuthContext);

  // create a form to upload item
  return (
    <Row>
      <Col span={12} offset={6}>
        <Title level={2} id="header">
          Add an item to donate!
        </Title>
      </Col>
    </Row>
  );
};
