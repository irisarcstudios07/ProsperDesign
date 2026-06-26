import React, { useState, useEffect } from 'react';
import API from '../../api';
import type { Client } from '../../types';

export default function ManageClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add / Edit Client state
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientActive, setClientActive] = useState(true);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const fetchClients = async () => {
    try {
      const { data } = await API.get('/clients');
      const list = data?.data || data;
      setClients(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setClientName('');
    setClientActive(true);
    setShowModal(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setClientName(client.name);
    setClientActive(client.active);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingClient) {
        // Edit existing
        await API.put(`/clients/${editingClient._id}`, {
          name: clientName,
          active: clientActive,
        });
        showSuccessMsg('Client updated successfully');
      } else {
        // Add new
        await API.post('/clients', {
          name: clientName,
          active: clientActive,
        });
        showSuccessMsg('Client added successfully');
      }
      setShowModal(false);
      fetchClients();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    setError('');
    setSuccess('');
    try {
      await API.delete(`/clients/${id}`);
      showSuccessMsg('Client deleted successfully');
      fetchClients();
    } catch (err: any) {
      setError('Failed to delete client');
    }
  };

  const handleToggleActive = async (client: Client) => {
    setError('');
    try {
      await API.put(`/clients/${client._id}`, {
        active: !client.active,
      });
      showSuccessMsg(`Client ${client.active ? 'disabled' : 'enabled'} successfully`);
      fetchClients();
    } catch (err: any) {
      setError('Failed to toggle client state');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clients.length) return;

    const client1 = clients[index];
    const client2 = clients[targetIndex];

    setError('');
    try {
      // Swap order fields on server
      await Promise.all([
        API.put(`/clients/${client1._id}`, { order: client2.order }),
        API.put(`/clients/${client2._id}`, { order: client1.order }),
      ]);
      fetchClients();
    } catch (err: any) {
      setError('Failed to reorder clients');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#d4af37]">Manage Clients</h3>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#d4af37] text-black font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-white transition-colors"
        >
          + Add Client Name
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Clients List */}
      <div className="bg-[#1A2A40] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No clients added yet. Click "+ Add Client Name" to add one.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-300 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Name</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Order Controls</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-light text-white text-base">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(client)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        client.active
                          ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                          : 'bg-red-900/30 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {client.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        disabled={index === clients.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenEditModal(client)}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="text-red-400 hover:text-red-300 font-semibold text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-md bg-[#1A2A40] border border-white/10 rounded-2xl shadow-2xl p-6 text-white">
            <h4 className="text-xl font-bold text-[#d4af37] mb-6">
              {editingClient ? 'Edit Client Name' : 'Add Client Name'}
            </h4>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe / Prestige Group"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#2A4365] border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={clientActive}
                  onChange={(e) => setClientActive(e.target.checked)}
                  className="w-5 h-5 accent-[#d4af37] cursor-pointer"
                />
                <label htmlFor="active" className="text-sm text-gray-300 cursor-pointer select-none">
                  Active (Show on Home Page)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-white rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#d4af37] text-black font-bold hover:bg-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
