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

  const [activeFilter, setActiveFilter] = useState(null);
  const [activeSort, setActiveSort] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const filterOptions = [
    { label: 'High Efficiency (>90%)', value: 'high_efficiency' },
  ];

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Efficiency', value: 'efficiency' },
  ];

  const groupOptions = [
    { label: 'Tag', value: 'tag' },
  ];

  const processData = () => {
    let processed = [...initialData];

    // 1. Search
    if (searchTerm) {
      processed = processed.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter
    if (activeFilter === 'high_efficiency') {
      processed = processed.filter(item => parseFloat(item.efficiency) > 90);
    }

    // 3. Sort
    if (activeSort === 'name_asc') {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'name_desc') {
      processed.sort((a, b) => b.name.localeCompare(a.name));
    } else if (activeSort === 'efficiency') {
      processed.sort((a, b) => parseFloat(b.efficiency) - parseFloat(a.efficiency));
    }

    // 4. Group
    if (activeGroup) {
      const grouped = processed.reduce((acc, item) => {
        const key = item[activeGroup] || 'Undefined';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
      return { isGrouped: true, data: grouped };
    }

    return { isGrouped: false, data: processed };
  };

  const { isGrouped, data: processedData } = processData();

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
          <div>
            <label className="block text-sm font-bold mb-1">Tag</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Alternative Workcenters</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Cost per hour</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Capacity</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Time Efficiency</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">OEE Target</label>
            <input type="text" className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800">Save</button>
        </form>
      </Modal>
      <PageHeader 
        title="Work Center" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
        groupOptions={groupOptions}
        onFilterChange={setActiveFilter}
        onSortChange={setActiveSort}
        onGroupChange={setActiveGroup}
        activeFilter={activeFilter}
        activeSort={activeSort}
        activeGroup={activeGroup}
      />
      {isGrouped ? (
        Object.entries(processedData).map(([group, items]) => (
          <div key={group} className="mb-8">
            <h3 className="text-xl font-black mb-4 uppercase flex items-center gap-2">
              <span className="bg-black text-white px-2 py-1 text-sm rounded">{items.length}</span>
              {group}
            </h3>
            <DataTable columns={columns} data={items} />
          </div>
        ))
      ) : (
        <DataTable columns={columns} data={processedData} />
      )}
    </div>
  );
};

export default WorkCentre;
