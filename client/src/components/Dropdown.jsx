import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ label, options, onSelect, activeValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 font-bold transition-colors ${
          activeValue ? 'text-black' : 'text-gray-500 hover:text-black'
        }`}
      >
        <span>{label}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden">
          <ul className="py-2">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  className={`w-full px-4 py-2 text-left font-bold hover:bg-gray-100 transition-colors ${
                    activeValue === option.value ? 'bg-black text-white hover:bg-black' : 'text-black'
                  }`}
                  onClick={() => {
                    onSelect(option.value === activeValue ? null : option.value); // Toggle off if already selected
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
