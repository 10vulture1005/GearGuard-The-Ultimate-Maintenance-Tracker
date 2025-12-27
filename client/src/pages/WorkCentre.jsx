import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const WorkCentre = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    code: '',
    costPerHour: 0,
    capacity: 1,
    timeEfficiency: 100,
    oeeTarget: 0
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
     if (selectedItem) {
        setFormData({
            name: selectedItem.name,
            code: selectedItem.code || '',
            costPerHour: selectedItem.costPerHour || 0,
            capacity: selectedItem.capacity || 1,
            timeEfficiency: selectedItem.timeEfficiency || 100,
            oeeTarget: selectedItem.oeeTarget || 0
        });
     } else {
        setFormData(initialForm);
     }
  }, [selectedItem]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/work-centres`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching work centres:', error);
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
      if (selectedItem) {
          await axios.put(`${import.meta.env.VITE_API_URL}/work-centres/update/${selectedItem._id}`, formData);
      } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/work-centres/create`, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving work centre:', error);
      alert('Failed to save work centre');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this work center?')) return;
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/work-centres/delete/${selectedItem._id}`);
        setIsModalOpen(false);
        fetchData();
    } catch (error) {
        console.error('Error deleting work center:', error);
        alert('Failed to delete work center');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', width: '30%' },
    { header: 'Code', accessor: 'code', width: '20%' },
    { header: 'Cost/Hr', accessor: 'costPerHour', width: '15%' },
    { header: 'Capacity', accessor: 'capacity', width: '15%' },
    { header: 'Efficiency %', accessor: 'timeEfficiency', width: '20%' },
  ];

  const processedData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-8 text-center font-bold">Loading Work Centres...</div>;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? "Edit Work Center" : "New Work Center"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Code</label>
            <input type="text" name="code" value={formData.code} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-1">Cost/Hr</label>
                <input type="number" name="costPerHour" value={formData.costPerHour} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Capacity</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
            </div>
          </div>
          
           <div className="flex gap-4 pt-4">
            {selectedItem && (
                <button type="button" onClick={handleDelete} className="flex-1 rounded-lg border-2 border-red-500 text-red-500 font-bold py-2 hover:bg-red-50 transition-all">Delete</button>
            )}
            <button type="submit" className="flex-1 rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800 transition-all">{selectedItem ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <PageHeader 
        title="Work Centres" 
        onSearch={setSearchTerm} 
        onNew={() => { setSelectedItem(null); setIsModalOpen(true); }}
      />

      <DataTable 
        columns={columns} 
        data={processedData} 
        onRowClick={(item) => { setSelectedItem(item); setIsModalOpen(true); }}
      />
    </div>
  );
};

export default WorkCentre;
