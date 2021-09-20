import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { message } from "antd";

interface AuthContextInterface {
  authToken: string;
  user: string;
  userId: number;

  register(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    selfSummary?: string,
    photoUrl?: string
  ): Promise<Boolean>;

  login(username: string, password: string): Promise<any>;

  logout(): void;
}

export const AuthContext = React.createContext<AuthContextInterface | null>(
  null
);

export default function AuthProvider({ children }: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [isLoading] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (cookies.accessToken) {
      setAuthToken(cookies["accessToken"]);
    }

    if (authToken) {
      const decoded: any = jwt_decode(authToken);

      setUser(decoded.username);
      setUserId(decoded.userId);
    }
  }, [cookies, authToken]);

  const register = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    selfSummary?: string,
    photoUrl?: string
  ) => {
    // need a firebase token, custom auth for chat db as well - TO BE ADDED;

    try {
      await axios.post("http://localhost:8000/api/v1/users/register", {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        selfSummary: selfSummary,
        photoUrl: photoUrl,
        password: password,
        confirmPassword: confirmPassword,
      });
    } catch (err: any) {
      return false;
    }

    return true;
  };

  const login = async (username: string, password: string) => {
    let loginResponse;

    try {
      loginResponse = await axios.post(
        `http://localhost:8000/api/v1/users/login`,
        {
          username: username,
          password: password,
        }
      );
    } catch (err: any) {
      return false;
    }

    setAuthToken(loginResponse.data);
    setUser(username);
    setCookie("accessToken", loginResponse.data);

    return true;
  };

  const logout = () => {
    setAuthToken("");
    removeCookie("accessToken");
    setUser("");
    <Redirect to="/" />;
    return message.success(`${user} successfully logged out`);
  };

  return (
    <AuthContext.Provider
      value={{ register, login, logout, user, authToken, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
}
