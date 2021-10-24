import "../styles/create_item.css";
import axios from "axios";

import { AuthContext } from "../components/AuthProvider";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import {
  Typography,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Image,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import share from "../images/share.jpg";

const { Title } = Typography;

const config = {
  rules: [
    {
      type: "object" as const,
      required: true,
      message: "Required field!",
    },
  ],
};

const URL = "https://givelah-be.web.app";

export const DonateItem = () => {
  // status of item = automatically 'For Donation' on this page
  // availability of item should be true at point of creation
  // need to add validation on how to prevent individuals from setting dates that have occurred in the past for the expiry

  const Auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [itemId, setItemId] = useState("");
  const [image, setImage] = useState("");
  const [itemCreated, setItemCreated] = useState(false);

  const history = useHistory();

  const headers = {
    accessToken: Auth?.authToken,
  };

  const handleChange = (value: string) => {
    setCategory(value);
  };

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    let itemCreationResponse;

    try {
      itemCreationResponse = await axios.post(
        `${URL}/api/v1/items/create/${Auth?.user}`,
        {
          name: name,
          category: category,
          description: description,
          status: "For Donation",
          availability: true,
        },
        { headers: headers }
      );
    } catch (err: any) {
      console.log(err);
      return message.error(err.message);
    }

    console.log(itemCreationResponse);

    if (!itemCreationResponse.data.id) {
      return message.error(`Item creation failed!`);
    }

    setItemId(itemCreationResponse.data.id);
    setItemCreated(true);

    // backend to send itemId; push to new route with itemId

    return message.success(`item created successfully!`);
  };

  const handleUploadImage = async (e: any) => {
    let uploadImage;

    const formData = new FormData();

    formData.append("file", image);

    try {
      uploadImage = await axios.post(
        `${URL}/api/v1/itemImages/upload/${itemId}`,
        formData,
        { headers: headers }
      );
    } catch (err: any) {
      console.log(err.message);
      return;
    }

    console.log(uploadImage);

    setItemCreated(false);
    history.push(`/`);
    return message.success(`Image uploaded`);
  };

  const handleUpload = (info: any) => {
    console.log(info.file);
    setImage(info.file);
  };

  return (
    <div className="main-body">
      <Title level={2} id="header">
        List an item to Givelah!
      </Title>
      <Image
        preview={false}
        src={share}
        style={{
          height: "360px",
          width: "360px",
          display: "block",
          margin: "auto",
        }}
      />
      <Form
        id="form"
        labelCol={{ span: 8 }}
        layout="horizontal"
        style={{ margin: "2.5%", minHeight: "100vh" }}
      >
        {!itemCreated ? (
          <>
            <Form.Item
              {...config}
              label="Item Name"
              required={true}
              messageVariables={{ message: "Required field" }}
            >
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item
              name="itemCategory"
              label="Item Category"
              required={true}
              messageVariables={{ message: "Required field" }}
            >
              <Select onChange={handleChange}>
                <Select.Option value="Educational">Educational</Select.Option>
                <Select.Option value="Electronic Gadgets">
                  Electronic Gadgets
                </Select.Option>
                <Select.Option value="Entertainment">
                  Entertainment
                </Select.Option>
                <Select.Option value="Food">Food</Select.Option>
                <Select.Option value="Lifestyle">Lifestyle</Select.Option>
                <Select.Option value="Others">Others</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              // item description form value dependent upon status
              label={`Please include a description of the item`}
              name="itemDescription"
              required={true}
              messageVariables={{ message: "Required field" }}
            >
              <Input onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>
            <Button
              style={{ marginLeft: "35%" }}
              onClick={(e) => onFormSubmit(e)}
            >
              Add Item
            </Button>
          </>
        ) : (
          <div id="upload-image">
            <Title level={3}>Upload an image for your item!</Title>

            <Upload maxCount={1} customRequest={handleUpload}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            <Button
              style={{ marginTop: "15px" }}
              onClick={(e) => handleUploadImage(e)}
            >
              Upload Image
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
