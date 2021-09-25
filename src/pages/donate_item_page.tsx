import "../styles/donate_item_page.css";
import moment from "moment";
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
  DatePicker,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

moment().format();
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

const URL = `http://localhost:8000`;

export const DonateItem = () => {
  // status of item = automatically 'For Donation' on this page
  // availability of item should be true at point of creation
  // need to add validation on how to prevent individuals from setting dates that have occurred in the past for the expiry

  const Auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [itemId, setItemId] = useState("");
  const [image, setImage] = useState("");
  const [itemCreated, setItemCreated] = useState(false);

  const history = useHistory();

  const onDateSelect = (date: any) => {
    let formattedDate = moment(date._d).format("YYYY-MM-DD");
    // let parsedDate = moment(formattedDate).toDate();
    console.log(formattedDate);
    setExpiryDate(formattedDate);
  };

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
          expiryDate: expiryDate,
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
    <div className="body">
      <Title level={2} id="header">
        List an item for donation!
      </Title>
      <Form id="form" labelCol={{ span: 8 }} layout="horizontal">
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
            <Form.Item
              {...config}
              tooltip="Item will be taken off the listing board after this date"
              label="Posting Expiry Date"
              required={true}
              messageVariables={{ message: "Required field" }}
            >
              <DatePicker format="DD-MM-YYYY" onChange={onDateSelect} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={(e) => onFormSubmit(e)} type="primary">
                List Item
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            <Title style={{ marginTop: "30px", marginLeft: "30%" }} level={3}>
              Upload an image for your item!
            </Title>

            <div id="upload-image">
              <Form.Item
                required={true}
                messageVariables={{ message: "Required field" }}
                label="Upload Item Image"
              >
                <Upload maxCount={1} customRequest={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button onClick={(e) => handleUploadImage(e)} type="primary">
                  Upload Image
                </Button>
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
