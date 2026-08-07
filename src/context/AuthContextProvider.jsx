import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const AuthContextProvider = (props) => {
  const [login, setLogin] = useState(false);
  const [count, setCount] = useState(0);
  const [itemCounter, setItemCounter] = useState(0);

  return (
    <AuthContext.Provider
      value={{
        login,
        setLogin,
        count,
        setCount,
        itemCounter,
        setItemCounter,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
