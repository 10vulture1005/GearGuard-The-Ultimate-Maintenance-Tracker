import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
      <PageHeader 
        title="Teams" 
        onSearch={setSearchTerm} 
        onNew={() => alert('Create New Team')}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default Teams;
