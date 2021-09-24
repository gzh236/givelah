import React, { useContext } from "react";
import { Route, Redirect } from "react-router";
import { AuthContext } from "./AuthProvider";

export const AuthOnlyRoute: React.FC<{
  component: React.FC | any;
  path: string;
  exact: boolean;
}> = (props) => {
  const authToken = useContext(AuthContext)?.authToken;

  return authToken ? (
    <Route exact={props.exact} path={props.path} component={props.component} />
  ) : (
    <Redirect to="/login" />
  );
};
