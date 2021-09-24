import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../components/AuthProvider";
import { firebaseDb } from "../firebase";
import { Divider, message, Typography } from "antd";
import { Tabs } from "antd";

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

const { Title } = Typography;
const { TabPane } = Tabs;

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

  const [messages, setMessages] = useState<any>([]);
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

  // get chatPartnerDetails
  useEffect(() => {
    const getCpDetails = async () => {
      let cpDetails;

      try {
        cpDetails = await axios.get(
          `http://localhost:8000/api/v1/users/show/${chatPartnerId}`,
          {
            headers: headers,
          }
        );
      } catch (err) {
        console.log(err);
        return message.error(`Error occurred!`);
      }
      setChatPartner(cpDetails.data);
    };
    getCpDetails();
  }, [chatPartnerId]);

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

    console.log(chatQueryResults);

    // if no chatIds => return no chats currently
    if (chatQueryResults.empty && infoLoaded) {
      return message.info(`No chats for this item yet!`);
    }

    let chatIdArr: any[] = [];

    chatQueryResults.docs.forEach((doc: any) => {
      chatIdArr.push(doc.data());
      setChatId([...chatIdArr]);
      console.log(chatId);
      setIsExistingChat(true);
      setInfoLoaded(true);
    });
  };

  useEffect(() => {
    if (user && itemId) {
      chatQuerySnapshot();
    }
  }, [user, itemId]);

  // somehow listen to different messages at different tabs;
  // different listeners for different chatIds
  // function ChatTab(chatId: string) {
  //   let msgs: any[];
  //   // listen for messages
  //   const listenForMessages = () => {
  //     const messageSnaps = onSnapshot(
  //       collection(firebaseDb, "chatrooms", chatId, "messages"),
  //       (doc) => {
  //         orderBy("sentAt");
  //         msgs = [];
  //         doc.docs.forEach((doc) => {
  //           msgs.push(doc.data());
  //         });
  //         // setMessages([...msgs]);
  //       }
  //     );
  //   };

  //   listenForMessages();

  //   return (

  //     <div className="msg">
  //       <Divider orientation="left">{msg.senderName}</Divider>
  //       <p>{}</p>
  //     </div>
  //   );
  // }

  // listen for messages
  // const listenForMessages = () => {
  //   const messageSnaps = onSnapshot(
  //     collection(firebaseDb, "chatrooms", chatId, "messages"),
  //     (doc) => {
  //       orderBy("sentAt");
  //       let msgs: any[] = [];
  //       doc.docs.forEach((doc) => {
  //         msgs.push(doc.data());
  //       });
  //       setMessages([...msgs]);
  //     }
  //   );
  // };

  return (
    <div className="main">
      <Title>{`Chats for ${item ? item.name : `loading`}`}</Title>
      {messages.length > 0 ? (
        <Tabs defaultActiveKey={"1"} type="card" size="large">
          <TabPane tab={item ? item.name : `loading`} key={1}>
            <div className={`message`}>
              <p>{`hello`}</p>
            </div>{" "}
          </TabPane>
        </Tabs>
      ) : (
        <Title>No chats yet for {item ? item.name : `loading`}</Title>
      )}
    </div>
  );
};
