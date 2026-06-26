import React, { useState, useEffect } from 'react';
import API from '../../api';

const CATEGORIES = ['Water Fountains', 'Landscaping', 'Play Station', 'Interiors', 'Construction'];

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  multipleImages: string[];
}

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Fountains',
    imageUrls: '', // comma-separated URLs
  });
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditingService(null);
    setFormData({ title: '', description: '', category: 'Water Fountains', imageUrls: '' });
    setLocalFiles([]);
    setShowForm(true);
  };

  const openEdit = (svc: Service) => {
    setEditingService(svc);
    setFormData({ title: svc.title, description: svc.description, category: svc.category, imageUrls: svc.multipleImages.join(', ') });
    setLocalFiles([]);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      // Add URL-based images as JSON in body
      const urlImages = formData.imageUrls.split(',').map(u => u.trim()).filter(Boolean);
      fd.append('urlImages', JSON.stringify(urlImages));
      // Add local file uploads
      localFiles.forEach(file => fd.append('multipleImages', file));

      if (editingService) {
        await API.put(`/services/${editingService._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (loading) return <div className="text-gray-400">Loading services...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Services</h3>
        <button onClick={openAdd} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors">
          + Add Service
        </button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">{editingService ? 'Edit Service' : 'Add New Service'}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Category *</label>
                <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Image URLs (comma-separated Cloudinary or other URLs)</label>
                <textarea rows={2} value={formData.imageUrls} placeholder="https://res.cloudinary.com/..., https://..." onChange={e => setFormData(p => ({ ...p, imageUrls: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none placeholder-gray-600 text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Upload Local Images (optional)</label>
                <input type="file" multiple accept="image/*" onChange={e => setLocalFiles(Array.from(e.target.files || []))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-gray-400 text-sm" />
                {localFiles.length > 0 && <p className="text-xs text-green-400 mt-1">{localFiles.length} file(s) selected</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingService ? 'Save Changes' : 'Add Service')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-10 text-center text-gray-500">
          No services yet. Click "+ Add Service" to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(svc => (
            <div key={svc._id} className="bg-[#1A2A40] rounded-2xl border border-white/10 p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="text-white font-bold">{svc.title}</h5>
                  <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-full">{svc.category}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(svc)} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => handleDelete(svc._id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
              {svc.description && <p className="text-gray-400 text-sm mb-3">{svc.description}</p>}
              {svc.multipleImages.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {svc.multipleImages.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="service" className="w-14 h-14 object-cover rounded-lg border border-white/10" />
                  ))}
                  {svc.multipleImages.length > 4 && <span className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-400">+{svc.multipleImages.length - 4}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
