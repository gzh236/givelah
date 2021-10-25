import { Button, Card } from "antd";
import { Link } from "react-router-dom";
import placeholder from "../images/placeholder.png";
import wishlist from "../images/wishlist.jpeg";

const { Meta } = Card;
const URL = "https://givelah-be.herokuapp.com";

export const ViewItemCard = (props: any) => {
  return (
    <Card
      hoverable
      style={{ width: "70%", marginBottom: "10%" }}
      cover={
        !props.wishlist ? (
          <img
            alt={props.item.name}
            src={
              props.item.ItemImages[0]
                ? `${URL}/itemImages/${props.item.ItemImages[0].imageUrl}`
                : `${placeholder}`
            }
            style={{ height: "360px", width: "100%" }}
          />
        ) : (
          <img
            alt={props.user.name}
            src={
              !props.author
                ? `${URL}/users/picture/${props.user.photoUrl}`
                : `${wishlist}`
            }
            style={{ height: "33%", width: "100%" }}
          />
        )
      }
    >
      <Meta
        title={props.item.name}
        description={
          props.wishlist
            ? `I want this item because: ${props.item.description}`
            : `Item Description: ${props.item.description}`
        }
      />
      {props.author ? (
        <>
          <Button style={{ margin: "15px" }}>
            <Link to={`/my-chats/all`}>{`Open Chats!`}</Link>
          </Button>
          <Button style={{ margin: "15px" }}>
            <Link to={`/items/edit/${props.item.id}`}>{`Edit Item!`}</Link>
          </Button>
        </>
      ) : (
        <Button
          onClick={() =>
            props.handleClick(
              props.item.id,
              props.currentUser,
              props.item.userId
            )
          }
          style={{ margin: "15px" }}
        >
          Start Chat!
        </Button>
      )}
    </Card>
  );
};
