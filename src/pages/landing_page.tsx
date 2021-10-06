import "../styles/landing_page.css";
import givingImg from "../images/give.jpg";

import { Row, Col, Typography } from "antd";
import { RegistrationForm } from "../components/registration_form";
const { Title, Paragraph, Text, Link } = Typography;

export function LandingPage() {
  return (
    <div className="landing-page">
      <Row>
        <Col span={12}>
          <div className="left-side">
            <Typography>
              <Title className="title">Givelah</Title>
              <Title level={2}>Sharing made Simple</Title>
              <Paragraph className="intro-text">
                <Text strong>
                  Givelah's mission is to make helping others simple. Unused
                  textbooks lying around? Old but functional phones wasting away
                  in a corner of your room? Give them to someone who needs them
                  more today!
                </Text>
                <img className="giving-img" src={givingImg} alt="giving" />
              </Paragraph>
            </Typography>
          </div>
        </Col>
        <Col span={12} id="right">
          <div id="register-form">
            <Title className="title">
              Be a part of the Givelah commmunity today!
            </Title>
            <Title className="register-form-title" level={2}>
              Registration Form
            </Title>
          </div>

          <div id="form">
            <RegistrationForm />
          </div>
          <Title id="sign-in-redirect" level={5}>
            Already a user? Sign in{" "}
            <Link id="sign-in-link" href="/login">
              here
            </Link>
          </Title>
        </Col>
      </Row>
    </div>
  );
}
