import "./styles/antd.css";
import "./App.css";
import "react-chat-widget/lib/styles.css";

import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { LandingPage } from "./pages/landing_page";
import { HomePage } from "./pages/home_page";
import { LoginPage } from "./pages/login_page";
import AuthProvider from "./components/AuthProvider";
import { CookiesProvider } from "react-cookie";
import { GuestOnlyRoute } from "./components/GuestOnly";
import { AuthOnlyRoute } from "./components/AuthOnly";
import { DonateItem } from "./pages/donate_item_page";
import { UserDonatedItems } from "./pages/user_donated_items";
import { WishlistItem } from "./pages/create_wishlist_item";
import { UserWishlistItems } from "./pages/user_wishlist_items_page";
import { EditItem } from "./pages/edit_item_page";
import { AllListedItems } from "./pages/all_listed_items_page";
import { AllWishlistedItems } from "./pages/all_wishlisted_items_page";
import { ViewItem } from "./pages/view_item_page";
import { StartChat } from "./pages/chatroom";
import { ViewMyChats } from "./pages/view_user_item_chats";

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <GuestOnlyRoute exact path="/" component={LandingPage} />

              <GuestOnlyRoute exact path="/login" component={LoginPage} />

              <AuthOnlyRoute exact path="/home" component={HomePage} />

              <AuthOnlyRoute
                exact
                path="/items/donate"
                component={DonateItem}
              />

              <AuthOnlyRoute
                exact
                path="/items/wishlist"
                component={WishlistItem}
              />

              <AuthOnlyRoute
                exact
                path="/donated-items/:username"
                component={UserDonatedItems}
              />

              <AuthOnlyRoute
                exact
                path="/wishlist-items/:username"
                component={UserWishlistItems}
              />

              <AuthOnlyRoute
                exact
                path="/items/edit/:itemId"
                component={EditItem}
              />

              <AuthOnlyRoute
                exact
                path="/items/listed/all"
                component={AllListedItems}
              />

              <AuthOnlyRoute
                exact
                path="/items/wishlisted/all"
                component={AllWishlistedItems}
              />

              <AuthOnlyRoute
                exact
                path="/items/view/:itemId"
                component={ViewItem}
              />

              <AuthOnlyRoute
                exact
                path="/items/:itemId/chat/:chatPartnerId"
                component={StartChat}
              />

              <AuthOnlyRoute
                exact
                path="/items/:itemId/my-chats/view"
                component={ViewMyChats}
              />
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
