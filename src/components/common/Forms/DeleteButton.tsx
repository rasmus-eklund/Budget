"use client";
import { useFormStatus } from "react-dom";
import { ClipLoader } from "react-spinners";
import Icon from "~/lib/icons/Icon";

const DeleteButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <ClipLoader size={18} />
      ) : (
        <button>
          <Icon
            icon="delete"
            className="size-5 fill-black hover:scale-110 hover:fill-red"
          />
        </button>
      )}
    </>
  );
};

export default DeleteButton;
