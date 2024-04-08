"use client";

import { useSession } from "next-auth/react";
import { type ReactNode, createContext, useState, useContext } from "react";
import PasswordForm from "./PasswordForm";

type ShowDialog = { open: boolean };
const PasswordContext = createContext<{
  password: string;
  showDialog: ({ open }: ShowDialog) => void;
}>({
  password: "",
  showDialog: () => {
    return;
  },
});

type Props = { children: ReactNode };
const PasswordProvider = ({ children }: Props) => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState("");

  const updatePassword = (newPassword: string) => {
    setPassword(newPassword);
    setOpen(false);
  };

  const showDialog = ({ open }: ShowDialog) => {
    setOpen(open);
  };

  return (
    <>
      {session && open ? <PasswordForm onSubmit={updatePassword} /> : null}
      <PasswordContext.Provider value={{ password, showDialog }}>
        {children}
      </PasswordContext.Provider>
    </>
  );
};

export const usePassword = () => {
  return useContext(PasswordContext);
};

export default PasswordProvider;
