import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [equipment, setEquipment] = useState([
    { id: 1, name: 'Samsung Monitor 15"', employee: 'Tejas Modi', department: 'Admin', serialNumber: 'MT/125/22778837', technician: 'Mitchell Admin', category: 'Monitors', company: 'My Company (San Francisco)' },
    { id: 2, name: 'Acer Laptop', employee: 'Bhaumik P', department: 'Technician', serialNumber: 'MT/122/11112222', technician: 'Marc Demo', category: 'Computers', company: 'My Company (San Francisco)' },
    { id: 3, name: 'HP Printer', employee: 'John Doe', department: 'Sales', serialNumber: 'MT/123/44556677', technician: 'Mitchell Admin', category: 'Printers', company: 'My Company (San Francisco)' },
    { id: 4, name: 'Dell Desktop', employee: 'Jane Smith', department: 'IT', serialNumber: 'MT/124/99887766', technician: 'Marc Demo', category: 'Computers', company: 'My Company (San Francisco)' },
  ]);
  const [teams, setTeams] = useState([
    { id: 1, name: 'Internal Maintenance', members: 'Anna Baker', company: 'My Company (San Francisco)' },
    { id: 2, name: 'Astrology', members: 'Marc Demo', company: 'My Company (San Francisco)' },
    { id: 3, name: 'Subcontractor', members: 'Maggie Davidson', company: 'My Company (San Francisco)' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [profileRes, maintenanceRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/maintenance/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUser(profileRes.data);
      setMaintenanceRequests(maintenanceRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err);
      if (err.response && err.response.status === 401) {
         localStorage.removeItem('token');
         setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    fetchData();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMaintenanceRequests([]);
  };

  return (
    <DataContext.Provider value={{
      user,
      maintenanceRequests,
      equipment,
      teams,
      loading,
      error,
      refreshData,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};
