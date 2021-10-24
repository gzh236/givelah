import "../styles/donate_item_page.css";

import axios from "axios";

import { AuthContext } from "../components/AuthProvider";
import { useContext, useState } from "react";
import { useHistory } from "react-router";
import { Typography, Form, Input, Button, Select, message, Image } from "antd";
import wishlist from "../images/wishlist.png";

const { Title } = Typography;

const URL = "https://givelah-be.web.app";

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

  const headers = {
    accessToken: Auth?.authToken,
  };

  const handleChange = (value: string): void => {
    setCategory(value);

    console.log(category);
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
          itemUrl: itemUrl,
          description: description,
          status: "Wishlist Item",
          availability: true,
        },
        {
          headers: headers,
        }
      );
    } catch (err: any) {
      return message.error(`Error creating item!`);
    }

    console.log(itemCreationResponse);

    if (!itemCreationResponse.data) {
      return message.error(`Item creation failed!`);
    }

    history.push("/home");
    return message.success(`Item created successfully!`);
  };

  return (
    <div id="body" style={{ minHeight: "100vh" }}>
      <Title level={2} style={{ paddingTop: "3%" }} id="header">
        Put an item on your wishlist!
      </Title>
      <Image src={wishlist} style={{ height: "240px", marginBottom: "10%" }} />

      <Form id="form" labelCol={{ span: 8 }} layout="horizontal">
        <Form.Item
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
          label="Item Category"
          rules={[
            {
              required: true,
              message: "Please input item category!",
            },
          ]}
        >
          <Select onChange={handleChange}>
            <Select.Option value="Educational">Educational</Select.Option>
            <Select.Option value="Electronic Gadgets">
              Electronic Gadgets
            </Select.Option>
            <Select.Option value="Entertainment">Entertainment</Select.Option>
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Lifestyle">Lifestyle</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
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
          <Button onClick={(e) => onFormSubmit(e)}>Wishlist Item</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
