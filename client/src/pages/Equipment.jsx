import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Equipment Name', accessor: 'name', width: '20%' },
    { header: 'Employee', accessor: 'employee', width: '15%' },
    { header: 'Department', accessor: 'department', width: '15%' },
    { header: 'Serial Number', accessor: 'serialNumber', width: '15%' },
    { header: 'Technician', accessor: 'technician', width: '15%' },
    { header: 'Equipment Category', accessor: 'category', width: '10%' },
    { header: 'Company', accessor: 'company', width: '10%' },
  ];

  const initialData = [
    { name: 'Samsung Monitor 15"', employee: 'Tejas Modi', department: 'Admin', serialNumber: 'MT/125/22778837', technician: 'Mitchell Admin', category: 'Monitors', company: 'My Company (San Francisco)' },
    { name: 'Acer Laptop', employee: 'Bhaumik P', department: 'Technician', serialNumber: 'MT/122/11112222', technician: 'Marc Demo', category: 'Computers', company: 'My Company (San Francisco)' },
    { name: 'HP Printer', employee: 'John Doe', department: 'Sales', serialNumber: 'MT/123/44556677', technician: 'Mitchell Admin', category: 'Printers', company: 'My Company (San Francisco)' },
    { name: 'Dell Desktop', employee: 'Jane Smith', department: 'IT', serialNumber: 'MT/124/99887766', technician: 'Marc Demo', category: 'Computers', company: 'My Company (San Francisco)' },
  ];

  const filteredData = initialData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PageHeader 
        title="Equipment" 
        onSearch={setSearchTerm} 
        onNew={() => alert('Create New Equipment')}
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default Equipment;
