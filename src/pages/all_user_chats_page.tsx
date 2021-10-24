import "../styles/chat.css";

import { MouseEventHandler, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../components/AuthProvider";
import { firebaseDb } from "../firebase";
import { message, Typography, Row, Col, Card, Button } from "antd";

import { query, collection, getDocs, where } from "firebase/firestore";
import axios from "axios";

const { Title } = Typography;
const { Meta } = Card;
const URL = "https://givelah-be.web.app";

// find all the chatIds with the user in it
// sort the query by itemId

export const AllUserChats = () => {
  const Auth = useContext(AuthContext);
  let userId: Number = Number(Auth!.userId);

  const headers = {
    accessToken: Auth!.authToken,
  };

  const [chatInfo, setChatInfo] = useState<object[]>([]);
  const history = useHistory();

  const getUserChats = async () => {
    const chatRef = collection(firebaseDb, "chatrooms");
    const chatQuery = query(
      chatRef,
      where("members", "array-contains", userId)
    );

    let allChatInfo: object[] = [];

    try {
      const chatIds = await getDocs(chatQuery);

      if (chatIds.empty) {
        return message.info(`No chats yet!`);
      }
      chatIds.forEach(async (doc: any) => {
        let chatPartnerId: Number | null = null;
        let chatPartner;

        const itemDetails = await getItemDetails(doc.data().itemId);

        for (let i = 0; i < doc.data().members.length; i++) {
          if (userId !== doc.data().members[i]) {
            chatPartnerId = doc.data().members[i];
          }
        }

        chatPartner = await getChatPartnerDetails(chatPartnerId!);
        console.log(chatPartner);

        allChatInfo.push({
          chatId: doc.id,
          itemDetails: itemDetails,
          chatPartner: chatPartner,
        });

        setChatInfo([...allChatInfo]);
      });
    } catch (err: any) {
      console.log(err);
      return message.error(`Server Error!`);
    }
  };

  // to get chatids
  useEffect(() => {
    getUserChats();
  }, [userId]);

  // func to get item details
  const getItemDetails = async (itemId: string) => {
    let item;

    try {
      item = await axios.get(`${URL}/items/show/${itemId}`, {
        headers: headers,
      });
      return item.data;
    } catch (err: any) {
      console.log(err);
      return;
    }
  };

  // func to get chat partner details
  // abit tricky because how are we going to get the cp data?
  // perhaps via a forEach within the map method
  const getChatPartnerDetails = async (cpId: Number): Promise<any> => {
    let cp;

    try {
      cp = await axios.get(`${URL}/users/show/${cpId}`, {
        headers: headers,
      });
      return cp.data;
    } catch (err: any) {
      console.log(err);
      return;
    }
  };

  // handle a redirect to the chatId page
  const onButtonClick = (chatId: string): any => {
    history.push(`/chat/${chatId}`);
  };

  // failed one tab one chat - KIV for now, look to reinitiate this;
  // future refactor project perhaps

  // const listenForMessages = (chatId: string) => {
  //   let msgs: any[] = [];
  //   const msgRef = collection(firebaseDb, "chatrooms", chatId, "messages");
  //   const msgQuery = query(msgRef, orderBy("sentAt"), limit(50));
  //   const sub = onSnapshot(msgQuery, (doc) => {
  //     doc.docs.forEach((doc) => {
  //       msgs.push(doc.data());
  //     });
  //   });
  //   return msgs;
  // };

  // const getItemDetail = async (itemId: number) => {
  //   let itemDetails;

  //   try {
  //     itemDetails = await axios.get(`${URL}/items/show/${itemId}`, {
  //       headers: headers,
  //     });
  //     return itemDetails.data;
  //   } catch (err: any) {
  //     console.log(err);
  //     return message.error(`Server error encountered!`);
  //   }
  // };

  // const sendMessage = async (e: any, chatId: string) => {
  //   e.preventDefault();

  //   let msgIdRef: any;
  //   msgIdRef = await addDoc(
  //     collection(firebaseDb, "chatrooms", chatId, "messages"),
  //     {
  //       senderName: user,
  //       text: textValue,
  //       sentAt: serverTimestamp(),
  //     }
  //   );
  //   setTextValue("");
  //   return console.log(`success, ${msgIdRef.id}`);
  // };

  // const getUserDetails = async (id: Number): Promise<any> => {
  //   let userDetails;

  //   try {
  //     userDetails = await axios.get(`${URL}/users/show/${id}`, {
  //       headers: headers,
  //     });
  //     return userDetails.data;
  //   } catch (err: any) {
  //     console.log(err);
  //     return message.error(`Server error occurred!`);
  //   }
  // };

  // ui for chat;
  return (
    <div id="chat" style={{ minHeight: "100vh" }}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={24} style={{ marginTop: "1.75%", minHeight: "10vh" }}>
          <Title style={{ paddingTop: "1.25%", textAlign: "center" }}>
            My Chats
          </Title>
        </Col>
        {/* render all the chats here - for now as individial cards to each chat */}
        {chatInfo ? (
          chatInfo.map((chat: any, index: number) => {
            return (
              <Col span={8}>
                <Card
                  title={`Chat with ${chat.chatPartner.username} for ${chat.itemDetails.name}`}
                  key={index}
                  hoverable
                  style={{ width: "80%", margin: "5%" }}
                  cover={
                    <img
                      key={`image-${index}`}
                      style={{ height: "360px", width: "100%" }}
                      src={`${URL}/${chat.itemDetails.ItemImages[0].imageUrl}`}
                    />
                  }
                >
                  <Button onClick={() => onButtonClick(chat.chatId)}>
                    Chat Now!
                  </Button>
                </Card>
              </Col>
            );
          })
        ) : (
          <Title>No Chats yet!</Title>
        )}
      </Row>
    </div>
  );
};
