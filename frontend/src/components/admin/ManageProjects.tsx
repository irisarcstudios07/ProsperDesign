import React, { useState, useEffect } from 'react';
import API, { getBackendUrl } from '../../api';
import type { Project } from '../../types';

const CATEGORIES = ['Landscape', 'Water Bodies', 'Interior Design', 'Constructions', 'Playstation'];

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Landscape',
    urlImages: '',
    location: '',
    area: '',
    completion: '',
    materials: '',
    featured: false,
    visibility: true,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      const extractedData = data?.data || data;
      setProjects(Array.isArray(extractedData) ? extractedData : []);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getBackendUrl()}/${url}`;
  };

  const openAdd = () => {
    setEditingProject(null);
    setFormData({ 
      title: '', description: '', category: 'Landscape', urlImages: '', 
      location: '', area: '', completion: '', materials: '', 
      featured: false, visibility: true 
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setGalleryFiles([]);
    setExistingGallery([]);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    const initialGallery = (p.galleryImages && p.galleryImages.length > 0) 
      ? p.galleryImages 
      : (p.images || []);
    setFormData({ 
      title: p.title, 
      description: p.description || '', 
      category: p.category, 
      urlImages: '', 
      location: p.location || '',
      area: p.area || '',
      completion: p.completion || '',
      materials: p.materials || '',
      featured: p.featured || false, 
      visibility: p.visibility !== false 
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setGalleryFiles([]);
    setExistingGallery(initialGallery);
    setShowForm(true);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
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
      fd.append('location', formData.location);
      fd.append('area', formData.area);
      fd.append('completion', formData.completion);
      fd.append('materials', formData.materials);
      
      const urlList = formData.urlImages.split('\n').map(u => u.trim()).filter(Boolean);
      const combinedUrls = [...existingGallery, ...urlList];
      fd.append('galleryImagesJson', JSON.stringify(combinedUrls));
      fd.append('urlImages', JSON.stringify(combinedUrls));
      
      fd.append('featured', String(formData.featured));
      fd.append('visibility', String(formData.visibility));

      if (thumbnailFile) {
        fd.append('coverImage', thumbnailFile);
        fd.append('thumbnail', thumbnailFile);
      }
      if (videoFile) {
        fd.append('video', videoFile);
      }

      galleryFiles.forEach(file => {
        fd.append('galleryImages', file);
      });

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

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Projects Gallery</h3>
        <button onClick={openAdd} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors">+ Add Project</button>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-6">
            <h4 className="text-xl font-bold text-[#d4af37] border-b border-white/10 pb-4">{editingProject ? 'Edit Project Gallery' : 'Add New Project Gallery'}</h4>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Project Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Category *</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">Full Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none" />
              </div>

              {/* Cover Image */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-[#2A4365]/30">
                <p className="text-sm font-bold text-white">Cover Image (Thumbnail)</p>
                {editingProject && (editingProject.coverImage || editingProject.thumbnail) && (
                  <div className="mb-2">
                    <p className="text-gray-400 text-xs mb-1">Current Cover:</p>
                    <img 
                      src={getMediaUrl(editingProject.coverImage || editingProject.thumbnail)} 
                      alt="Current Cover" 
                      className="h-24 w-auto object-cover rounded-lg border border-white/10" 
                    />
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Upload New Cover Image from Local Storage</label>
                  <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-sm" />
                  {thumbnailFile && <p className="text-green-400 text-xs mt-1">✓ {thumbnailFile.name}</p>}
                </div>
              </div>

              {/* Video */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-[#2A4365]/30">
                <p className="text-sm font-bold text-white">Project Video</p>
                {editingProject && editingProject.video && (
                  <div className="mb-2">
                    <p className="text-gray-400 text-xs mb-1">Current Video Path:</p>
                    <span className="text-xs text-[#d4af37] block truncate">{editingProject.video}</span>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Upload Video File from Local Storage</label>
                  <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-sm" />
                  {videoFile && <p className="text-green-400 text-xs mt-1">✓ {videoFile.name}</p>}
                </div>
              </div>

              {/* Multiple Gallery Images Upload */}
              <div className="border border-white/10 rounded-xl p-4 space-y-3 bg-[#2A4365]/30">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-white">Project Gallery Images</p>
                  <span className="text-xs text-gray-400">Upload multiple photos</span>
                </div>

                {/* Existing Gallery Images Preview & Delete */}
                {existingGallery.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Existing Gallery Photos ({existingGallery.length}):</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-black/20 rounded-lg">
                      {existingGallery.map((img, idx) => (
                        <div key={idx} className="relative group rounded-md overflow-hidden h-16 border border-white/10">
                          <img src={getMediaUrl(img)} alt="Gallery" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryImage(idx)}
                            className="absolute inset-0 bg-red-600/80 text-white font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Files Pending Upload */}
                {galleryFiles.length > 0 && (
                  <div>
                    <p className="text-xs text-green-400 mb-2">Selected New Files ({galleryFiles.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {galleryFiles.map((file, idx) => (
                        <span key={idx} className="text-xs bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                          {file.name}
                          <button type="button" onClick={() => removeNewGalleryFile(idx)} className="text-red-400 font-bold hover:text-white ml-1">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-gray-400 text-xs block mb-1">Select Multiple Image Files</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-300 text-sm"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-gray-400 text-xs block mb-1">Or Paste Image URLs (One per line)</label>
                  <textarea rows={2} value={formData.urlImages} onChange={e => setFormData(p => ({...p, urlImages: e.target.value}))}
                    placeholder="https://cloudinary.com/photo1.jpg&#10;https://cloudinary.com/photo2.jpg"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-[#d4af37] focus:outline-none resize-none placeholder-gray-500" />
                </div>
              </div>

              {/* Metadata details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Location (Optional)</label>
                  <input type="text" value={formData.location} onChange={e => setFormData(p => ({...p, location: e.target.value}))} placeholder="e.g. Beverly Hills, CA"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Scope / Area (Optional)</label>
                  <input type="text" value={formData.area} onChange={e => setFormData(p => ({...p, area: e.target.value}))} placeholder="e.g. 8,500 sq ft"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Completion (Optional)</label>
                  <input type="text" value={formData.completion} onChange={e => setFormData(p => ({...p, completion: e.target.value}))} placeholder="e.g. Q4 2025"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Materials (Optional)</label>
                  <input type="text" value={formData.materials} onChange={e => setFormData(p => ({...p, materials: e.target.value}))} placeholder="e.g. Italian Marble, Teak"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#d4af37] focus:outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData(p => ({...p, featured: e.target.checked}))} className="w-4 h-4 accent-[#d4af37]" />
                  <span className="text-gray-300 text-sm">Featured Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.visibility} onChange={e => setFormData(p => ({...p, visibility: e.target.checked}))} className="w-4 h-4 accent-[#d4af37]" />
                  <span className="text-gray-300 text-sm">Visible on Website</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving Project...' : (editingProject ? 'Save Changes' : 'Create Project Gallery')}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      {safeProjects.length === 0 ? (
        <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-10 text-center text-gray-500">No projects yet. Click "+ Add Project" to create your first gallery.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeProjects.map(p => {
            const cover = getMediaUrl(p.coverImage || p.thumbnail);
            const galleryCount = (p.galleryImages?.length || p.images?.length || 0);
            return (
              <div key={p._id} className="bg-[#1A2A40] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
                <div>
                  {cover && (
                    <img 
                      src={cover} 
                      alt={p.title} 
                      className="w-full h-44 object-cover" 
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-white font-bold text-base">{p.title}</h5>
                        <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full inline-block mt-1">{p.category}</span>
                      </div>
                      {p.featured && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">★ Featured</span>}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2">{p.description}</p>
                    <span className="text-xs text-gray-400 block mt-3 font-semibold">{galleryCount} Gallery photos</span>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <div className="flex gap-2 border-t border-white/5 pt-3">
                    <button onClick={() => openEdit(p)} className="flex-1 text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors">Edit Gallery</button>
                    <button onClick={() => handleDelete(p._id)} className="flex-1 text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

