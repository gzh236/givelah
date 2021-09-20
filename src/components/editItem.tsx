import { message, Form, Typography, Input, Select, Button } from "antd";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { AuthContext } from "./AuthProvider";

const { Title } = Typography;

interface ItemIdParams {
  itemId: string;
}

export const EditItem = () => {
  const Auth = useContext(AuthContext);
  const itemId = useParams<ItemIdParams>();

  const [item, setItem] = useState();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    console.log(itemId);
    async function getItem() {
      let itemResp;

      try {
        itemResp = await axios.get(
          `http://localhost:8000/api/v1/items/edit/${itemId}`
        );
        console.log(itemResp);
      } catch (err: any) {
        console.log(err);
        return message.error(err.message);
      }
    }
    getItem();
  });

  const onFormSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="form">
      <Title level={2} id="header">
        Put an item on your wishlist!
      </Title>

      <Form id="form" labelCol={{ span: 4 }} layout="horizontal">
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
