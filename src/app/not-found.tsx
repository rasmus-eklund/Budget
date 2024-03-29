import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div>
      <p>Sidan finns inte</p>
      <Link className="text-blue-500" href={"/month"}>
        Gå tillbaks till dina bankloggar.
      </Link>
    </div>
  );
};

export default NotFound;
