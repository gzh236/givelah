import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { Typography, Divider } from "antd";
import { AuthContext } from "../components/AuthProvider";
import { firebaseDb } from "../firebase";
import {
  query,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  onSnapshot,
  orderBy,
  DocumentData,
  where,
  addDoc,
  serverTimestamp,
  limit,
} from "@firebase/firestore";
import axios from "axios";
import Form from "antd/lib/form/Form";

const { Title } = Typography;

export const ChatPage = () => {
  const Auth = useContext(AuthContext);
  const user = Auth!.user;
  const userId = Auth!.userId;
  const { chatId } = useParams<any>();
  const URL = `http://localhost:8000/api/v1`;

  const [itemId, setItemId] = useState("");
  const [item, setItem] = useState<any>();
  const [messages, setMessages] = useState<any>([]);
  const [textValue, setTextValue] = useState("");
  const [chatPartner, setChatPartner] = useState("");
  const [chatRoomDetails, setChatRoomDetails] = useState<DocumentData>();

  const headers = {
    accessToken: Auth?.authToken,
  };

  // get the chat details
  useEffect(() => {
    const getChatDetails = async (): Promise<void> => {
      const chatRef = collection(firebaseDb, "chatrooms");
      const q = query(chatRef, where("__name__", "==", chatId));

      const qRes = await getDocs(q);

      if (qRes.empty) {
        return;
      }

      qRes.forEach((doc: QueryDocumentSnapshot) => {
        console.log(doc.id, "=>", doc.data());
        setItemId(doc.data().itemId);
        setChatRoomDetails(doc.data());
      });
    };

    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  useEffect(() => {
    if (chatRoomDetails) {
      let cpId;

      chatRoomDetails.members.forEach((id: string) => {
        if (userId !== id) {
          cpId = id;
        }
      });

      if (cpId) getChatPartner(cpId);
      console.log(cpId);
    }
  }, [chatRoomDetails]);

  // get item details
  useEffect(() => {
    const getItemDetails = async (): Promise<void> => {
      let itemDetails;

      try {
        itemDetails = await axios.get(`${URL}/items/show/${itemId}`, {
          headers: headers,
        });
        setItem(itemDetails.data);
      } catch (err: any) {
        console.log(err);
        return;
      }
    };

    if (itemId) {
      getItemDetails();
    }
  }, [itemId]);

  const listenForMessages = () => {
    const msgRef = collection(firebaseDb, "chatrooms", chatId, "messages");
    const msgQuery = query(msgRef, orderBy("sentAt"), limit(50));
    const messageSnaps = onSnapshot(msgQuery, (doc) => {
      let msgs: any[] = [];
      doc.docs.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages([...msgs]);
      console.log(messages);
    });
  };

  // useEffect to listenForMessages - only needs to run once on first render
  useEffect(() => {
    if (chatId) {
      listenForMessages();
    }
  }, [chatId]);

  //   handle sending of message
  const sendMessage = async (e: any) => {
    e.preventDefault();

    let msgIdRef: any;
    msgIdRef = await addDoc(
      collection(firebaseDb, "chatrooms", chatId, "messages"),
      {
        senderName: user,
        recepientName: chatPartner,
        itemId: itemId,
        text: textValue,
        sentAt: serverTimestamp(),
      }
    );
    setTextValue("");
    console.log(`success, ${msgIdRef.id}`);
  };

  // func to get chat partner details
  const getChatPartner = async (chatPartnerId: any): Promise<void> => {
    let cp;

    try {
      cp = await axios.get(`${URL}/users/show/${chatPartnerId}`, {
        headers: headers,
      });
      console.log(cp.data);
      setChatPartner(cp.data.username);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat" style={{ minHeight: "100vh" }}>
      <Title style={{ paddingTop: "5%" }}>
        {item ? `Chat with ${chatPartner} for ${item.name}` : `Loading..`}
      </Title>
      {messages ? (
        messages.map((msg: any, index: number) => {
          return (
            <div className={user === msg.senderName ? `sent` : `received`}>
              <Divider key={`D${index}`}>{msg.senderName}</Divider>
              <p key={index}>{msg.text}</p>
            </div>
          );
        })
      ) : (
        <Title>{`No chats here yet.. Send one now!`}</Title>
      )}
      <div className="input" style={{ height: "20vh" }}>
        <Form style={{ paddingBottom: "5%" }} className="chat-form">
          <input
            className="chat-input"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter message here..."
          />

          <button type="submit" onClick={(e) => sendMessage(e)}>
            Send
          </button>
        </Form>
      </div>
    </div>
  );
};
