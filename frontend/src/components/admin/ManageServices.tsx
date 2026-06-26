import React, { useState, useEffect, useRef } from 'react';
import API from '../../api';
import type { Service, ChildService, GalleryImage } from '../../types';

type AdminLevel = 'parents' | 'children' | 'child-detail';

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Navigation
  const [adminLevel, setAdminLevel] = useState<AdminLevel>('parents');
  const [activeParent, setActiveParent] = useState<Service | null>(null);
  const [activeChildIdx, setActiveChildIdx] = useState<number | null>(null);

  // Parent modal
  const [showParentModal, setShowParentModal] = useState(false);
  const [editingParent, setEditingParent] = useState<Service | null>(null);
  const [parentTitle, setParentTitle] = useState('');
  const [parentCoverFile, setParentCoverFile] = useState<File | null>(null);
  const [parentCoverUrl, setParentCoverUrl] = useState('');

  // Add Child modal
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildTitle, setNewChildTitle] = useState('');

  // Child detail editor state
  const [childTitle, setChildTitle] = useState('');
  const [childDescription, setChildDescription] = useState('');
  const [childFeatures, setChildFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [childCoverFile, setChildCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      const extracted = data?.data || data;
      setServices(Array.isArray(extracted) ? extracted : []);
    } catch {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // Sync active parent after refetch
  useEffect(() => {
    if (activeParent && services.length > 0) {
      const fresh = services.find(s => s._id === activeParent._id);
      if (fresh) setActiveParent(fresh);
    }
  }, [services]);

  // Sync child detail editor when activeChildIdx changes
  useEffect(() => {
    if (activeParent && activeChildIdx !== null) {
      const child = activeParent.children[activeChildIdx];
      if (child) {
        setChildTitle(child.title);
        setChildDescription(child.description || '');
        setChildFeatures(child.features || []);
        setChildCoverFile(null);
        setGalleryFiles([]);
      }
    }
  }, [activeParent, activeChildIdx]);

  // ── PARENT CRUD ─────────────────────────────────────────────

  const openAddParent = () => {
    setEditingParent(null);
    setParentTitle('');
    setParentCoverFile(null);
    setParentCoverUrl('');
    setShowParentModal(true);
  };

  const openEditParent = (parent: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParent(parent);
    setParentTitle(parent.title);
    setParentCoverUrl(parent.coverImage || '');
    setParentCoverFile(null);
    setShowParentModal(true);
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', parentTitle);
      if (parentCoverUrl) fd.append('coverImageUrl', parentCoverUrl);
      if (parentCoverFile) fd.append('coverImage', parentCoverFile);
      if (editingParent) {
        fd.append('children', JSON.stringify(editingParent.children));
        await API.put(`/services/${editingParent._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Parent updated successfully');
      } else {
        fd.append('children', JSON.stringify([]));
        await API.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showSuccess('Parent category created');
      }
      setShowParentModal(false);
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteParent = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this parent service and ALL its children?')) return;
    try {
      await API.delete(`/services/${id}`);
      showSuccess('Parent deleted');
      fetchServices();
    } catch {
      setError('Delete failed');
    }
  };

  // ── ADD CHILD ────────────────────────────────────────────────

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeParent || !newChildTitle.trim()) return;
    setSaving(true);
    setError('');
    try {
      const updatedChildren = [...activeParent.children, { title: newChildTitle.trim(), coverImage: '', description: '', features: [], gallery: [] } as ChildService];
      await API.put(`/services/${activeParent._id}`, { children: updatedChildren });
      setShowAddChildModal(false);
      setNewChildTitle('');
      showSuccess('Child service added');
      await fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Add child failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChild = async (childIdx: number) => {
    if (!activeParent) return;
    if (!confirm('Delete this child service and all its gallery images?')) return;
    try {
      const updatedChildren = activeParent.children.filter((_, i) => i !== childIdx);
      await API.put(`/services/${activeParent._id}`, { children: updatedChildren });
      showSuccess('Child deleted');
      if (adminLevel === 'child-detail') { setAdminLevel('children'); setActiveChildIdx(null); }
      await fetchServices();
    } catch {
      setError('Delete failed');
    }
  };

  // ── CHILD DETAIL SAVE ────────────────────────────────────────

  const handleSaveChildMeta = async () => {
    if (!activeParent || activeChildIdx === null) return;
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', childTitle);
      fd.append('description', childDescription);
      fd.append('features', JSON.stringify(childFeatures));
      if (childCoverFile) fd.append('coverImage', childCoverFile);
      await API.put(`/services/${activeParent._id}/children/${activeChildIdx}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showSuccess('Saved successfully');
      setChildCoverFile(null);
      await fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // ── GALLERY ──────────────────────────────────────────────────

  const handleGalleryUpload = async () => {
    if (!activeParent || activeChildIdx === null || galleryFiles.length === 0) return;
    setUploadingGallery(true);
    setError('');
    try {
      const fd = new FormData();
      galleryFiles.forEach(f => fd.append('gallery', f));
      await API.post(`/services/${activeParent._id}/children/${activeChildIdx}/gallery`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      showSuccess(`${galleryFiles.length} image(s) uploaded`);
      setGalleryFiles([]);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      await fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (imgIdx: number) => {
    if (!activeParent || activeChildIdx === null) return;
    if (!confirm('Delete this gallery image?')) return;
    try {
      await API.delete(`/services/${activeParent._id}/children/${activeChildIdx}/gallery/${imgIdx}`);
      showSuccess('Image deleted');
      await fetchServices();
    } catch {
      setError('Delete image failed');
    }
  };

  const handleMoveGalleryImage = async (imgIdx: number, direction: 'up' | 'down') => {
    if (!activeParent || activeChildIdx === null) return;
    const child = activeParent.children[activeChildIdx];
    const gallery = [...(child.gallery || [])];
    const swapIdx = direction === 'up' ? imgIdx - 1 : imgIdx + 1;
    if (swapIdx < 0 || swapIdx >= gallery.length) return;
    [gallery[imgIdx], gallery[swapIdx]] = [gallery[swapIdx], gallery[imgIdx]];
    // reconstruct order relative to original
    const originalGallery = child.gallery || [];
    const newOrder = gallery.map(item => originalGallery.findIndex(g => g.url === item.url));
    try {
      await API.put(`/services/${activeParent._id}/children/${activeChildIdx}/gallery/reorder`, { order: newOrder });
      await fetchServices();
    } catch {
      setError('Reorder failed');
    }
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !childFeatures.includes(trimmed)) {
      setChildFeatures([...childFeatures, trimmed]);
    }
    setFeatureInput('');
  };

  const removeFeature = (i: number) => {
    setChildFeatures(childFeatures.filter((_, idx) => idx !== i));
  };

  // Active child detail
  const activeChild: ChildService | null =
    activeParent && activeChildIdx !== null ? activeParent.children[activeChildIdx] : null;

  if (loading) return <div className="text-gray-400 py-10 text-center">Loading services...</div>;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          {adminLevel !== 'parents' && (
            <button
              onClick={() => {
                if (adminLevel === 'child-detail') { setAdminLevel('children'); setActiveChildIdx(null); }
                else { setAdminLevel('parents'); setActiveParent(null); }
              }}
              className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors flex items-center gap-1"
            >
              ←
            </button>
          )}
          <h3 className="text-2xl font-bold text-[#d4af37]">
            {adminLevel === 'parents' && 'Manage Services'}
            {adminLevel === 'children' && activeParent?.title}
            {adminLevel === 'child-detail' && activeChild?.title}
          </h3>
          {adminLevel !== 'parents' && (
            <span className="text-gray-500 text-sm">
              {adminLevel === 'children' && `· ${activeParent?.children.length || 0} child services`}
              {adminLevel === 'child-detail' && `· ${activeChild?.gallery?.length || 0} gallery images`}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {adminLevel === 'parents' && (
            <button onClick={openAddParent} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors text-sm">
              + Add Category
            </button>
          )}
          {adminLevel === 'children' && (
            <button onClick={() => setShowAddChildModal(true)} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors text-sm">
              + Add Child Service
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {successMsg && <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

      {/* ════════════════════════════════════════════════════
          LEVEL 1 — PARENT CATEGORIES
      ════════════════════════════════════════════════════ */}
      {adminLevel === 'parents' && (
        <div>
          {services.length === 0 ? (
            <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-12 text-center text-gray-500">
              No categories yet. Click "+ Add Category" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map(parent => (
                <div
                  key={parent._id}
                  onClick={() => { setActiveParent(parent); setAdminLevel('children'); }}
                  className="bg-[#1A2A40] rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#d4af37]/40 transition-colors group"
                >
                  <div className="flex items-center gap-4 p-5 border-b border-white/5">
                    {parent.coverImage ? (
                      <img src={parent.coverImage} alt={parent.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-xs text-gray-500 border border-white/10 flex-shrink-0">No Cover</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base group-hover:text-[#d4af37] transition-colors truncate">{parent.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{parent.children?.length || 0} child service{(parent.children?.length || 0) !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={(e) => openEditParent(parent, e)} className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors">
                        Edit
                      </button>
                      <button onClick={(e) => handleDeleteParent(parent._id, e)} className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between">
                    <div className="flex gap-1.5 overflow-hidden">
                      {parent.children.slice(0, 5).map((c, i) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full truncate max-w-[80px]">{c.title}</span>
                      ))}
                      {parent.children.length > 5 && <span className="text-[10px] text-gray-500">+{parent.children.length - 5} more</span>}
                    </div>
                    <span className="text-[#d4af37] text-xs group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          LEVEL 2 — CHILD SERVICES
      ════════════════════════════════════════════════════ */}
      {adminLevel === 'children' && activeParent && (
        <div>
          {activeParent.children.length === 0 ? (
            <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-12 text-center text-gray-500">
              No child services yet. Click "+ Add Child Service" to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {activeParent.children.map((child, idx) => (
                <div
                  key={idx}
                  onClick={() => { setActiveChildIdx(idx); setAdminLevel('child-detail'); }}
                  className="bg-[#1A2A40] rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#d4af37]/40 transition-colors group"
                >
                  <div className="relative h-40 bg-white/5">
                    {child.coverImage ? (
                      <img src={child.coverImage} alt={child.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Cover Image</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/60 text-[#d4af37] text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                        {child.gallery?.length || 0} photos
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="text-white font-bold text-sm group-hover:text-[#d4af37] transition-colors truncate">{child.title}</h5>
                    {child.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">{child.description}</p>
                    )}
                    {child.features && child.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {child.features.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-[9px] bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-2 py-0.5 rounded-full">{f}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                      <span className="text-[#d4af37] text-xs group-hover:translate-x-1 transition-transform">Edit →</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChild(idx); }}
                        className="text-[10px] text-red-400 border border-red-400/20 px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          LEVEL 3 — CHILD DETAIL EDITOR
      ════════════════════════════════════════════════════ */}
      {adminLevel === 'child-detail' && activeParent && activeChildIdx !== null && activeChild && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* LEFT: Metadata Editor */}
          <div className="space-y-6">
            <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-6 space-y-5">
              <h4 className="text-white font-bold text-base border-b border-white/5 pb-3">Service Details</h4>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Title *</label>
                <input
                  type="text"
                  value={childTitle}
                  onChange={e => setChildTitle(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={childDescription}
                  onChange={e => setChildDescription(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none resize-none text-sm leading-relaxed"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Features / Highlights</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {childFeatures.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs px-3 py-1 rounded-full">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300 ml-1 font-bold leading-none">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="Add feature & press Enter"
                    className="flex-1 bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
                  />
                  <button onClick={addFeature} className="bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3 py-2 rounded-lg text-sm hover:bg-[#d4af37]/30 transition-colors">
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">Cover Image</label>
                {activeChild.coverImage && (
                  <img src={activeChild.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg border border-white/10 mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setChildCoverFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-400 text-xs"
                />
                {childCoverFile && <p className="text-green-400 text-xs mt-1">✓ {childCoverFile.name}</p>}
              </div>

              <button
                onClick={handleSaveChildMeta}
                disabled={saving}
                className="w-full bg-[#d4af37] text-black font-bold py-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-50 text-sm"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* RIGHT: Gallery Manager */}
          <div className="space-y-6">
            <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-6 space-y-5">
              <h4 className="text-white font-bold text-base border-b border-white/5 pb-3">
                Gallery · {activeChild.gallery?.length || 0} Images
              </h4>

              {/* Upload */}
              <div className="space-y-2">
                <label className="text-gray-400 text-xs uppercase tracking-wider block">Upload Gallery Images</label>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => setGalleryFiles(Array.from(e.target.files || []))}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-400 text-xs"
                />
                {galleryFiles.length > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-green-400 text-xs">✓ {galleryFiles.length} file(s) selected</p>
                    <button
                      onClick={handleGalleryUpload}
                      disabled={uploadingGallery}
                      className="bg-[#d4af37] text-black font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {uploadingGallery ? 'Uploading...' : `Upload ${galleryFiles.length} Image${galleryFiles.length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Grid */}
              {(!activeChild.gallery || activeChild.gallery.length === 0) ? (
                <div className="text-center text-gray-500 text-sm py-8 border border-dashed border-white/10 rounded-xl">
                  No gallery images yet. Upload images above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(activeChild.gallery as GalleryImage[]).map((img, imgIdx) => (
                    <div key={imgIdx} className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10" style={{ aspectRatio: '4/3' }}>
                      <img src={img.url} alt={img.caption || `Image ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMoveGalleryImage(imgIdx, 'up')}
                            disabled={imgIdx === 0}
                            className="w-7 h-7 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white text-xs transition-colors flex items-center justify-center"
                            title="Move Up"
                          >↑</button>
                          <button
                            onClick={() => handleMoveGalleryImage(imgIdx, 'down')}
                            disabled={imgIdx === (activeChild.gallery?.length || 0) - 1}
                            className="w-7 h-7 rounded bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white text-xs transition-colors flex items-center justify-center"
                            title="Move Down"
                          >↓</button>
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryImage(imgIdx)}
                          className="bg-red-500/80 hover:bg-red-500 text-white text-[10px] px-3 py-1 rounded-full transition-colors font-semibold"
                        >
                          Delete
                        </button>
                        <p className="text-white/70 text-[9px] text-center truncate w-full">{img.caption || `Image ${imgIdx + 1}`}</p>
                      </div>
                      {/* Index badge */}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {imgIdx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PARENT MODAL ─────────────────────────────────────── */}
      {showParentModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-md">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">
              {editingParent ? 'Edit Category' : 'New Parent Category'}
            </h4>
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Category Title *</label>
                <input
                  required
                  type="text"
                  value={parentTitle}
                  onChange={e => setParentTitle(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Cover Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={parentCoverUrl}
                  onChange={e => setParentCoverUrl(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Or Upload Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setParentCoverFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-3 py-2 text-gray-400 text-sm"
                />
                {parentCoverFile && <p className="text-green-400 text-xs mt-1">✓ {parentCoverFile.name}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingParent ? 'Save Changes' : 'Create')}
                </button>
                <button type="button" onClick={() => setShowParentModal(false)} className="flex-1 border border-white/20 text-gray-400 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD CHILD MODAL ──────────────────────────────────── */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-md">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">
              Add Child Service to <span className="text-white">{activeParent?.title}</span>
            </h4>
            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Service Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Japanese Garden"
                  value={newChildTitle}
                  onChange={e => setNewChildTitle(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <p className="text-gray-500 text-xs">You can add cover image, description, features, and gallery images after creating the service.</p>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#d4af37] text-black font-bold py-2.5 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowAddChildModal(false)} className="flex-1 border border-white/20 text-gray-400 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
