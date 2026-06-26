import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import API from '../../api';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  subject?: string;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

export default function CustomerMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/messages');
      const extractedData = data?.data || data;
      setMessages(Array.isArray(extractedData) ? extractedData : []);
    } catch (err) {
      setError('Failed to load messages. Make sure the backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    try {
      const { data } = await API.put(`/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? data : m));
    } catch { setError('Failed to mark as read'); }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await API.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
    } catch { setError('Delete failed'); }
  };

  if (loading) return <div className="text-gray-400">Loading messages...</div>;

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-[#d4af37]">Customer Messages</h3>
        <button 
          onClick={() => fetchMessages(true)} 
          disabled={refreshing}
          className="bg-white/5 border border-white/10 hover:border-[#d4af37] text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          title="Refresh Inbox"
        >
          <FiRefreshCw className={`text-white hover:text-[#d4af37] ${refreshing ? 'animate-spin' : ''}`} size={18} />
        </button>
      </div>
      
      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {safeMessages.length === 0 ? (
        <div className="bg-[#1A2A40] rounded-2xl border border-white/10 p-10 text-center text-gray-500">
          No messages yet. They will appear here when customers submit the contact or consultation forms.
        </div>
      ) : (
        <div className="space-y-4">
          {safeMessages.map(msg => (
            <div key={msg._id} className={`bg-[#1A2A40] rounded-2xl border p-5 transition-colors ${msg.readStatus ? 'border-white/10' : 'border-[#d4af37]/40 bg-[#d4af37]/5'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-white font-bold">{msg.name}</h5>
                    {!msg.readStatus && <span className="text-xs bg-[#d4af37] text-black px-2 py-0.5 rounded-full font-bold">NEW</span>}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{msg.email} · {msg.phone}</p>
                  
                  {msg.service && (
                    <div className="mt-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded">
                        Project Type: {msg.service}
                      </span>
                    </div>
                  )}

                  {msg.subject && <p className="text-gray-500 text-xs mt-2">Subject: {msg.subject}</p>}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">{new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 bg-[#2A4365] rounded-lg p-3 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              <div className="flex gap-2">
                {!msg.readStatus && (
                  <button onClick={() => markRead(msg._id)} className="text-xs text-green-400 border border-green-400/30 px-3 py-1.5 rounded-lg hover:bg-green-400/10 transition-colors">✓ Mark as Read</button>
                )}
                <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors">Reply via Email</a>
                <a href={`https://wa.me/${msg.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 border border-emerald-400/30 px-3 py-1.5 rounded-lg hover:bg-emerald-400/10 transition-colors">WhatsApp</a>
                <button onClick={() => deleteMsg(msg._id)} className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
