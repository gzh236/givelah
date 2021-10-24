import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { Typography, Divider, Card, Button, message } from "antd";
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

const URL = "https://givelah-be.web.app";

export const ChatPage = () => {
  const Auth = useContext(AuthContext);
  const user = Auth!.user;
  const userId = Auth!.userId;
  const { chatId } = useParams<any>();

  const [isAuthor, setIsAuthor] = useState(false);
  const [itemId, setItemId] = useState("");
  const [item, setItem] = useState<any>();
  const [messages, setMessages] = useState<any>([]);
  const [textValue, setTextValue] = useState("");
  const [chatPartner, setChatPartner] = useState("");
  const [chatRoomDetails, setChatRoomDetails] = useState<DocumentData>();
  const [itemStillAvailable, setItemStillAvailable] = useState<boolean>();
  const [itemGiven, setItemGiven] = useState(false);

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
        if (userId.toString() !== id.toString()) {
          cpId = id;
          console.log(cpId);
        }
      });

      if (cpId) getChatPartner(cpId);
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
        setItemStillAvailable(itemDetails.data.availability);

        itemDetails.data.userId.toString() === userId
          ? setIsAuthor(true)
          : setIsAuthor(false);
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

  const giveItem = async () => {
    // make axios call to remove item from the availability
    let changeAvailabilityResponse;

    try {
      changeAvailabilityResponse = await axios.patch(
        `http://localhost:8000/api/v1/items/edit/availability/${itemId}`,
        {
          toggledChoice: false,
          chatPartner: chatPartner,
        },
        {
          headers: headers,
        }
      );

      if (!changeAvailabilityResponse) return;

      setItemStillAvailable(false);
      setItemGiven(true);

      console.log(`Success!`);

      return message.success(`Item reserved for ${chatPartner}!`);
    } catch (err: any) {
      console.log(err);
      return message.error(`Something went wrong!`);
    }
  };

  // add a interface to allow item owner to declare item as reserved
  // since we have itemDetails, we can get the itemOwner by comparing current user to itemOwner

  return (
    <>
      <div className="chat" style={{ minHeight: "100vh" }}>
        <Title style={{ paddingTop: "5%" }}>
          {item ? `Chat with ${chatPartner} for ${item.name}` : `Loading..`}
        </Title>
        <div>
          {isAuthor && itemStillAvailable ? (
            <Card
              hoverable
              style={{
                paddingTop: "2.5%",
                width: "300px",
                display: "block",
                margin: "auto",
              }}
              title={`Give this item to ${chatPartner}!`}
            >
              <Button onClick={giveItem}>Givelah!</Button>
            </Card>
          ) : (
            ""
          )}
          {itemGiven ? (
            <Title level={3}>{`Item given to ${chatPartner}`}</Title>
          ) : (
            ""
          )}
        </div>
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
          <Form style={{ paddingBottom: "70px" }} className="chat-form">
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
    </>
  );
};
