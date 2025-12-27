import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Equipment from './pages/Equipment';
import Teams from './pages/Teams';
import EquipmentCategory from './pages/EquipmentCategory';
import WorkCentre from './pages/WorkCentre';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/equipment" element={<Layout><Equipment /></Layout>} />
        <Route path="/teams" element={<Layout><Teams /></Layout>} />
        <Route path="/equipment-category" element={<Layout><EquipmentCategory /></Layout>} />
        <Route path="/work-centres" element={<Layout><WorkCentre /></Layout>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
