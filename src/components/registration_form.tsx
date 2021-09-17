import "../styles/register_form.css";

import { useState, useContext } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { withRouter, useHistory } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",

  onChange(info: any) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const RegistrationForm = (props: any) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const Auth = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selfSummary, setSelfSummary] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onFinish = (values: string) => {
    console.log("Received values of form: ", values);
  };

  const handleFormSubmission = async (e: any) => {
    e.preventDefault();

    // let userRegisterResp;

    // try {
    //   userRegisterResp = await axios.post(
    //     "http://localhost:8000/api/v1/users/register",
    //     {
    //       firstName: firstName,
    //       lastName: lastName,
    //       username: username,
    //       email: email,
    //       selfSummary: selfSummary,
    //       photoUrl: photoUrl,
    //       password: password,
    //       confirmPassword: confirmPassword,
    //     }
    //   );
    // } catch (err: any) {
    //   return message.error(err.message);
    // }
    let userRegisterResp;

    try {
      userRegisterResp = await Auth?.register(
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword,
        selfSummary,
        photoUrl
      );
    } catch (err: any) {
      return message.error(`Registration Failed`);
    }

    if (!userRegisterResp) {
      return message.error(`Registration Failed`);
    }

    await axios.post(
      `http://localhost:8000/api/v1/address/create/${username}`,
      {
        streetAddresses: streetAddress,
        postalCode: postalCode,
        permission: false,
      }
    );

    message.success(`${username} successfully registered with Givelah!`);
    history.push("/login");
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      id="register-form"
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
        ]}
        hasFeedback
      >
        {" "}
        <Input onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="firstName"
        label="First Name"
        rules={[
          {
            required: true,
            message: "Please input your first name!",
          },
        ]}
        hasFeedback
      >
        {" "}
        <Input onChange={(e) => setFirstName(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[
          {
            required: true,
            message: "Please input your last name!",
          },
        ]}
        hasFeedback
      >
        {" "}
        <Input onChange={(e) => setLastName(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
        hasFeedback
      >
        <Input onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password onChange={(e) => setConfirmPassword(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="selfSummary"
        label="selfSummary"
        tooltip="Optional description about yourself. Include to share more about yourself and your background!"
      >
        <Input onChange={(e) => setSelfSummary(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="streetAddress"
        label="Street Address"
        tooltip="Include this to facilitate delivery of items. You may provide your address details later if you wish."
      >
        <Input onChange={(e) => setStreetAddress(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Postal Code"
        tooltip="Include this to facilitate delivery of items. You may provide your address details later if you wish."
      >
        <Input onChange={(e) => setPostalCode(e.target.value)} />
      </Form.Item>

      <Form.Item name="photoUrl" label="Profile Picture">
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          htmlType="submit"
          onClick={(e) => {
            handleFormSubmission(e);
          }}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(RegistrationForm);
