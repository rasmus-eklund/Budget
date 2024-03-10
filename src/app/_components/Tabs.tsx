"use client";

import { useState } from "react";

type Props = { tabs: { name: string; tab: React.ReactNode }[] };

const Tabs = ({ tabs }: Props) => {
  const [openTab, setOpenTab] = useState(0);
  return (
    <div className="flex grow flex-col">
      <nav className="flex">
        {tabs.map((tab, n) => (
          <button
            className={`${
              n === openTab ? "bg-red text-white" : "bg-white text-black"
            } rounded-t-md px-4 py-2`}
            key={tab.name}
            onClick={() => setOpenTab(n)}
          >
            {tab.name}
          </button>
        ))}
      </nav>
      <div className="grow bg-white">{tabs[openTab]?.tab}</div>
    </div>
  );
};

export default Tabs;