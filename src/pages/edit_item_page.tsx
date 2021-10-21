import { message, Form, Typography, Input, Select, Button, Image } from "antd";
import axios from "axios";
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

  const headers = {
    accessToken: authToken,
  };

  const handleChange = (value: string) => {
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

        setName(itemResp.data.name);
        setCategory(itemResp.data.category);
        setItemUrl(itemResp.data.itemUrl);
        setDescription(itemResp.data.description);
      } catch (err: any) {
        console.log(err);
        return message.error(err.message);
      }
    }
    getItem();
  }, [itemId]);

  const onFormSubmit = async (e: any): Promise<void> => {
    e.preventDefault();

    try {
      await axios.patch(
        `http://localhost:8000/api/v1/items/edit/${itemId}`,
        {
          name: name,
          category: category,
          description: description,
          itemUrl: itemUrl,
        },
        {
          headers: headers,
        }
      );
    } catch (err: any) {
      console.log(err);
      message.error(err.message);
      return;
    }
    history.push(`/home`);
    message.success(`Item successfully updated!`);
    return;
  };

  return (
    <div className="form" style={{ height: "100vh" }}>
      <Title level={2} id="header">
        Edit Item
      </Title>
      {item ? (
        <>
          <Image
            preview={false}
            style={{ height: "300px", width: "300px", margin: "15px" }}
            src={`http://localhost:8000/api/v1/itemImages/${item.ItemImages[0].imageUrl}`}
          />
          <Form
            id="form"
            labelCol={{ span: 8 }}
            layout="horizontal"
            initialValues={{
              itemName: item.name,
              itemUrl: item.itemUrl,
              itemCategory: item.category,
              itemDescription: item.description,
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
              <Select defaultValue={item.category} onChange={handleChange}>
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

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button onClick={(e) => onFormSubmit(e)}>Edit Item</Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Title>Item not found!</Title>
      )}
    </div>
  );
};
