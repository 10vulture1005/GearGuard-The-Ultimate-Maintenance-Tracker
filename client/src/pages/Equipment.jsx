import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const Equipment = () => {
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  // New state for users dropdown
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    serialNumber: '',
    category: '',
    maintenanceTeam: '',
    location: '',
    purchaseDate: '',
    warrantyExpiration: '',
    company: 'My Company (San Francisco)',
    department: '',
    employee: '' // Now stores User ID
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        serialNumber: selectedItem.serialNumber,
        category: selectedItem.category?._id || selectedItem.category || '',
        maintenanceTeam: selectedItem.maintenanceTeam?._id || selectedItem.maintenanceTeam || '',
        location: selectedItem.location || '',
        purchaseDate: selectedItem.purchaseDate ? selectedItem.purchaseDate.split('T')[0] : '',
        warrantyExpiration: selectedItem.warrantyExpiration ? selectedItem.warrantyExpiration.split('T')[0] : '',
        company: selectedItem.company || 'My Company (San Francisco)',
        department: selectedItem.department || '',
        // Handle object or string ID for employee
        employee: selectedItem.employee?._id || selectedItem.employee || ''
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedItem]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/equipment`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [teamRes, catRes, userRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/teams`),
        axios.get(`${import.meta.env.VITE_API_URL}/equipment-categories`),
        axios.get(`${import.meta.env.VITE_API_URL}/auth/users`) // Assuming this endpoint exists, or we might need to create it
      ]);
      setTeams(teamRes.data);
      setCategories(catRes.data);
      // Fallback if users endpoint doesn't exist, try getting from teams or just generic users list
      // For now assume /auth/users exists or is accessible
      setUsers(userRes.data); 
    } catch (error) {
      console.error('Error fetching dropdowns:', error);
      // Fallback for demo if endpoint fails
      setUsers([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
         await axios.put(`${import.meta.env.VITE_API_URL}/equipment/update/${selectedItem._id}`, formData);
      } else {
         await axios.post(`${import.meta.env.VITE_API_URL}/equipment/create`, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Failed to save equipment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/equipment/delete/${selectedItem._id}`);
      fetchData();
      setSelectedItem(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Failed to delete equipment');
    }
  }

  // Transform data for display
  const tableData = data.map(item => ({
    ...item,
    categoryName: item.category?.name || 'N/A',
    teamName: item.maintenanceTeam?.name || 'N/A',
    employeeName: item.employee?.name || 'Unassigned'
  }));

  const columns = [
    { header: 'Name', accessor: 'name', width: '20%' },
    { header: 'Serial #', accessor: 'serialNumber', width: '20%' },
    { header: 'Category', accessor: 'categoryName', width: '15%' },
    { header: 'Assigned To', accessor: 'employeeName', width: '20%' },
    { header: 'Team', accessor: 'teamName', width: '15%' },
    { header: 'Location', accessor: 'location', width: '10%' },
  ];

  const processedData = tableData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-bold">Loading Equipment...</div>;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? "Edit Equipment" : "New Equipment"}>
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
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold mb-1">Department</label>
               <input type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
             </div>
             <div>
                <label className="block text-sm font-bold mb-1">Assigned Employee</label>
                <select 
                  name="employee" 
                  value={formData.employee} 
                  onChange={handleInputChange} 
                  className="w-full rounded-lg border-2 border-black p-2 bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold mb-1">Purchase Date</label>
               <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
             </div>
             <div>
               <label className="block text-sm font-bold mb-1">Warranty Expires</label>
               <input type="date" name="warrantyExpiration" value={formData.warrantyExpiration} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
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
        title="Equipment Inventory" 
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

export default Equipment;
