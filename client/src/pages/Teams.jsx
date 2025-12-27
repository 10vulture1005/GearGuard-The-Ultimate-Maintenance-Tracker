import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Team Name', accessor: 'name', width: '30%' },
    { header: 'Team Members', accessor: 'members', width: '40%' },
    { header: 'Company', accessor: 'company', width: '30%' },
  ];

  const initialData = [
    { name: 'Internal Maintenance', members: 'Anna Baker', company: 'My Company (San Francisco)' },
    { name: 'Astrology', members: 'Marc Demo', company: 'My Company (San Francisco)' },
    { name: 'Subcontractor', members: 'Maggie Davidson', company: 'My Company (San Francisco)' },
  ];

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Team">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Team Name</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Members</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800">Save</button>
        </form>
      </Modal>
      <PageHeader 
        title="Teams" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default Teams;
