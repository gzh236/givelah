import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { firebaseDb } from "../firebase";
import { message, Typography, Row, Col, Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";

import chat from "../images/chat.png";

import { getDocs, collection, query, where } from "firebase/firestore";

const { Meta } = Card;

const { Title } = Typography;

// idea here is that user can go in to view his chat with others
// we do not init new chat dbs;
// instead get the chat id and info from firestore
// done via: userId, itemId --> returns all chats regarding this item user posted
// listen via snapshot, init new message

export const ViewMyChats = () => {
  const Auth = useContext(AuthContext);
  let user: string | undefined = Auth?.user;
  let userId: string | undefined = Auth?.userId;
  const { itemId, chatPartnerId } = useParams<string | any>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  // const [messages, setMessages] = useState<any>([]);
  const [chatDocs, setChatDocs] = useState<any>([]);
  const [chatId, setChatId] = useState<any>([]);
  const [isExistingChat, setIsExistingChat] = useState(false);
  const [chatPartner, setChatPartner] = useState("");
  const [item, setItem] = useState<any>();
  const [infoLoaded, setInfoLoaded] = useState(false);

  // get itemDetails
  useEffect(() => {
    const getItemDetails = async () => {
      let getItemResp: any;

      try {
        getItemResp = await axios.get(
          `http://localhost:8000/api/v1/items/show/${itemId}`,
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        return message.error(`Error finding item`);
      }

      setItem(getItemResp?.data);
    };
    getItemDetails();
  }, [itemId]);

  const chatRef = collection(firebaseDb, "chatrooms");

  const q = query(
    collection(firebaseDb, "chatrooms"),
    where(`members.itemOwner`, "==", user),
    where("itemId", "==", itemId)
  );

  const chatQuery = query(
    chatRef,
    where(`members.itemOwner`, "==", user),
    where("itemId", "==", itemId)
  );

  const chatQuerySnapshot = async () => {
    let chatQueryResults: any;
    // snapshot to get chat id
    // (chatQueryResults = await onSnapshot(q, (doc) => {
    //   let chatIdArr: any[] = [];
    //   doc.docs.map((doc) => {
    //     chatIdArr.push(doc.data());
    //     setChatId([...chatIdArr]);
    //   });
    // })),
    try {
      chatQueryResults = await getDocs(chatQuery);
    } catch (err: any) {
      console.log(err);
      return `Error whilst querying`;
    }

    setInfoLoaded(true);

    // if no chatIds => return no chats currently
    if (chatQueryResults.empty && infoLoaded) {
      return message.info(`No chats for this item yet!`);
    }

    let chatDocsArr: any[] = [];
    let chatIdArr: any[] = [];

    console.log(chatQueryResults);

    chatQueryResults.docs.forEach((doc: any) => {
      chatDocsArr.push(doc.data());
      setChatDocs([...chatDocsArr]);

      chatIdArr.push(doc.id);
      setChatId([...chatIdArr]);

      setIsExistingChat(true);
      setInfoLoaded(true);
    });
  };

  useEffect(() => {
    if (user && itemId) {
      chatQuerySnapshot();
    }
    console.log(chatId);
  }, [user, itemId]);

  return (
    <div className="body">
      <Title>{`Chats for ${item ? item.name : `loading`}`}</Title>
      <Row>
        {chatDocs.length > 0 && chatId.length > 0 ? (
          chatDocs.map((doc: any, index: number) => {
            return chatId.map((id: any) => {
              return (
                <Col span={8} offset={4}>
                  <Card
                    style={{ width: 400, margin: "5%" }}
                    cover={<img alt="example" src={chat} />}
                    actions={[
                      <Link to={`/chat/${id}`}>
                        <MessageOutlined key="chat" />
                      </Link>,
                    ]}
                  >
                    <Meta
                      title={`Your chat with ${doc.members.interestedParty}`}
                      description="Click on the chat icon to open the chat!"
                    />
                  </Card>
                </Col>
              );
            });
          })
        ) : (
          <Title>No chats yet for {item ? item.name : `loading`}</Title>
        )}
      </Row>
    </div>
  );
};
