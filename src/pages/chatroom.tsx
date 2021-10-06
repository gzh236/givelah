import "../styles/chat.css";

import {
  message,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Divider,
} from "antd";
import axios from "axios";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  collectionGroup,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firebaseDb } from "../firebase";
import { AuthContext } from "../components/AuthProvider";

const { Title } = Typography;
const { TextArea } = Input;

export const StartChat = () => {
  const Auth = useContext(AuthContext);
  const [messages, setMessages] = useState<any>([]);
  const [chatId, setChatId] = useState("");
  const [item, setItem] = useState("");
  const [isExistingChat, setIsExistingChat] = useState(false);

  //not needed, every new message should have its own doc
  // const [msgId, setMsgId] = useState("");

  const [infoLoaded, setInfoLoaded] = useState(false);
  const [text, setText] = useState("");
  const [cpusername, setCpusername] = useState("");

  const headers = {
    accessToken: Auth?.authToken,
  };

  let user: string | undefined = Auth?.user;
  let userId: string | undefined = Auth?.userId;
  let { itemId, chatPartnerId } = useParams<string | any>();

  const chatRef = collection(firebaseDb, "chatrooms");

  // get both item & user details
  useEffect(() => {
    chatPartnerId = String(chatPartnerId);

    // get item details
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

      // get user details
    };
    const getUserDetails = async () => {
      let chatPartnerDetails;

      try {
        chatPartnerDetails = await axios.get(
          `http://localhost:8000/api/v1/users/show/${chatPartnerId}`,
          {
            headers: headers,
          }
        );
      } catch (err: any) {
        console.log(err);
        return message.error(`Error finding item`);
      }

      console.log(chatPartnerDetails.data);
      setCpusername(chatPartnerDetails?.data.username);
      console.log(cpusername);
    };
    getUserDetails();
    getItemDetails();
  }, [itemId, chatPartnerId]);

  // get chatroom document id by itemId and membersId
  const chatQuery = query(
    chatRef,
    where(`members.itemOwner`, "==", cpusername),
    where(`members.interestedParty`, "==", user),
    where("itemId", "==", itemId)
  );

  // search firestore for chatroom with the 2 users;
  // return doc.id if exists
  // init new chat if does not exist
  const chatQuerySnapshot = async () => {
    let chatQueryResults: any;

    try {
      chatQueryResults = await getDocs(chatQuery);
    } catch (err: any) {
      console.log(err);
      return `Error whilst querying`;
    }
    setInfoLoaded(true);
    console.log(chatQueryResults);

    if (chatQueryResults.empty && infoLoaded) {
      console.log(`empty`);
      return initNewChat();
    }

    let cqr = chatQueryResults.docs;

    cqr.forEach((doc: any) => {
      console.log(doc.id);
      setChatId(doc.id);
      setIsExistingChat(true);
      setInfoLoaded(true);
      return;
    });
  };

  useEffect(() => {
    if (user && cpusername) {
      chatQuerySnapshot();
    }

    console.log(chatId);
  }, [user, cpusername, infoLoaded, isExistingChat]);

  const initNewChat = async () => {
    let newChatId;
    newChatId = await addDoc(collection(firebaseDb, "chatrooms"), {
      itemId: itemId,
      members: {
        itemOwner: cpusername,
        interestedParty: user,
      },
    });

    setChatId(newChatId.id);
    setIsExistingChat(true);
  };

  // snapshot to render new messages in chat room
  const listenForMessages = () => {
    const messageSnaps = onSnapshot(
      collection(firebaseDb, "chatrooms", chatId, "messages"),
      (doc) => {
        orderBy("sentAt");
        let msgs: any[] = [];
        doc.docs.forEach((doc) => {
          msgs.push(doc.data());
        });
        setMessages([...msgs]);
      }
    );
  };

  useEffect(() => {
    if (chatId && isExistingChat) {
      listenForMessages();
    }
  }, [chatId, isExistingChat]);

  console.log(messages);

  const handleSubmitInput = async (e: any) => {
    e.preventDefault();

    let msgIdRef: any;
    msgIdRef = await addDoc(
      collection(firebaseDb, "chatrooms", chatId, "messages"),
      {
        senderName: user,
        recepientName: cpusername,
        itemId: itemId,
        text: text,
        sentAt: serverTimestamp(),
      }
    );
    setText("");
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
      <Form>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter message here..."
        />

        <button type="submit" onClick={(e) => handleSubmitInput(e)}>
          🕊️
        </button>
      </Form>
    </div>
  );
};
