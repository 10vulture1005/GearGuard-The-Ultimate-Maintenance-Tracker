import React from 'react';

const DataTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black bg-black text-white">
              {columns.map((col, index) => (
                <th key={index} className="p-4 text-left font-black uppercase tracking-wider whitespace-nowrap" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b-2 border-black last:border-b-0 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 font-bold text-gray-800 border-r-2 border-black last:border-r-0">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
