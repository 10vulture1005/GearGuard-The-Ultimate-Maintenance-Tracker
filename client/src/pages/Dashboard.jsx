import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaintenanceModal from "../components/MaintenanceModal.jsx";
import ViewEditMaintenanceModal from "../components/ViewEditMaintenanceModal.jsx";
import { useData } from "../context/DataContext";

export default function Dashboard() {
  const { user, maintenanceRequests, loading, refreshData, logout } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-2xl">
        LOADING...
      </div>
    );
  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center font-bold text-2xl">
        Please log in.
      </div>
    );
  // Compute Critical Equipment (high priority requests)
  const criticalEquipmentCount = maintenanceRequests.filter(
    (req) => req.priority === "High"
  ).length;

  // Compute Technician Load (assigned teams / total teams)
  const totalTeams = 5; // replace with actual number from your data/context if available
  const assignedTeams = maintenanceRequests.filter(
    (req) => req.technician
  ).length;

  // Compute Open Requests
  const openRequestsCount = maintenanceRequests.filter(
    (req) => req.status !== "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={handleRefresh}
      />
      <ViewEditMaintenanceModal
        isOpen={!!selectedRequestId}
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
        onRefresh={handleRefresh}
      />

      <nav className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical Equipment */}
          <div className="flex flex-col justify-center rounded-2xl border-2 border-red-600 bg-red-500 p-6 text-red-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-bold uppercase tracking-wide">
              Critical Equipment
            </p>
            <p className="text-4xl font-black mt-2">
              {criticalEquipmentCount} Units
            </p>
            <p className="text-sm mt-1 text-red-200">Health &lt; 30%</p>
          </div>

          {/* Technician Load */}
          <div className="flex flex-col justify-center rounded-2xl border-2 border-blue-600 bg-blue-500 p-6 text-blue-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-bold uppercase tracking-wide">
              Technician Load
            </p>
            <p className="text-4xl font-black mt-2">
              {Math.round((assignedTeams / totalTeams) * 100)}%
            </p>
            <p className="text-sm mt-1 text-blue-200">Assign Carefully</p>
          </div>

          {/* Open Requests */}
          <div className="flex flex-col justify-center rounded-2xl border-2 border-green-600 bg-green-500 p-6 text-green-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-bold uppercase tracking-wide">
              Open Requests
            </p>
            <p className="text-4xl font-black mt-2">
              {openRequestsCount} Pending
            </p>
            {/* <p className="text-sm mt-1 text-green-200">
              {overdueCount} Overdue
            </p> */}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User Profile Card */}
        <div className="lg:col-span-1 h-fit rounded-2xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-4 text-xl font-black uppercase border-b-2 border-black pb-2">
            User Profile
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-lg border border-black">
              <p className="text-xs font-bold uppercase text-gray-500">Name</p>
              <p className="text-lg font-bold">
                {user.name || `User #${user.id}`}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg border border-black">
              <p className="text-xs font-bold uppercase text-gray-500">Email</p>
              <p className="text-lg font-bold break-all">{user.email}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg border border-black">
              <p className="text-xs font-bold uppercase text-gray-500">
                Joined
              </p>
              <p className="text-lg font-bold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg border-2 border-black bg-black text-white px-12 py-2 font-bold transition-all hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              + NEW REQUEST
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border-2 border-black bg-white px-20 py-2 font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              LOGOUT
            </button>
            
          </div>
        </div>

        {/* Maintenance Requests List */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
            Maintenance Requests
            <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
              {maintenanceRequests.length}
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {maintenanceRequests.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-black rounded-2xl bg-white">
                <p className="text-xl font-bold text-gray-400">
                  No maintenance requests found.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-black font-bold underline"
                >
                  Create one now
                </button>
              </div>
            ) : (
              maintenanceRequests.map((req) => (
                <div
                  key={req._id}
                  onClick={() => setSelectedRequestId(req._id)}
                  className="group relative rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded border border-black ${
                            req.priority === "High"
                              ? "bg-red-500 text-white"
                              : req.priority === "Medium"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                        >
                          {req.priority.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold px-2 py-1 rounded border border-black bg-gray-200">
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black">{req.subject}</h3>
                      <p className="text-sm font-bold text-gray-500">
                        #{req._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Scheduled
                      </p>
                      <p className="font-bold">
                        {req.scheduledDate
                          ? new Date(req.scheduledDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t-2 border-black pt-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Equipment
                      </p>
                      <p className="font-bold">
                        {req.equipment?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Technician
                      </p>
                      <p className="font-bold">
                        {req.technician || "Unassigned"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase text-gray-500">
                        Type
                      </p>
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
