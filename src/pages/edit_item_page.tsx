import {
  message,
  Form,
  Typography,
  Input,
  Select,
  Button,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { AuthContext } from "../components/AuthProvider";

const { Title } = Typography;

interface ItemIdParams {
  itemId: string;
}

export const EditItem = () => {
  const Auth = useContext(AuthContext);
  const authToken = Auth?.authToken;

  const history = useHistory();
  const { itemId } = useParams<ItemIdParams>();

  const [item, setItem] = useState<any>();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState<any>();

  const onDateSelect = (date: any) => {
    let formattedDate = moment(date._d).format("YYYY-MM-DD");
    setExpiryDate(formattedDate);
  };

  const headers = {
    accessToken: authToken,
  };

  const handleChange = (value: any) => {
    setCategory(value);
  };

  useEffect(() => {
    async function getItem() {
      let itemResp;

      try {
        itemResp = await axios.get(
          `http://localhost:8000/api/v1/items/show/${itemId}`,
          {
            headers: headers,
          }
        );

        console.log(itemResp.data);
        setItem(itemResp.data);
      } catch (err: any) {
        console.log(err);
        return message.error(err.message);
      }

      console.log(item);
    }
    getItem();
  }, [itemId]);

  const onFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:8000/api/v1/items/edit/${itemId}`,
        {
          name: name,
          category: category,
          description: description,
          itemUrl: itemUrl,
          expiryDate: expiryDate,
        },
        {
          headers: headers,
        }
      );
    } catch (err: any) {
      console.log(err);
      return message.error(err.message);
    }
    history.push(`/home`);
    return message.success(`Item successfully updated!`);
  };

  return (
    <div className="form">
      <Title level={2} id="header">
        Edit Item
      </Title>
      {item ? (
        <Form
          id="form"
          labelCol={{ span: 8 }}
          layout="horizontal"
          initialValues={{
            itemName: item.name,
            itemUrl: item.itemUrl,
            itemCategory: item.category,
            itemDescription: item.description,
            expiryDate: item.expiryDate,
          }}
        >
          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[
              {
                required: true,
                message: "Please input item name!",
              },
            ]}
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          {item.itemUrl ? (
            <Form.Item
              name="itemUrl"
              label={`Link to the item on your wishlist`}
              rules={[
                {
                  required: true,
                  message: "Please input item URL!",
                },
              ]}
            >
              <Input onChange={(e) => setItemUrl(e.target.value)} />
            </Form.Item>
          ) : (
            ""
          )}
          <Form.Item
            name="itemCategory"
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
            // item description form value dependent upon status
            label={
              item.imageUrl
                ? `Reason why you want the item`
                : `Please include a description of the item`
            }
            name="itemDescription"
            rules={[
              {
                required: true,
                message: "Required field!",
              },
            ]}
          >
            <Input onChange={(e) => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            tooltip="Item will be taken off the listing board after this date"
            label="Posting Expiry Date"
            name="expiryDate"
            rules={[
              {
                required: true,
                message: "Please input item posting expiry date!",
              },
            ]}
          >
            <></>
            <DatePicker format="DD-MM-YYYY" onChange={onDateSelect} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button onClick={(e) => onFormSubmit(e)} type="primary">
              Edit Item
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Title>Item not found!</Title>
      )}
    </div>
  );
};
