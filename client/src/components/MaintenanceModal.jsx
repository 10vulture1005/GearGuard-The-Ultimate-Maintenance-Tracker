import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

export default function MaintenanceModal({ isOpen, onClose, onRefresh, initialDate, requestToEdit }) {
  const { user } = useData();
  
  // Determine if the current user can edit this request
  const canEdit = !requestToEdit || (user && (requestToEdit.createdBy === user.id || requestToEdit.createdBy?._id === user.id));

  const [formData, setFormData] = useState({
    subject: '',
    // createdBy: '', // Handled by backend
    maintenanceFor: 'Equipment',
    equipment: '', // ID
    workCentre: '', // ID
    requestDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'Corrective',
    maintenanceTeam: '', // ID
    technician: '', // ID (optional selection at creation?)
    scheduledDate: '',
    durationHours: '',
    priority: 'Medium',
    company: 'My Company (San Francisco)',
    status: 'New Request',
    notes: '',
    instructions: ''
  });

  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [workCentreOptions, setWorkCentreOptions] = useState([]);

  useEffect(() => {
    console.log('MaintenanceModal Open:', isOpen);
    console.log('RequestToEdit:', requestToEdit);
    
    if (isOpen) {
      // 1. Fetch options
      const fetchData = async () => {
        try {
          const [eqRes, teamRes, wcRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/equipment`),
            axios.get(`${import.meta.env.VITE_API_URL}/teams`),
            axios.get(`${import.meta.env.VITE_API_URL}/work-centres`)
          ]);
          setEquipmentOptions(eqRes.data);
          setTeamOptions(teamRes.data);
          setWorkCentreOptions(wcRes.data);
        } catch (error) {
          console.error('Error fetching dropdown data:', error);
        }
      };
      fetchData();

      // 2. Populate form if editing
      if (requestToEdit) {
        setFormData({
          subject: requestToEdit.subject || '',
          maintenanceFor: requestToEdit.maintenanceFor || 'Equipment',
          equipment: requestToEdit.equipment?._id || requestToEdit.equipment || '',
          workCentre: requestToEdit.workCentre?._id || requestToEdit.workCentre || '',
          requestDate: requestToEdit.requestDate ? requestToEdit.requestDate.split('T')[0] : new Date().toISOString().split('T')[0],
          maintenanceType: requestToEdit.maintenanceType || 'Corrective',
          maintenanceTeam: requestToEdit.maintenanceTeam?._id || requestToEdit.maintenanceTeam || '',
          technician: requestToEdit.technician || '',
          scheduledDate: requestToEdit.scheduledDate ? requestToEdit.scheduledDate.slice(0, 16) : '', // Format for datetime-local
          durationHours: requestToEdit.durationHours || '',
          priority: requestToEdit.priority || 'Medium',
          company: requestToEdit.company || '',
          status: requestToEdit.status || 'New Request',
          notes: requestToEdit.notes || '',
          instructions: requestToEdit.instructions || ''
        });
      } else {
        // Reset for new request
        setFormData({
            subject: '',
            maintenanceFor: 'Equipment',
            equipment: '',
            workCentre: '',
            requestDate: initialDate ? new Date(initialDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            maintenanceType: 'Corrective',
            maintenanceTeam: '', 
            technician: '',
            scheduledDate: initialDate ? new Date(initialDate).toISOString().slice(0, 16) : '', 
            durationHours: '',
            priority: 'Medium',
            company: 'My Company (San Francisco)',
            status: 'New Request',
            notes: '',
            instructions: ''
          });
      }
    }
  }, [isOpen, requestToEdit, initialDate]);

  // Auto-fill logic when equipment changes
  const handleEquipmentChange = (e) => {
    const selectedId = e.target.value;
    const selectedEq = equipmentOptions.find(eq => eq._id === selectedId);
    
    setFormData(prev => ({
      ...prev,
      equipment: selectedId,
      // Auto-fill team if available on equipment
      maintenanceTeam: selectedEq?.maintenanceTeam?._id || selectedEq?.maintenanceTeam || prev.maintenanceTeam,
      company: selectedEq?.company || prev.company
    }));
  };

  const [activeTab, setActiveTab] = useState('notes');

  // if (!isOpen) return null; // Removed for animation

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Sanitize payload: Mongoose throws CastError if ObjectId fields are empty strings
      const payload = { ...formData };
      if (!payload.equipment) payload.equipment = null;
      if (!payload.workCentre) payload.workCentre = null;
      if (!payload.maintenanceTeam) payload.maintenanceTeam = null;

      if (requestToEdit) {
        // Update existing
        await axios.put(`${import.meta.env.VITE_API_URL}/maintenance/update/${requestToEdit._id}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new
        await axios.post(`${import.meta.env.VITE_API_URL}/maintenance/create`, payload, {
            headers: { Authorization: `Bearer ${token}` }
         });
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving request:', error);
      alert(error.response?.data?.message || 'Failed to save maintenance request');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL}/maintenance/delete/${requestToEdit._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        onRefresh();
        onClose();
    } catch (error) {
        console.error('Error deleting request:', error);
        alert(error.response?.data?.message || 'Failed to delete request');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-xl p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{requestToEdit ? 'Edit Maintenance Request' : 'New Maintenance Request'}</h2>
          <button onClick={onClose} className="rounded-full border-2 border-transparent hover:border-black p-1 hover:bg-gray-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <fieldset disabled={!canEdit} className="contents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
              </div>
              
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold uppercase mb-1">Date</label>
                     <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
                  </div>
                </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Maintenance For</label>
                <select name="maintenanceFor" value={formData.maintenanceFor} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                  <option value="Equipment">Equipment</option>
                  <option value="Work Center">Work Center</option>
                </select>
              </div>

              <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                 <h4 className="border-b-2 border-black pb-2 mb-3 text-sm font-black uppercase">
                   {formData.maintenanceFor} Details
                 </h4>
                 <div className="space-y-3">
                   {formData.maintenanceFor === 'Equipment' ? (
                     <>
                       <div>
                         <label className="block text-xs font-bold uppercase mb-1">Equipment</label>
                         <select 
                            name="equipment" 
                            value={formData.equipment} 
                            onChange={handleEquipmentChange} 
                            className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            required
                         >
                            <option value="">Select Equipment</option>
                            {equipmentOptions
                                .filter(eq => !eq.employee || (eq.employee._id === user?.id || eq.employee === user?.id)) // Show unassigned OR assigned to me
                                .map(eq => (
                                  <option key={eq._id} value={eq._id}>{eq.name} ({eq.serialNumber})</option>
                                ))
                            }
                         </select>
                       </div>
                       {/* Show read-only details if equipment selected */}
                       {formData.equipment && (() => {
                          const selected = equipmentOptions.find(e => e._id === formData.equipment);
                          return (
                            <div className="text-xs text-gray-600 space-y-1">
                               <p><span className="font-bold">Category:</span> {selected?.category?.name || selected?.category || '-'}</p>
                               <p><span className="font-bold">Team:</span> {selected?.maintenanceTeam?.name || selected?.maintenanceTeam || '-'}</p>
                            </div>
                          );
                       })()}
                     </>
                   ) : (
                     <div>
                       <label className="block text-xs font-bold uppercase mb-1">Work Center</label>
                         <select 
                            name="workCentre" 
                            value={formData.workCentre} 
                            onChange={handleChange} 
                            className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            required
                         >
                            <option value="">Select Work Center</option>
                            {workCentreOptions.map(wc => (
                              <option key={wc._id} value={wc._id}>{wc.name} ({wc.code})</option>
                            ))}
                         </select>
                     </div>
                   )}
                 </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold uppercase mb-1">Maintenance Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-all">
                      <input type="radio" name="maintenanceType" value="Corrective" checked={formData.maintenanceType === 'Corrective'} onChange={handleChange} className="accent-black" />
                      <span className="font-bold text-sm">Corrective</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition-all">
                      <input type="radio" name="maintenanceType" value="Preventive" checked={formData.maintenanceType === 'Preventive'} onChange={handleChange} className="accent-black" />
                      <span className="font-bold text-sm">Preventive</span>
                    </label>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold uppercase mb-1">Team</label>
                     <select 
                        name="maintenanceTeam" 
                        value={formData.maintenanceTeam} 
                        onChange={handleChange} 
                        className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
                     >
                        <option value="">Select Team</option>
                        {teamOptions.map(t => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                     </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Technician</label>
                    <input type="text" name="technician" value={formData.technician} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  </div>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Scheduled Date</label>
                    <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Duration (Hrs)</label>
                    <input type="number" name="durationHours" value={formData.durationHours} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                      <option value="New Request">New Request</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Repaired">Repaired</option>
                      <option value="Scrap">Scrap</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Ready for Next Stage">Ready for Next Stage</option>
                    </select>
                  </div>
               </div>
               
               <div>
                  <label className="block text-xs font-bold uppercase mb-1">Company</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
               </div>
            </div>
          </div>
          </fieldset>

          {/* Footer */}
          <div className="mb-6">
            <div className="flex border-b-2 border-black mb-0">
               <button type="button" onClick={() => setActiveTab('notes')} className={`px-6 py-2 font-bold text-sm border-t-2 border-x-2 border-black rounded-t-lg mr-2 transition-all ${activeTab === 'notes' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                 NOTES
               </button>
               <button type="button" onClick={() => setActiveTab('instructions')} className={`px-6 py-2 font-bold text-sm border-t-2 border-x-2 border-black rounded-t-lg transition-all ${activeTab === 'instructions' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                 INSTRUCTIONS
               </button>
            </div>
            <div className="border-2 border-black rounded-b-lg p-4 border-t-0 rounded-tr-lg">
                <fieldset disabled={!canEdit} className="contents">
                {activeTab === 'notes' && (
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="Add additional notes here..." />
                )}
                {activeTab === 'instructions' && (
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="Add specific instructions here..." />
                )}
                </fieldset>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t-2 border-black pt-6">
             {canEdit && requestToEdit && (
                 <button type="button" onClick={handleDelete} className="px-6 py-2 font-bold uppercase border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all mr-auto">Delete</button>
             )}
             <button type="button" onClick={onClose} className="px-6 py-2 font-bold uppercase border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all">
                {canEdit ? 'Cancel' : 'Close'}
             </button>
             {canEdit && (
                <button type="submit" className="px-8 py-2 font-bold uppercase border-2 border-black bg-black text-white rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">{requestToEdit ? 'Update' : 'Submit'}</button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
}
