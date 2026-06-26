import React, { useState, useEffect } from 'react';
import API from '../../api';
import type { Service, ChildService } from '../../types';

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals / State for forms
  const [showParentModal, setShowParentModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  
  const [editingParent, setEditingParent] = useState<Service | null>(null);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [activeParentForChild, setActiveParentForChild] = useState<Service | null>(null);

  // Form states
  const [parentFormData, setParentFormData] = useState({
    title: '',
    coverImageUrl: '',
  });
  const [parentCoverFile, setParentCoverFile] = useState<File | null>(null);

  const [childFormData, setChildFormData] = useState({
    title: '',
    image: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      const extractedData = data?.data || data;
      setServices(Array.isArray(extractedData) ? extractedData : []);
    } catch (err) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Parent form handlers
  const openAddParent = () => {
    setEditingParent(null);
    setParentFormData({ title: '', coverImageUrl: '' });
    setParentCoverFile(null);
    setShowParentModal(true);
  };

  const openEditParent = (parent: Service) => {
    setEditingParent(parent);
    setParentFormData({ title: parent.title, coverImageUrl: parent.coverImage || '' });
    setParentCoverFile(null);
    setShowParentModal(true);
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', parentFormData.title);
      fd.append('coverImageUrl', parentFormData.coverImageUrl);
      if (parentCoverFile) {
        fd.append('coverImage', parentCoverFile);
      }

      if (editingParent) {
        // Retain existing children when editing parent details
        fd.append('children', JSON.stringify(editingParent.children));
        await API.put(`/services/${editingParent._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        fd.append('children', JSON.stringify([]));
        await API.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowParentModal(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteParent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parent service and all of its children?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      setError('Delete failed');
    }
  };

  // Child form handlers
  const openAddChild = (parent: Service) => {
    setActiveParentForChild(parent);
    setEditingChildIndex(null);
    setChildFormData({ title: '', image: '', description: '' });
    setShowChildModal(true);
  };

  const openEditChild = (parent: Service, index: number) => {
    setActiveParentForChild(parent);
    setEditingChildIndex(index);
    const child = parent.children[index];
    setChildFormData({
      title: child.title,
      image: child.image || '',
      description: child.description || '',
    });
    setShowChildModal(true);
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParentForChild) return;
    setSaving(true);
    setError('');
    try {
      const updatedChildren = [...activeParentForChild.children];
      const childData: ChildService = {
        title: childFormData.title,
        image: childFormData.image,
        description: childFormData.description,
      };

      if (editingChildIndex !== null) {
        updatedChildren[editingChildIndex] = childData;
      } else {
        updatedChildren.push(childData);
      }

      // Update parent with the modified children array
      await API.put(`/services/${activeParentForChild._id}`, {
        children: updatedChildren
      });

      setShowChildModal(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Child save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChild = async (parent: Service, index: number) => {
    if (!confirm('Are you sure you want to delete this child service?')) return;
    try {
      const updatedChildren = parent.children.filter((_, i) => i !== index);
      await API.put(`/services/${parent._id}`, {
        children: updatedChildren
      });
      fetchServices();
    } catch (err) {
      setError('Failed to delete child service');
    }
  };

  if (loading) return <div className="text-gray-400">Loading services...</div>;

  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Services</h3>
        <button onClick={openAddParent} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors">
          + Add Category / Parent Service
        </button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Parent Service Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">{editingParent ? 'Edit Parent Service' : 'Add New Parent Service'}</h4>
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Parent Title *</label>
                <input type="text" required value={parentFormData.title} onChange={e => setParentFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Cover Image URL (Cloudinary or any direct link)</label>
                <input type="text" value={parentFormData.coverImageUrl} placeholder="https://res.cloudinary.com/..." onChange={e => setParentFormData(p => ({ ...p, coverImageUrl: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Or Upload Cover Image File (optional)</label>
                <input type="file" accept="image/*" onChange={e => setParentCoverFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-gray-400 text-sm" />
                {parentCoverFile && <p className="text-xs text-green-400 mt-1">File selected: {parentCoverFile.name}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingParent ? 'Save Changes' : 'Create')}
                </button>
                <button type="button" onClick={() => setShowParentModal(false)} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Service Modal */}
      {showChildModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">
              {editingChildIndex !== null ? 'Edit Child Service' : 'Add Child Service'} to <span className="text-white">{activeParentForChild?.title}</span>
            </h4>
            <form onSubmit={handleChildSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Child Service Title *</label>
                <input type="text" required value={childFormData.title} onChange={e => setChildFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Child Image URL (Cloudinary or any direct link)</label>
                <input type="text" value={childFormData.image} placeholder="https://res.cloudinary.com/... or ezgif-frame-..." onChange={e => setChildFormData(p => ({ ...p, image: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Description</label>
                <textarea rows={3} value={childFormData.description} onChange={e => setChildFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingChildIndex !== null ? 'Save Changes' : 'Add Child')}
                </button>
                <button type="button" onClick={() => setShowChildModal(false)} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services List (File Explorer Hierarchy Style) */}
      {safeServices.length === 0 ? (
        <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-10 text-center text-gray-500">
          No services yet. Click "+ Add Category / Parent Service" to start.
        </div>
      ) : (
        <div className="space-y-6">
          {safeServices.map(parent => (
            <div key={parent._id} className="bg-[#1A2A40] rounded-2xl border border-white/10 overflow-hidden">
              {/* Parent Banner/Header */}
              <div className="p-5 bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 gap-4">
                <div className="flex items-center gap-4">
                  {parent.coverImage ? (
                    <img src={parent.coverImage} alt={parent.title} className="w-14 h-14 object-cover rounded-lg border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-xs text-gray-500 border border-white/10">No Cover</div>
                  )}
                  <div>
                    <h4 className="text-white font-bold text-lg">{parent.title}</h4>
                    <p className="text-xs text-gray-400">{parent.children?.length || 0} child services</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openAddChild(parent)} className="text-xs bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-3 py-1.5 rounded-lg hover:bg-[#d4af37]/20 transition-colors">
                    + Add Child
                  </button>
                  <button onClick={() => openEditParent(parent)} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteParent(parent._id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>

              {/* Children List */}
              <div className="p-5">
                {(!parent.children || parent.children.length === 0) ? (
                  <p className="text-sm text-gray-500 italic">No sub-services defined. Click "+ Add Child" to add services under this parent.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parent.children.map((child, idx) => (
                      <div key={idx} className="bg-black/10 border border-white/5 p-4 rounded-xl flex gap-4 items-start relative group">
                        {child.image ? (
                          <img src={child.image} alt={child.title} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                        ) : (
                          <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center text-xs text-gray-500 border border-white/10">No Image</div>
                        )}
                        <div className="flex-1 min-w-0 pr-16">
                          <h5 className="text-white font-semibold text-sm truncate">{child.title}</h5>
                          {child.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{child.description}</p>}
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditChild(parent, idx)} className="text-[10px] text-blue-400 hover:text-blue-300 bg-[#1A2A40] border border-blue-400/20 px-2 py-1 rounded transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteChild(parent, idx)} className="text-[10px] text-red-400 hover:text-red-300 bg-[#1A2A40] border border-red-400/20 px-2 py-1 rounded transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
