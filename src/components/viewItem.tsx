import { Button, Card } from "antd";
import placeholder from "../images/placeholder.png";
import wishlist from "../images/wishlist.jpeg";

const { Meta } = Card;
const URL = `http://localhost:8000/api/v1`;

// child component to be used in view item pages
// states, data to be passed in from the parent; i.e. the pages
// have to prep the data so that its easy to pass in
export const ViewItemCard = (props: any) => {
  return (
    <Card
      hoverable
      style={{ width: "50%", marginBottom: "10%" }}
      cover={
        !props.wishlist ? (
          <img
            alt={props.item.name}
            src={
              props.item.ItemImages[0]
                ? `${URL}/itemImages/${props.item.ItemImages[0].imageUrl}`
                : `${placeholder}`
            }
            style={{ height: "240px", width: "100%" }}
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
        description={`I want this item because: ${props.item.description}`}
      />
      {/* add a onClick to the button to handle the link to the chat maybe */}
      <Button style={{ margin: "15px" }}>Start Chat!</Button>
    </Card>
  );
};
