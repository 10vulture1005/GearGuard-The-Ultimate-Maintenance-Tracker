import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import axios from 'axios';

const Teams = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: 'My Company (San Francisco)'
  });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/teams/create', formData);
      setIsModalOpen(false);
      setFormData({ name: '', company: 'My Company (San Francisco)' });
      fetchData();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Team">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Team Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" required />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full rounded-lg border-2 border-black p-2" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-black text-white font-bold py-2 hover:bg-gray-800 transition-all">Create Team</button>
        </form>
      </Modal>

      <PageHeader 
        title="Maintenance Teams" 
        onSearch={setSearchTerm} 
        onNew={() => setIsModalOpen(true)}
      />

      <DataTable columns={columns} data={processedData} />
    </div>
  );
};

export default Teams;
