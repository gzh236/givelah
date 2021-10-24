import "../styles/view_items.css";

import { Row, Col, message, Typography, Image } from "antd";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";

import { AuthContext } from "../components/AuthProvider";

import { firebaseDb } from "../firebase";

import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { ViewItemCard } from "../components/viewItem";

import sadDog from "../images/sad_dog.jpg";

const { Title } = Typography;

const URL = "https://givelah-be.web.app";

export const AllListedItems = () => {
  const Auth = useContext(AuthContext);
  const userId = Number(Auth?.userId);

  const history = useHistory();

  const [items, setItems] = useState<any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  const chatRef = collection(firebaseDb, "chatrooms");

  useEffect(() => {
    // get all items that are listed for donation
    const getListedItems = async () => {
      let resp;

      try {
        resp = await axios.get(`${URL}/api/v1/items/view/listed/all`, {
          headers: headers,
        });
        console.log(resp);
        if (resp.data.length < 1) {
          return;
        }

        setItems(resp.data);
      } catch (err: any) {
        console.log(err);
        return message.error(`Error occurred!`);
      }
    };
    getListedItems();
  }, []);

  const findChatId = async (
    itemId: string | Number,
    userId: string | Number,
    cpId: string | Number
  ) => {
    // this function to be ran with each rendering of the item; EDIT: run with start chat?
    // find chatId based on itemId, userId, cpId, if no existing id, create one
    // function to return one chatId for each item available (if !author)

    const chatQuery = query(
      chatRef,
      // have to somehow identify one of the users individually
      //
      where(`members`, "array-contains", userId),
      where("itemId", "==", itemId)
    );

    // return doc.id if chat exists
    // init new chat if does not exist
    let chatQueryResults: any;

    try {
      chatQueryResults = await getDocs(chatQuery);

      let chatId;
      chatQueryResults.forEach((doc: any) => {
        console.log(doc.id);
        chatId = doc.id;
      });

      if (!chatId) {
        const newChatId = await initNewChat(itemId, userId, cpId);
        return history.push(`/chat/${newChatId}`);
      }

      return history.push(`/chat/${chatId}`);
    } catch (err: any) {
      console.log(err);
      return message.error(`Server Error!`);
    }
  };

  const initNewChat = async (itemId: any, userId: any, cpId: any) => {
    let newChatId;
    newChatId = await addDoc(collection(firebaseDb, "chatrooms"), {
      itemId: itemId,
      members: [userId, cpId],
    });
    return newChatId.id;
  };

  return (
    <div id="page" style={{ minHeight: "100vh" }}>
      <Title style={{ paddingTop: "3%" }}>All User Donated Items</Title>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ marginTop: "3%" }}
      >
        {items ? (
          items.map((item: any, index: number) => {
            return item.availability ? (
              <Col className="item-display" span={8}>
                <ViewItemCard
                  currentUser={userId}
                  author={userId === item.userId ? true : false}
                  item={item}
                  index={index}
                  handleClick={findChatId}
                />
              </Col>
            ) : (
              ""
            );
          })
        ) : (
          <div id="no-items">
            <Image src={sadDog} style={{ display: "block", margin: "auto" }} />
            <Title>
              <Link to="/items/donate">
                No items up for grabs yet..List one to giveaway now!
              </Link>
            </Title>
          </div>
        )}
      </Row>
    </div>
  );
};
