import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { collection } from "../app/http/controllers";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const user = useSelector((state) => state?.auth?.value?.user);

  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loans, setLoans] = useState([]);
  const [navigation, setNavigation] = useState([]);

  useEffect(() => {
    setAuth(user);
  }, [user]);

  useEffect(() => {
    if (auth !== null && auth?.attributes !== null) {
      const { roles, wallet, loans, accounts } = auth?.attributes;

      setWallet(wallet);
      setLoans(loans);
      setAccounts(accounts);

      try {
        collection("modules")
          .then((res) => {
            const response = res.data.data;
            const accessible = response?.filter((mod) =>
              mod?.roles?.some((rle) => roles?.includes(rle))
            );
            setNavigation(accessible);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  return (
    <StateContext.Provider
      value={{ auth, navigation, wallet, loans, accounts }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
