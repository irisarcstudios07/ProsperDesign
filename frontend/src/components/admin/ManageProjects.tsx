import React, { useState, useEffect } from 'react';
import API from '../../api';

const CATEGORIES = ['Landscape', 'Water Bodies', 'Interior Design', 'Architecture', 'Playstation'];

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  video: string;
  featured: boolean;
  visibility: boolean;
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Landscape',
    featured: false,
    visibility: true,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', category: 'Landscape', featured: false, visibility: true });
    setThumbnailFile(null);
    setVideoFile(null);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({ title: p.title, description: p.description || '', category: p.category, featured: p.featured, visibility: p.visibility });
    setThumbnailFile(null);
    setVideoFile(null);
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
      fd.append('featured', String(formData.featured));
      fd.append('visibility', String(formData.visibility));

      if (thumbnailFile) {
        fd.append('thumbnail', thumbnailFile);
      }
      if (videoFile) {
        fd.append('video', videoFile);
      }

      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false);
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) { setError('Delete failed'); }
  };

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Projects</h3>
        <button onClick={openAdd} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors">+ Add Project</button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                    className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Category *</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}
                    className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                  className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none" />
              </div>

              {/* Thumbnail */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-white">Thumbnail Image *</p>
                {editingProject && editingProject.thumbnail && (
                  <div className="mb-2">
                    <p className="text-gray-500 text-xs mb-1">Current Thumbnail:</p>
                    <img 
                      src={editingProject.thumbnail.startsWith('http') ? editingProject.thumbnail : `http://localhost:5000/${editingProject.thumbnail}`} 
                      alt="Current Thumbnail" 
                      className="h-20 w-auto object-cover rounded-lg border border-white/10" 
                    />
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Upload from Local Storage</label>
                  <input type="file" accept="image/*" required={!editingProject} onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#121212] border border-white/20 rounded-lg px-3 py-2 text-gray-400 text-sm" />
                  {thumbnailFile && <p className="text-green-400 text-xs mt-1">✓ {thumbnailFile.name}</p>}
                </div>
              </div>

              {/* Video */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3">
                <p className="text-sm font-bold text-white">Project Video</p>
                {editingProject && editingProject.video && (
                  <div className="mb-2">
                    <p className="text-gray-500 text-xs mb-1">Current Video Path:</p>
                    <span className="text-xs text-gray-400 block truncate">{editingProject.video}</span>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Upload from Local Storage</label>
                  <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#121212] border border-white/20 rounded-lg px-3 py-2 text-gray-400 text-sm" />
                  {videoFile && <p className="text-green-400 text-xs mt-1">✓ {videoFile.name}</p>}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData(p => ({...p, featured: e.target.checked}))} className="w-4 h-4 accent-[#d4af37]" />
                  <span className="text-gray-400 text-sm">Featured Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.visibility} onChange={e => setFormData(p => ({...p, visibility: e.target.checked}))} className="w-4 h-4 accent-[#d4af37]" />
                  <span className="text-gray-400 text-sm">Visible on Website</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingProject ? 'Save Changes' : 'Add Project')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/20 text-gray-400 py-2 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-10 text-center text-gray-500">No projects yet. Click "+ Add Project" to create your first one.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p._id} className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
              {p.thumbnail && (
                <img 
                  src={p.thumbnail.startsWith('http') ? p.thumbnail : `http://localhost:5000/${p.thumbnail}`} 
                  alt={p.title} 
                  className="w-full h-40 object-cover" 
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-white font-bold text-sm">{p.title}</h5>
                    <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">{p.category}</span>
                  </div>
                  {p.featured && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">★ Featured</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="flex-1 text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="flex-1 text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
