"use client";
import React from "react";
import PasswordForm from "../_components/PasswordForm";
import { usePassword } from "../_components/PasswordContext";
import { useRouter } from "next/navigation";

const Password = () => {
  const router = useRouter();
  const { updatePassword } = usePassword();
  const onSubmit = (password: string) => {
    updatePassword(password);
    router.push("/transactions");
  };
  return <PasswordForm onSubmit={onSubmit} />;
};

export default Password;
