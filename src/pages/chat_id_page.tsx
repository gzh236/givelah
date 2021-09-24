import "../styles/chat.css";
import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { Card, Button, Typography, message, Divider } from "antd";
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
} from "@firebase/firestore";
import axios from "axios";
import Form from "antd/lib/form/Form";

const { Title } = Typography;

export const ChatPage = () => {
  const Auth = useContext(AuthContext);
  const user = Auth?.user;
  const userId = Auth?.userId;
  const { chatId } = useParams<any>();
  const URL = `http://localhost:8000`;

  const [itemId, setItemId] = useState("");
  const [item, setItem] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [isAuthor, setIsAuthor] = useState(false);
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
    console.log(itemId);
    return;
  }, [chatId]);

  // get item details
  useEffect(() => {
    const getItemDetails = async (): Promise<void> => {
      let itemDetails;

      try {
        itemDetails = await axios.get(`${URL}/api/v1/items/show/${itemId}`, {
          headers: headers,
        });
      } catch (err) {
        console.log(err);
        return message.error(`Error occurred!`);
      }
      console.log(`item details: ${itemDetails.data}`);
      setItem(itemDetails.data);
    };

    if (itemId) {
      getItemDetails();
    }

    return;
  }, [itemId]);

  // check if user is author of item
  useEffect(() => {
    console.log(chatRoomDetails);
    if (user === chatRoomDetails?.members.itemOwner) {
      setIsAuthor(true);
    }

    if (isAuthor) {
      setChatPartner(chatRoomDetails?.members.interestedParty);
    }
  }, [chatRoomDetails, isAuthor]);

  // snapshot to get messages
  const listenForMessages = (): void => {
    const messageSnaps = onSnapshot(
      collection(firebaseDb, "chatrooms", chatId, "messages"),

      (doc) => {
        let msgs: any[] = [];
        doc.docs.forEach((doc) => {
          orderBy("name");
          msgs.push(doc.data());
          console.log(msgs);
        });
        setMessages([...msgs]);
      }
    );
  };

  // useEffect to init listenForMessages
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

  return (
    <div className="chat">
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
      <Form className="chat-form">
        <input
          className="chat-input"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Enter message here..."
        />

        <button type="submit" onClick={(e) => sendMessage(e)}>
          🕊️
        </button>
      </Form>
    </div>
  );
};
