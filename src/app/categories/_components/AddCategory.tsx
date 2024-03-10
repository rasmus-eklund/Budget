"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
      <form className="bg-red" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <label htmlFor="name">Kategori</label>
          <input id="name" {...register("name")} />
        </div>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input {...register(`matches.${index}.name` as const)} />
            <button type="button" onClick={() => remove(index)}>
              Ta bort
            </button>
          </div>
        ))}
        <div>
          <button type="button" onClick={() => append({ name: "namn" })}>
            Lägg till
          </button>
          <button type="submit">Spara</button>
          <button onClick={() => setOpen(false)} type="button">
            Avbryt
          </button>
        </div>
      </form>
    );
  }
  return <button onClick={() => setOpen(true)}>Lägg till</button>;
};

export default AddCategory;
