import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { Navbar } from "./components/navbar";
import { LandingPage } from "./pages/landing_page";
import { HomePage } from "./pages/home_page";
import { LoginPage } from "./pages/login_page";
import AuthProvider from "./components/AuthProvider";
import { CookiesProvider } from "react-cookie";
import { GuestOnlyRoute } from "./components/GuestOnly";
import { AuthOnlyRoute } from "./components/AuthOnly";
import { DonateItem } from "./pages/donate_item_page";

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/items/donate" component={DonateItem} />
              <Route exact path="/items/search" />
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
