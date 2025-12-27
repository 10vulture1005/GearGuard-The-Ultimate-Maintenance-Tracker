import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-black uppercase">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-lg border-2 border-black px-3 py-1 font-bold hover:bg-black hover:text-white transition-all"
          >
            X
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
