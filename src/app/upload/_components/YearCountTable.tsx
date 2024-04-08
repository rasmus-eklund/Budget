import React from "react";

interface TableProps {
  data: { year: number; count: number }[];
}

const YearCountTable = ({ data }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">År</th>
            <th className="px-4 py-2">Transaktioner</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map(({ count, year }, index) => (
            <tr key={`${index}_${year}`}>
              <td className="border px-4 py-2">{year}</td>
              <td className="border px-4 py-2">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YearCountTable;
