import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';

const EquipmentCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Name', accessor: 'name', width: '30%' },
    { header: 'Responsible', accessor: 'responsible', width: '30%' },
    { header: 'Company', accessor: 'company', width: '40%' },
  ];

  const initialData = [
    { name: 'Computers', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { name: 'Software', responsible: 'OdooBot', company: 'My Company (San Francisco)' },
    { name: 'Monitors', responsible: 'Mitchell Admin', company: 'My Company (San Francisco)' },
  ];

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Equipment Categories" 
        onSearch={setSearchTerm} 
        onNew={() => alert('Create New Category')}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default EquipmentCategory;
