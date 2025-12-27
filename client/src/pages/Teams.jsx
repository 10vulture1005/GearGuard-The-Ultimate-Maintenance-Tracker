import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const Teams = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]); // Store available users
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    members: [], // Array of User IDs
    company: 'My Company (San Francisco)'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedItem) {
        setFormData({
            name: selectedItem.name,
            // Map member objects to their IDs for the form
            members: selectedItem.members ? selectedItem.members.map(m => m._id || m) : [],
            company: selectedItem.company || 'My Company (San Francisco)'
        });
    } else {
        setFormData(initialForm);
    }
  }, [selectedItem]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/teams');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, members: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
          await axios.put(`http://localhost:5000/teams/update/${selectedItem._id}`, formData);
      } else {
          await axios.post('http://localhost:5000/teams/create', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
        await axios.delete(`http://localhost:5000/teams/delete/${selectedItem._id}`);
        setIsModalOpen(false);
        fetchData();
    } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
    }
  };

  // Transform data for display (e.g. join member names)
  const tableData = data.map(team => ({
    ...team,
    memberNames: team.members ? team.members.map(m => m.name).join(', ') : ''
  }));

  const columns = [
    { header: 'Name', accessor: 'name', width: '40%' },
    { header: 'Members', accessor: 'memberNames', width: '40%' },
    { header: 'Company', accessor: 'company', width: '20%' },
  ];

  const processedData = tableData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-bold">Loading Teams...</div>;

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? "Edit Team" : "New Team"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Team Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Members (Hold Ctrl/Cmd to select multiple)</label>
            <select 
              multiple 
              name="members" 
              value={formData.members} 
              onChange={handleMemberChange} 
              className="w-full rounded-lg border-2 border-black p-2 bg-white h-32"
            >
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Selected: {formData.members.length}</p>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
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
        title="Maintenance Teams" 
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

export default Teams;
