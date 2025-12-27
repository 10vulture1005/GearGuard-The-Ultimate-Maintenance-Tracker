import React, { useState, useEffect } from 'react';
import axios from 'axios';

function parseJwt (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export default function ViewEditMaintenanceModal({ isOpen, onClose, requestId, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = parseJwt(token);
        setCurrentUser(decoded);
    }
  }, []);

  // Fetch data when modal opens or ID changes
  useEffect(() => {
    if (isOpen && requestId) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios.get(`http://localhost:5000/maintenance/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching request:', err);
        setLoading(false);
      });
    } else {
      setFormData(null);
      setIsEditing(false);
    }
  }, [isOpen, requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/maintenance/update/${requestId}`, formData, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      onRefresh();
      // Don't close, just exit edit mode so user can see saved state
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update maintenance request');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this maintenance request? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/maintenance/delete/${requestId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete maintenance request');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-xl p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-6 bg-white sticky top-0 z-10">
          <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter">
                {loading ? 'Loading...' : `Request #${requestId.slice(-6).toUpperCase()}`}
             </h2>
             {!loading && <p className="text-xs font-bold text-gray-500 uppercase">Created on {new Date(formData?.createdAt).toLocaleDateString()}</p>}
          </div>
          <button onClick={onClose} className="rounded-full border-2 border-transparent hover:border-black p-1 hover:bg-gray-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading || !formData ? (
          <div className="p-10 text-center font-bold">Loading request details...</div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Subject</label>
                  {isEditing ? (
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  ) : (
                    <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.subject}</div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold uppercase mb-1">Created By</label>
                     {isEditing ? (
                        <div className="w-full border-2 border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 font-medium cursor-not-allowed">
                            {formData.createdBy}
                        </div>
                     ) : (
                        <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.createdBy}</div>
                     )}
                  </div>
                  <div>
                     <label className="block text-xs font-bold uppercase mb-1">Date</label>
                     {isEditing ? (
                        <input type="date" name="requestDate" value={formData.requestDate?.split('T')[0]} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                     ) : (
                        <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{new Date(formData.requestDate).toLocaleDateString()}</div>
                     )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Maintenance For</label>
                  {isEditing ? (
                    <input type="text" name="maintenanceFor" value={formData.maintenanceFor} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  ) : (
                    <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.maintenanceFor}</div>
                  )}
                </div>

                <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                   <h4 className="border-b-2 border-black pb-2 mb-3 text-sm font-black uppercase">Equipment Details</h4>
                   <div className="space-y-3">
                     <div>
                       <label className="block text-xs font-bold uppercase mb-1">Name</label>
                       {isEditing ? (
                         <input type="text" name="equipment.name" value={formData.equipment?.name || ''} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" />
                       ) : (
                         <div className="font-bold">{formData.equipment?.name || 'N/A'}</div>
                       )}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-bold uppercase mb-1">ID</label>
                         {isEditing ? (
                           <input type="text" name="equipment.id" value={formData.equipment?.id || ''} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" />
                         ) : (
                           <div className="font-mono text-sm">{formData.equipment?.id || 'N/A'}</div>
                         )}
                       </div>
                       <div>
                         <label className="block text-xs font-bold uppercase mb-1">Category</label>
                         {isEditing ? (
                           <input type="text" name="equipment.category" value={formData.equipment?.category || ''} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" />
                         ) : (
                           <div>{formData.equipment?.category || 'N/A'}</div>
                         )}
                       </div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold uppercase mb-1">Maintenance Type</label>
                    <div className="flex gap-4">
                      {isEditing ? (
                        <>
                          <label className="flex items-center gap-2 cursor-pointer border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-all">
                            <input type="radio" name="maintenanceType" value="Corrective" checked={formData.maintenanceType === 'Corrective'} onChange={handleChange} className="accent-black" />
                            <span className="font-bold text-sm">Corrective</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-all">
                            <input type="radio" name="maintenanceType" value="Preventive" checked={formData.maintenanceType === 'Preventive'} onChange={handleChange} className="accent-black" />
                            <span className="font-bold text-sm">Preventive</span>
                          </label>
                        </>
                      ) : (
                        <div className="font-bold bg-gray-100 px-4 py-2 rounded-lg border border-black inline-block">{formData.maintenanceType}</div>
                      )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Team</label>
                      {isEditing ? (
                        <input type="text" name="team" value={formData.team} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                      ) : (
                        <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.team}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Technician</label>
                      {isEditing ? (
                        <input type="text" name="technician" value={formData.technician} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                      ) : (
                        <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.technician}</div>
                      )}
                    </div>
                 </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Scheduled Date</label>
                      {isEditing ? (
                        <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate ? formData.scheduledDate.slice(0, 16) : ''} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                      ) : (
                        <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleString() : 'N/A'}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Duration (Hrs)</label>
                      {isEditing ? (
                        <input type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                      ) : (
                         <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.durationHours}</div>
                      )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Priority</label>
                      {isEditing ? (
                        <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      ) : (
                        <div className={`inline-block px-3 py-1 rounded border border-black font-bold text-sm ${formData.priority === 'High' ? 'bg-red-500 text-white' : formData.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}>{formData.priority}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Status</label>
                      {isEditing ? (
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                          <option value="New Request">New Request</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Repaired">Repaired</option>
                          <option value="Scrap">Scrap</option>
                          <option value="Blocked">Blocked</option>
                          <option value="Ready for Next Stage">Ready for Next Stage</option>
                        </select>
                      ) : (
                        <div className="inline-block px-3 py-1 rounded border border-black bg-gray-200 font-bold text-sm">{formData.status}</div>
                      )}
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold uppercase mb-1">Company</label>
                    {isEditing ? (
                      <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                    ) : (
                      <div className="p-2 border-2 border-transparent border-b-gray-200 font-medium">{formData.company}</div>
                    )}
                 </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex border-b-2 border-black mb-0">
                 <button type="button" onClick={() => setActiveTab('notes')} className={`px-6 py-2 font-bold text-sm border-t-2 border-x-2 border-black rounded-t-lg mr-2 transition-all ${activeTab === 'notes' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                   NOTES
                 </button>
                 <button type="button" onClick={() => setActiveTab('instructions')} className={`px-6 py-2 font-bold text-sm border-t-2 border-x-2 border-black rounded-t-lg transition-all ${activeTab === 'instructions' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                   INSTRUCTIONS
                 </button>
              </div>
              <div className="border-2 border-black rounded-b-lg p-4 border-t-0 rounded-tr-lg min-h-[150px] bg-white">
                  {activeTab === 'notes' && (
                    isEditing ? (
                      <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                    ) : (
                      <p className="whitespace-pre-wrap">{formData.notes || 'No notes.'}</p>
                    )
                  )}
                  {activeTab === 'instructions' && (
                    isEditing ? (
                      <textarea name="instructions" value={formData.instructions || ''} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                    ) : (
                      <p className="whitespace-pre-wrap">{formData.instructions || 'No instructions.'}</p>
                    )
                  )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t-2 border-black pt-6">
               {(formData.createdById && currentUser && formData.createdById === currentUser.userId) && (
                   <button type="button" onClick={handleDelete} className="px-4 py-2 font-bold uppercase text-red-600 border-2 border-transparent hover:border-red-600 rounded-lg transition-all text-sm">Delete Request</button>
               )}
               {/* Spacer if delete button is hidden to keep alignment? No, justify-between handles it. */}
               {!((formData.createdById && currentUser && formData.createdById === currentUser.userId)) && <div></div>}
               
               <div className="flex gap-4">
                  <button type="button" onClick={() => { setIsEditing(false); onClose(); }} className="px-6 py-2 font-bold uppercase border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all">Close</button>
                  {isEditing ? (
                    <button type="button" onClick={handleSave} className="px-8 py-2 font-bold uppercase border-2 border-black bg-black text-white rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Save Changes</button>
                  ) : (
                    /* Only show Edit if authorized */
                    (formData.createdById && currentUser && formData.createdById === currentUser.userId) && (
                        <button type="button" onClick={() => setIsEditing(true)} className="px-8 py-2 font-bold uppercase border-2 border-black bg-white text-black rounded-lg hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Edit</button>
                    )
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
