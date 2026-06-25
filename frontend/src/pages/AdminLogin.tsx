import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', { username, password });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="bg-[#1a1a1a] p-10 rounded-2xl border border-white/10 shadow-2xl w-full max-w-md">
        <h2 className="text-[#d4af37] text-3xl font-bold uppercase tracking-widest text-center mb-2">Admin Login</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Prosper Design CMS</p>
        {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              required 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
