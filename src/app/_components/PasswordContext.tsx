"use client";

import { type ReactNode, createContext, useState, useContext } from "react";

const PasswordContext = createContext<{
  password: string;
  updatePassword: (password: string) => void;
}>({
  password: "",
  updatePassword: () => {
    return;
  },
});

type Props = { children: ReactNode };
const PasswordProvider = ({ children }: Props) => {
  const [password, setPassword] = useState("");

  const updatePassword = (password: string) => {
    setPassword(password);
  };

  return (
    <PasswordContext.Provider value={{ password, updatePassword }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePassword = () => {
  return useContext(PasswordContext);
};

export default PasswordProvider;
