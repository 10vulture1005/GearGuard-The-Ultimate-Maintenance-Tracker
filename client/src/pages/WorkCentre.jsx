import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const WorkCentre = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { header: 'Work Center', accessor: 'name', width: '20%' },
    { header: 'Code', accessor: 'code', width: '10%' },
    { header: 'Tag', accessor: 'tag', width: '10%' },
    { header: 'Alternative Workcenters', accessor: 'alternative', width: '20%' },
    { header: 'Cost per hour', accessor: 'cost', width: '10%' },
    { header: 'Capacity', accessor: 'capacity', width: '10%' },
    { header: 'Time Efficiency', accessor: 'efficiency', width: '10%' },
    { header: 'OEE Target', accessor: 'oee', width: '10%' },
  ];

  const initialData = [
    { name: 'Assembly 1', code: '', tag: '', alternative: '', cost: '', capacity: '1.00', efficiency: '100.00', oee: '34.59' },
    { name: 'Drill 1', code: '', tag: '', alternative: '', cost: '', capacity: '1.00', efficiency: '100.00', oee: '90.00' },
  ];

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Work Center">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Work Center Name</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Code</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800">Save</button>
        </form>
      </Modal>
      <PageHeader 
        title="Work Center" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default WorkCentre;
