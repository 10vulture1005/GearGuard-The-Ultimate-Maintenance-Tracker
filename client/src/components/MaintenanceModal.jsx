import React, { useState } from 'react';
import axios from 'axios';

export default function MaintenanceModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    subject: '',
    createdBy: '',
    maintenanceFor: '',
    equipment: { name: '', id: '', category: '' },
    requestDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'Corrective',
    team: '',
    technician: '',
    scheduledDate: '',
    durationHours: '',
    priority: 'Medium',
    company: '',
    status: 'New Request',
    notes: '',
    instructions: ''
  });

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
      await axios.post('http://localhost:5000/maintenance/create', formData, {
         headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create maintenance request');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black rounded-xl p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Maintenance Request</h2>
          <button onClick={onClose} className="rounded-full border-2 border-transparent hover:border-black p-1 hover:bg-gray-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-bold uppercase mb-1">Created By</label>
                   <input type="text" name="createdBy" value={formData.createdBy} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
                </div>
                <div>
                   <label className="block text-xs font-bold uppercase mb-1">Date</label>
                   <input type="date" name="requestDate" value={formData.requestDate} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Maintenance For</label>
                <input type="text" name="maintenanceFor" value={formData.maintenanceFor} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" required />
              </div>

              <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                 <h4 className="border-b-2 border-black pb-2 mb-3 text-sm font-black uppercase">Equipment Details</h4>
                 <div className="space-y-3">
                   <div>
                     <label className="block text-xs font-bold uppercase mb-1">Name</label>
                     <input type="text" name="equipment.name" value={formData.equipment.name} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" required />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold uppercase mb-1">ID</label>
                       <input type="text" name="equipment.id" value={formData.equipment.id} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" required />
                     </div>
                     <div>
                       <label className="block text-xs font-bold uppercase mb-1">Category</label>
                       <input type="text" name="equipment.category" value={formData.equipment.category} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 bg-white focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" required />
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
                    <input type="text" name="team" value={formData.team} onChange={handleChange} className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
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
            <div className="border-2 border-black rounded-b-lg p-4 border-t-0 rounded-tr-lg">
                {activeTab === 'notes' && (
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="Add additional notes here..." />
                )}
                {activeTab === 'instructions' && (
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="4" className="w-full border-2 border-black rounded-lg p-2 focus:ring-0 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" placeholder="Add specific instructions here..." />
                )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 border-t-2 border-black pt-6">
             <button type="button" onClick={onClose} className="px-6 py-2 font-bold uppercase border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all">Cancel</button>
             <button type="submit" className="px-8 py-2 font-bold uppercase border-2 border-black bg-black text-white rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
