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

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    costPerHour: 0,
    capacity: 1,
    timeEfficiency: 100,
    oeeTarget: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/work-centres');
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
      await axios.post('http://localhost:5000/work-centres/create', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        code: '',
        costPerHour: 0,
        capacity: 1,
        timeEfficiency: 100,
        oeeTarget: 0
      });
      fetchData();
    } catch (error) {
      console.error('Error creating work centre:', error);
      alert('Failed to create work centre');
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Work Center">
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
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800 transition-all">Create Work Center</button>
        </form>
      </Modal>

      <PageHeader 
        title="Work Centres" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />

      <DataTable columns={columns} data={processedData} />
    </div>
  );
};

export default WorkCentre;
