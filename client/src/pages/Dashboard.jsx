import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaintenanceModal from '../components/MaintenanceModal.jsx';
import ViewEditMaintenanceModal from '../components/ViewEditMaintenanceModal.jsx';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const { user, maintenanceRequests, loading, refreshData, logout } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center font-bold text-2xl">LOADING...</div>;
  if (!user) return <div className="flex min-h-screen items-center justify-center font-bold text-2xl">Please log in.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <MaintenanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={handleRefresh} />
      <ViewEditMaintenanceModal isOpen={!!selectedRequestId} requestId={selectedRequestId} onClose={() => setSelectedRequestId(null)} onRefresh={handleRefresh} />
      
      <nav className="flex items-center justify-between border-b-2 border-black pb-4 mb-8 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-black tracking-tighter uppercase">GearGuard Maintenance</h1>
        <div className="flex gap-4">
             <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg border-2 border-black bg-black text-white px-6 py-2 font-bold transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              + NEW REQUEST
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="rounded-lg border-2 border-black bg-white px-6 py-2 font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              CALENDAR
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border-2 border-black bg-white px-6 py-2 font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              LOGOUT
            </button>
        </div>
      </nav>
      
      <main className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User Profile Card */}
        <div className="lg:col-span-1 h-fit rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-black uppercase border-b-2 border-black pb-2">User Profile</h2>
          <div className="space-y-4">
             <div className="p-3 bg-gray-100 rounded-lg border border-black">
                 <p className="text-xs font-bold uppercase text-gray-500">Name</p>
                 <p className="text-lg font-bold">{user.name || `User #${user.id}`}</p>
             </div>
             <div className="p-3 bg-gray-100 rounded-lg border border-black">
                 <p className="text-xs font-bold uppercase text-gray-500">Email</p>
                 <p className="text-lg font-bold break-all">{user.email}</p>
             </div>
             <div className="p-3 bg-gray-100 rounded-lg border border-black">
                 <p className="text-xs font-bold uppercase text-gray-500">Joined</p>
                 <p className="text-lg font-bold">{new Date(user.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
        </div>

        {/* Maintenance Requests List */}
        <div className="lg:col-span-3 space-y-6">
            <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
                Maintenance Requests
                <span className="text-sm bg-black text-white px-3 py-1 rounded-full">{maintenanceRequests.length}</span>
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
                {maintenanceRequests.length === 0 ? (
                    <div className="p-10 text-center border-2 border-dashed border-black rounded-2xl bg-white">
                        <p className="text-xl font-bold text-gray-400">No maintenance requests found.</p>
                        <button onClick={() => setIsModalOpen(true)} className="mt-4 text-black font-bold underline">Create one now</button>
                    </div>
                ) : (
                    maintenanceRequests.map(req => (
                        <div key={req._id} onClick={() => setSelectedRequestId(req._id)} className="group relative rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                         <span className={`text-xs font-bold px-2 py-1 rounded border border-black ${req.priority === 'High' ? 'bg-red-500 text-white' : req.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}>
                                            {req.priority.toUpperCase()}
                                         </span>
                                         <span className="text-xs font-bold px-2 py-1 rounded border border-black bg-gray-200">
                                            {req.status.toUpperCase()}
                                         </span>
                                    </div>
                                    <h3 className="text-2xl font-black">{req.subject}</h3>
                                    <p className="text-sm font-bold text-gray-500">#{req._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase text-gray-500">Scheduled</p>
                                    <p className="font-bold">{req.scheduledDate ? new Date(req.scheduledDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 border-t-2 border-black pt-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-500">Equipment</p>
                                    <p className="font-bold">{req.equipment?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-500">Technician</p>
                                    <p className="font-bold">{req.technician || 'Unassigned'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase text-gray-500">Type</p>
                                    <p className="font-bold">{req.maintenanceType}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
