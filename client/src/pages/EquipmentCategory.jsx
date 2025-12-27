import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const EquipmentCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name', width: '30%' },
    { header: 'Responsible', accessor: 'responsible', width: '30%' },
    { header: 'Company', accessor: 'company', width: '40%' },
  ];

  const initialData = [
    { name: 'Computers', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { name: 'Software', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { name: 'Monitors', responsible: 'Mitchell Admin', company: 'My Company (San Francisco)' },
  ];

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Category">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Category Name</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Responsible</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800">Save</button>
        </form>
      </Modal>
      <PageHeader 
        title="Equipment Categories" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default EquipmentCategory;
