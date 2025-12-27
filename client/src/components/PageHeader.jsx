import React from 'react';

const PageHeader = ({ title, onSearch, onNew }) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <button 
            className="rounded-lg border-2 border-black bg-black text-white px-6 py-2 font-bold transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
            onClick={onNew}
          >
            NEW
          </button>
          <h1 className="text-3xl font-black tracking-tighter uppercase">{title}</h1>
        </div>
        <div className="relative w-80">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full rounded-lg border-2 border-black p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4">
        {/* Mock controls for Sort/Filter/Group By as seen in Odoo */}
        <div className="flex items-center gap-2 cursor-pointer text-gray-500 font-bold hover:text-black transition-colors">
          <span>Filters</span>
          <span className="text-xs">▼</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer text-gray-500 font-bold hover:text-black transition-colors">
          <span>Group By</span>
          <span className="text-xs">▼</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer text-gray-500 font-bold hover:text-black transition-colors">
          <span>Favorites</span>
          <span className="text-xs">▼</span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
