import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const EquipmentCategory = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    responsible: '', // Could be ID or name, ideally fetch users
    company: 'My Company (San Francisco)'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/equipment-categories');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/equipment-categories/create', formData);
      setIsModalOpen(false);
      setFormData({ name: '', responsible: '', company: 'My Company (San Francisco)' });
      fetchData();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', width: '30%' },
    { header: 'Responsible', accessor: 'responsible', width: '30%' },
    { header: 'Company', accessor: 'company', width: '40%' },
  ];

  /* 
  const initialData = [...] // Removed
  */

  const [activeFilter, setActiveFilter] = useState(null);
  const [activeSort, setActiveSort] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const filterOptions = [
    { label: 'My Company', value: 'my_company' },
  ];

  const sortOptions = [
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
  ];

  const groupOptions = [
    { label: 'Responsible', value: 'responsible' },
    { label: 'Company', value: 'company' },
  ];

  const processData = () => {
    let processed = [...data];

    // 1. Search
    if (searchTerm) {
      processed = processed.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter
    if (activeFilter === 'my_company') {
      processed = processed.filter(item => item.company === 'My Company (San Francisco)');
    }

    // 3. Sort
    if (activeSort === 'name_asc') {
      processed.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'name_desc') {
      processed.sort((a, b) => b.name.localeCompare(a.name));
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

  if (loading) return <div className="p-8 text-center font-bold">Loading Categories...</div>;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Responsible</label>
            <input type="text" name="responsible" value={formData.responsible} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800 transition-all">Create Category</button>
        </form>
      </Modal>
      <PageHeader 
        title="Equipment Categories" 
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

export default EquipmentCategory;
