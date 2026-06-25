import React, { useState, useEffect } from 'react';
import API from '../../api';

export default function AdminSettings() {
  const [form, setForm] = useState({
    businessName: '', phone: '', email: '', whatsapp: '', address: '', heroTitle: '', heroSubtitle: '',
    facebook: '', instagram: '', twitter: '', linkedin: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/settings').then(({ data }) => {
      setForm({
        businessName: data.businessName || '',
        phone: data.phone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        address: data.address || '',
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        facebook: data.socialLinks?.facebook || '',
        instagram: data.socialLinks?.instagram || '',
        twitter: data.socialLinks?.twitter || '',
        linkedin: data.socialLinks?.linkedin || '',
      });
      setCurrentLogo(data.logo || '');
    }).catch(() => {
      setError('Failed to load settings');
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) fd.append('logo', logoFile);
      const { data } = await API.put('/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Settings saved successfully!');
      setCurrentLogo(data.logo || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;

  const field = (label: string, key: keyof typeof form, type = 'text') => (
    <div>
      <label className="text-gray-400 text-sm block mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#d4af37] focus:outline-none" />
    </div>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold text-[#d4af37] mb-6">Admin Settings</h3>
      {error && <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
          <h4 className="text-white font-bold mb-4">Business Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Business Name', 'businessName')}
            {field('Phone', 'phone', 'tel')}
            {field('Email', 'email', 'email')}
            {field('WhatsApp Number', 'whatsapp', 'tel')}
          </div>
          <div className="mt-4">
            {field('Address', 'address')}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
          <h4 className="text-white font-bold mb-4">Hero Section</h4>
          <div className="space-y-4">
            {field('Hero Title', 'heroTitle')}
            {field('Hero Subtitle', 'heroSubtitle')}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
          <h4 className="text-white font-bold mb-4">Social Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Facebook URL', 'facebook')}
            {field('Instagram URL', 'instagram')}
            {field('Twitter URL', 'twitter')}
            {field('LinkedIn URL', 'linkedin')}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6">
          <h4 className="text-white font-bold mb-4">Logo</h4>
          {currentLogo && (
            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-1">Current Logo:</p>
              <img 
                src={currentLogo.startsWith('http') ? currentLogo : `http://localhost:5000/${currentLogo}`} 
                alt="Current Logo" 
                className="h-16 w-auto object-contain bg-white/10 p-1 rounded" 
              />
            </div>
          )}
          <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)}
            className="w-full bg-[#121212] border border-white/20 rounded-lg px-4 py-2 text-gray-400 text-sm" />
          {logoFile && <p className="text-green-400 text-xs mt-2">✓ {logoFile.name}</p>}
        </div>

        <button type="submit" disabled={saving} className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}
