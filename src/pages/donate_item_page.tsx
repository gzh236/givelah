import "../styles/donate_item_page.css";
import moment from "moment";

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
  DatePicker,
  message,
} from "antd";
import axios from "axios";

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

export const DonateItem = () => {
  // status of item = automatically 'For Donation' on this page
  // availability of item should be true at point of creation
  // need to add validation on how to prevent individuals from setting dates that have occurred in the past for the expiry

  // const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  // const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const history = useHistory();

  const onDateSelect = (date: any) => {
    let formattedDate = moment(date._d).format("YYYY-MM-DD");
    // let parsedDate = moment(formattedDate).toDate();
    console.log(formattedDate);
    setExpiryDate(formattedDate);
  };

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    let itemCreationResponse;

    try {
      itemCreationResponse = await axios.post(
        `http://localhost:8000/api/v1/items/create/user1`,
        {
          name: name,
          category: category,
          description: description,
          status: "For Donation",
          availability: true,
          expiryDate: expiryDate,
        }
      );
    } catch (err: any) {
      return message.error(err);
    }

    if (!itemCreationResponse.data) {
      return message.error(`Item creation failed!`);
    }

    let itemId = itemCreationResponse.data.id;

    // backend to send itemId; push to new route with itemId

    history.push(`/item-image/upload/${itemId}`);
    return message.success(`item created successfully!`);
  };

  return (
    <Row>
      <Col span={12} offset={6}>
        <Title level={2} id="header">
          Donate an item!
        </Title>
        <>
          <Form id="form" labelCol={{ span: 4 }} layout="horizontal">
            <Form.Item {...config} label="Item Name">
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item {...config} label="Item Description">
              <Input onChange={(e) => setDescription(e.target.value)} />
            </Form.Item>

            <Form.Item {...config} label="Item Category">
              <Select>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Educational"
                >
                  Educational
                </Select.Option>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Electronic Gadgets"
                >
                  Electronic Gadgets
                </Select.Option>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Entertainment"
                >
                  Entertainment
                </Select.Option>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Food"
                >
                  Food
                </Select.Option>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Lifestyle"
                >
                  Lifestyle
                </Select.Option>
                <Select.Option
                  onSelect={(e: any) => setCategory(e.target.value)}
                  value="Others"
                >
                  Others
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              {...config}
              tooltip="Item will be taken off the listing board after this date"
              label="Posting Expiry Date"
            >
              <DatePicker format="DD-MM-YYYY" onChange={onDateSelect} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={(e) => onFormSubmit(e)}
              >
                List Item
              </Button>
            </Form.Item>
          </Form>
        </>
      </Col>
    </Row>
  );
};
