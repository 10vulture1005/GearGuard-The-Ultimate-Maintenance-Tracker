import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const Equipment = () => {
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    maintenanceTeam: '',
    location: '',
    purchaseDate: '',
    warrantyExpiration: '',
    company: 'My Company (San Francisco)'
  });

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/equipment');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [teamRes, catRes] = await Promise.all([
        axios.get('http://localhost:5000/teams'),
        axios.get('http://localhost:5000/equipment-categories')
      ]);
      setTeams(teamRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/equipment/create', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        serialNumber: '',
        category: '',
        maintenanceTeam: '',
        location: '',
        purchaseDate: '',
        warrantyExpiration: '',
        company: 'My Company (San Francisco)'
      });
      fetchData();
    } catch (error) {
      console.error('Error creating equipment:', error);
      alert('Failed to create equipment');
    }
  };

  // Transform data for display
  const tableData = data.map(item => ({
    ...item,
    categoryName: item.category?.name || 'N/A',
    teamName: item.maintenanceTeam?.name || 'N/A'
  }));

  const columns = [
    { header: 'Name', accessor: 'name', width: '25%' },
    { header: 'Serial #', accessor: 'serialNumber', width: '20%' },
    { header: 'Category', accessor: 'categoryName', width: '20%' },
    { header: 'Team', accessor: 'teamName', width: '20%' },
    { header: 'Location', accessor: 'location', width: '15%' },
  ];

  const processedData = tableData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-bold">Loading Equipment...</div>;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Equipment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Equipment Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Serial Number</label>
            <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2 bg-white" required>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
             </div>
             <div>
                <label className="block text-sm font-bold mb-1">Team</label>
                <select name="maintenanceTeam" value={formData.maintenanceTeam} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2 bg-white" required>
                  <option value="">Select Team</option>
                  {teams.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
             </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800 transition-all">Create Equipment</button>
        </form>
      </Modal>

      <PageHeader 
        title="Equipment Inventory" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />

      <DataTable columns={columns} data={processedData} />
    </div>
  );
};

export default Equipment;
