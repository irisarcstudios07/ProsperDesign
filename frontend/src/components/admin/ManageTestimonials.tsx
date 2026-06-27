import React, { useState, useEffect } from 'react';
import API from '../../api';

interface Testimonial {
  _id: string;
  clientName: string;
  service: string;
  message: string;
  rating: number;
  order: number;
  visible: boolean;
  createdAt?: string;
}

const EMPTY_FORM = {
  clientName: '',
  service: '',
  message: '',
  rating: 5,
  order: 0,
  visible: true,
};

export default function ManageTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const { data } = await API.get('/testimonials?all=true');
      const list = data?.data || data;
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setError('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, order: items.length + 1 });
    setError('');
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ clientName: t.clientName, service: t.service, message: t.message, rating: t.rating, order: t.order, visible: t.visible });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await API.put(`/testimonials/${editing._id}`, form);
      } else {
        await API.post('/testimonials', form);
      }
      setShowForm(false);
      fetch();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await API.delete(`/testimonials/${id}`);
      setItems(items.filter(t => t._id !== id));
    } catch {
      setError('Delete failed.');
    }
  };

  const toggleVisibility = async (t: Testimonial) => {
    try {
      await API.put(`/testimonials/${t._id}`, { visible: !t.visible });
      setItems(items.map(i => i._id === t._id ? { ...i, visible: !i.visible } : i));
    } catch {
      setError('Toggle failed.');
    }
  };

  if (loading) return <div className="text-gray-400 py-8">Loading testimonials...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Testimonials</h3>
        <button onClick={openAdd} className="bg-[#d4af37] text-black font-bold px-5 py-2 rounded-lg hover:bg-white transition-colors">
          + Add Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <h4 className="text-xl font-bold text-[#d4af37] border-b border-white/10 pb-4">
              {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Client Name *</label>
                  <input
                    required
                    type="text"
                    value={form.clientName}
                    onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))}
                    placeholder="e.g. PVR Group"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Service Category *</label>
                  <input
                    required
                    type="text"
                    value={form.service}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                    placeholder="e.g. Interior Designing"
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1">Testimonial Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Client's review message..."
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Star Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n}>{n} ★</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.visible}
                      onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                    <span className="text-gray-300 text-sm">Visible</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#d4af37] text-black font-bold py-2.5 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Create Testimonial')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-white/20 text-gray-300 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      {items.length === 0 ? (
        <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-10 text-center text-gray-500">
          No testimonials yet. Click "+ Add Testimonial" to create your first.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div
              key={t._id}
              className={`bg-[#1A2A40] rounded-2xl border p-5 flex flex-col md:flex-row md:items-start gap-4 transition-opacity ${t.visible ? 'border-white/10 opacity-100' : 'border-white/5 opacity-60'}`}
            >
              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-white font-bold text-base">{t.clientName}</h4>
                  <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/20">
                    {t.service}
                  </span>
                  <span className="text-xs text-yellow-400">{'★'.repeat(t.rating)}</span>
                  <span className="text-xs text-gray-500">Order: {t.order}</span>
                  {!t.visible && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">Hidden</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">"{t.message}"</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0 mt-1">
                <button
                  onClick={() => toggleVisibility(t)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${t.visible ? 'text-green-400 border-green-400/30 hover:bg-green-400/10' : 'text-gray-400 border-white/10 hover:bg-white/5'}`}
                >
                  {t.visible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => openEdit(t)}
                  className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
