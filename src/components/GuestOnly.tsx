import React, { useContext } from "react";
import { Route, Redirect } from "react-router";
import { AuthContext } from "./AuthProvider";

export const GuestOnlyRoute: React.FC<{
  component: React.FC;
  path: string;
  exact: boolean;
}> = (props) => {
  const Auth = useContext(AuthContext);

  return Auth?.authToken ? (
    <Route path={props.path} exact={props.exact} component={props.component} />
  ) : (
    <Redirect to="/home" />
  );
};
