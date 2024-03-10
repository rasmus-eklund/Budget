"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "~/app/_components/Button";
// import { api } from "~/trpc/react";
import { categorySchema, type tCategortSchema } from "~/zodSchemas";

const AddCategory = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control } = useForm<tCategortSchema>({
    resolver: zodResolver(categorySchema),
  });
  const { fields, append, remove } = useFieldArray({
    name: "matches",
    control,
  });
  const onSubmit = (data: tCategortSchema) => console.log(data);
  // const { mutate, isLoading } = api.categories.create.useMutation();
  if (open) {
    return (
      <form className="p-2 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <label htmlFor="name">Kategori</label>
          <input className="outline-none border-b border-b-red" id="name" {...register("name")} placeholder="Ny kategori" />
        </div>
        <h2>Matchande ord:</h2>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`matches.${index}.name` as const)} />
            <button type="button" onClick={() => remove(index)}>
              Ta bort
            </button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ name: "namn" })}>
          Lägg till
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(false)} type="button">
            Avbryt
          </Button>
          <Button callToAction type="submit">
            Spara
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div className="p-2">
      <Button callToAction onClick={() => setOpen(true)}>
        Lägg till
      </Button>
    </div>
  );
};

export default AddCategory;
