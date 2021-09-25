import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { firebaseDb } from "../firebase";
import { message, Typography, Row, Col, Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";

import chat from "../images/chat.png";

import {
  getDocs,
  collection,
  query,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const { Meta } = Card;

const { Title } = Typography;

// idea here is that user can go in to view his chat with others
// we do not init new chat dbs;
// instead get the chat id and info from firestore
// done via: userId, itemId --> returns all chats regarding this item user posted

export const AllUserChats = () => {
  const Auth = useContext(AuthContext);
  let user: string | undefined = Auth?.user;
  let userId: string | undefined = Auth?.userId;

  const headers = {
    accessToken: Auth?.authToken,
  };

  // const [messages, setMessages] = useState<any>([]);
  const [chatDocs, setChatDocs] = useState<any>([]);
  const [chatId, setChatId] = useState<any>([]);
  const [chatPartner, setChatPartner] = useState("");
  const [isAuthor, setIsAuthor] = useState("");
  const [item, setItem] = useState<any>();
  const [infoLoaded, setInfoLoaded] = useState(false);

  const chatRef = collection(firebaseDb, "chatrooms");

  const chatQuery1 = query(chatRef, where(`members.itemOwner`, "==", user));
  const chatQuery2 = query(
    chatRef,
    where(`members.interestedParty`, "==", user)
  );

  const chatQuerySnapshot = async () => {
    let chatQueryResults1: any;
    let chatQueryResults2: any;

    // snapshot to get chat id
    // (chatQueryResults = await onSnapshot(q, (doc) => {
    //   let chatIdArr: any[] = [];
    //   doc.docs.map((doc) => {
    //     chatIdArr.push(doc.data());
    //     setChatId([...chatIdArr]);
    //   });
    // })),
    try {
      chatQueryResults1 = await getDocs(chatQuery1);
    } catch (err: any) {
      console.log(err);
      return `Error encountered!`;
    }

    try {
      chatQueryResults2 = await getDocs(chatQuery2);
    } catch (err: any) {
      console.log(err);
      return `Error encountered!`;
    }

    // if no chatIds => return no chats currently
    if (chatQueryResults1.empty && chatQueryResults2.empty) {
      return message.info(`No chats for you yet!`);
    }

    let docArr1 = chatQueryResults1
      .docChanges()
      .map((element: any) => element.doc.data());
    let docArr2 = chatQueryResults2
      .docChanges()
      .map((element: any) => element.doc.data());

    let idArr1 = chatQueryResults1
      .docChanges()
      .map((element: any) => element.doc.id);
    let idArr2 = chatQueryResults2
      .docChanges()
      .map((element: any) => element.doc.id);

    let chatDocsArr: any[] = [...docArr1, ...docArr2];
    let chatIdArr: any[] = [...idArr1, ...idArr2];

    setChatDocs([...chatDocsArr]);

    setChatId([...chatIdArr]);

    setInfoLoaded(true);
  };

  useEffect(() => {
    if (user) {
      chatQuerySnapshot();
    }
  }, [user]);

  return (
    <div className="body">
      <Title>{`My Chats`}</Title>
      <Row>
        {chatDocs.length > 0 && chatId.length > 0 ? (
          chatDocs.map((doc: any, index: number) => {
            return chatId.map((id: any) => {
              return (
                <Col span={8} offset={4}>
                  <Card
                    style={{ width: 400, margin: "5%" }}
                    cover={<img alt="chat" src={chat} />}
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
          <Title>No chats yet for {item ? item.name : `...loading`}</Title>
        )}
      </Row>
    </div>
  );
};
