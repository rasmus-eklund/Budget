"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { datesSchema, type tDatesSchema } from "~/zodSchemas";

type Props = { onSubmit: (dates: tDatesSchema) => void };

const MonthForm = ({ onSubmit }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<tDatesSchema>({
    resolver: zodResolver(datesSchema),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="date" {...register("from")} />
      {errors.from && <p>{errors.from.message}</p>}
      <input type="date" {...register("to")} />
      {errors.to && <p>{errors.to.message}</p>}
      <button type="submit">Do it!</button>
    </form>
  );
};

export default MonthForm;
