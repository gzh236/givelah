import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { message } from "antd";
import { getFirebaseInstance } from "../firebase";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";

interface AuthContextInterface {
  authToken: string;
  user: string;
  userId: string;
  firebaseToken: string;
  URL: string;

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
  const firebase = getFirebaseInstance();
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "firebaseToken",
  ]);
  const [isLoading] = useState(true);
  const [authToken, setAuthToken] = useState("");
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [firebaseToken, setFirebaseToken] = useState("");

  const URL = "https://givelah-be.herokuapp.com/";

  const auth = getAuth();

  useEffect(() => {
    if (cookies.accessToken) {
      setAuthToken(cookies.accessToken);
    }

    if (authToken) {
      try {
        const decoded: any = jwt_decode(authToken);
        setUser(decoded.username);
        setUserId(decoded.userId);
      } catch (err: any) {
        console.log(err);
        <Redirect to="/login" />;
        return message.error(`Server error!`);
      }
    }
  }, [cookies, authToken, firebase]);

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
    let resp;

    try {
      resp = await axios.post("http://localhost:8000/api/v1/users/register", {
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
      console.log(err);
      message.error(`Registration error!`);
      return false;
    }

    if (!resp) {
      message.error(`User registration failed!`);
      return false;
    }

    return true;
  };

  const login = async (username: string, password: string) => {
    let loginResponse: any;

    try {
      loginResponse = await axios.post(
        `http://localhost:8000/api/v1/users/login`,
        {
          username: username,
          password: password,
        }
      );
    } catch (err: any) {
      message.error(`Username or password is incorrect!`);
      return false;
    }

    let token = loginResponse.data.firebaseToken;

    signInWithCustomToken(auth, token)
      .then((userCredential: any) => {
        console.log(userCredential);
        setCookie("accessToken", loginResponse.data.accessToken);
        setCookie("firebaseToken", loginResponse.data.firebaseToken);
        setFirebaseToken(loginResponse.data.firebaseToken);
      })
      .catch((err: any) => {
        console.log(err);
        message.error(`Error signing in`);
      });

    return true;
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        removeCookie("firebaseToken");
        setFirebaseToken("");
      })
      .catch((err: any) => {
        return message.error(`Oops! Server error..`);
      });

    removeCookie("accessToken", { path: "/" });
    setAuthToken("");
    setUser("");
    <Redirect to="/" />;
    return message.success(`Successfully logged out`);
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        authToken,
        userId,
        firebaseToken,
        URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
