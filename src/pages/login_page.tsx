import "../styles/login_page.css";

import { useState, useContext } from "react";
import { withRouter, useHistory } from "react-router-dom";

import { Row, Col, Typography, Form, Input, Button, message } from "antd";
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
    <Row>
      <Col span={12} offset={6}>
        <div className="login-page">
          <Title className="header-text">Login Page</Title>
          <div id="login-form">
            <Form
              name="login"
              id="login-form"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input onChange={(e) => setUsername(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={(e) => onFormSubmit(e)}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Col>
    </Row>
  );
};
