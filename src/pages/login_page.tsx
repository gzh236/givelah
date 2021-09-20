import "../styles/login_page.css";
import welcomeImage from "../images/welcome.jpg";

import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  message,
  Image,
} from "antd";
import { AuthContext } from "../components/AuthProvider";

const { Title } = Typography;

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const Auth = useContext(AuthContext);

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    let loginResponse;

    try {
      loginResponse = await Auth?.login(username, password);
    } catch (err) {
      return message.error(`Error signing in`);
    }

    if (!loginResponse) {
      return message.error(`Error signing in`);
    }

    history.push("/home");
    return message.success(`${username} successfully logged in`);
  };

  return (
    <Row id="main">
      <Col span={12}>
        <Typography>
          <Title level={2}>
            Welcome Back! <br /> Make a difference today!
          </Title>
        </Typography>
        <Image width={480} src={welcomeImage} />
      </Col>
      <Col span={12}>
        <Title level={2} className="header-text">
          Login to Givelah!
        </Title>

        <Form
          name="login"
          id="login-form"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 6 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input onChange={(e) => setUsername(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={(e) => onFormSubmit(e)}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
