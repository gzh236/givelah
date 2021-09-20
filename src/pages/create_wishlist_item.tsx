import "../styles/donate_item_page.css";

import axios from "axios";

import { AuthContext } from "../components/AuthProvider";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Select,
  message,
} from "antd";

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

export const WishlistItem = () => {
  // status of item = automatically 'For Donation' on this page
  // availability of item should be true at point of creation
  // need to add validation on how to prevent individuals from setting dates that have occurred in the past for the expiry

  const Auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [itemUrl, setItemUrl] = useState("");

  const history = useHistory();

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    let itemCreationResponse;

    try {
      itemCreationResponse = await axios.post(
        `${URL}/api/v1/items/create/${Auth?.user}`,
        {
          name: name,
          category: category,
          itemUrl: itemUrl,
          description: description,
          status: "Wishlist Item",
          availability: true,
        }
      );
    } catch (err: any) {
      return message.error(err.message);
    }

    console.log(itemCreationResponse);

    if (!itemCreationResponse.data) {
      return message.error(`Item creation failed!`);
    }

    history.push("/home");
    return message.success(`item created successfully!`);
  };

  return (
    <div id="body">
      <Title level={2} id="header">
        Put an item on your wishlist!
      </Title>

      <Form id="form" labelCol={{ span: 4 }} layout="horizontal">
        <Form.Item
          {...config}
          label="Item Name"
          rules={[
            {
              required: true,
              message: "Please input item name!",
            },
          ]}
        >
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>

        <Form.Item
          {...config}
          label="Item URL"
          rules={[
            {
              required: true,
              message: "Please input item URL!",
            },
          ]}
        >
          <Input onChange={(e) => setItemUrl(e.target.value)} />
        </Form.Item>

        <Form.Item
          {...config}
          label="Item Category"
          rules={[
            {
              required: true,
              message: "Please input item category!",
            },
          ]}
        >
          <Select>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Educational"
            >
              Educational
            </Select.Option>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Electronic Gadgets"
            >
              Electronic Gadgets
            </Select.Option>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Entertainment"
            >
              Entertainment
            </Select.Option>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Food"
            >
              Food
            </Select.Option>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Lifestyle"
            >
              Lifestyle
            </Select.Option>
            <Select.Option
              onChange={(e: any) => setCategory(e.target.value)}
              value="Others"
            >
              Others
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          {...config}
          // item description form value, changed
          label="Reason why you want the item"
          rules={[
            {
              required: true,
              message:
                "Please include a brief description on why you want the item",
            },
          ]}
        >
          <Input onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button onClick={(e) => onFormSubmit(e)} type="primary">
            Wishlist Item
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
