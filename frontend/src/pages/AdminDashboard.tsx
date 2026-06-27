import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageProjects from '../components/admin/ManageProjects';
import ManageServices from '../components/admin/ManageServices';
import CustomerMessages from '../components/admin/CustomerMessages';
import AdminSettings from '../components/admin/AdminSettings';
import ManageClients from '../components/admin/ManageClients';
import ManageTestimonials from '../components/admin/ManageTestimonials';
import API, { getBackendUrl } from '../api';

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

interface Project {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    projectsCount: 0,
    servicesCount: 0,
    unreadMessages: 0,
    clientsCount: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchDashboardData = async () => {
        try {
          const [projectsRes, servicesRes, messagesRes, clientsRes] = await Promise.all([
            API.get('/projects'),
            API.get('/services'),
            API.get('/messages'),
            API.get('/clients'),
          ]);

          const extractedProjects = projectsRes.data.data || projectsRes.data;
          const extractedServices = servicesRes.data.data || servicesRes.data;
          const extractedMessages = messagesRes.data.data || messagesRes.data;
          const extractedClients = clientsRes.data.data || clientsRes.data;

          const projects = Array.isArray(extractedProjects) ? extractedProjects : [];
          const services = Array.isArray(extractedServices) ? extractedServices : [];
          const messages = Array.isArray(extractedMessages) ? extractedMessages : [];
          const clients = Array.isArray(extractedClients) ? extractedClients : [];

          setStats({
            projectsCount: projects.length,
            servicesCount: services.length,
            unreadMessages: messages.filter((m: any) => !m.readStatus).length,
            clientsCount: clients.length,
          });

          setRecentProjects(projects.slice(0, 5));
          setRecentMessages(messages.slice(0, 5));
        } catch (error) {
          console.error('Failed to load dashboard statistics:', error);
        }
      };

      fetchDashboardData();
    }
  }, [activeTab]);

  // Keep date & time updated
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Card & Date/Time */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-r from-[#d4af37]/20 to-[#1A2A40] p-8 rounded-2xl border border-[#d4af37]/30 flex flex-col justify-between">
                <div>
                  <h3 className="text-[#d4af37] text-2xl font-bold mb-2">{getGreeting()}</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Welcome back, <span className="font-bold text-white">ProsperDesign Admin!</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Have a productive day managing your projects and website content.</p>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setActiveTab('projects')} className="bg-[#d4af37] text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors">
                    + Add Project
                  </button>
                  <button onClick={() => setActiveTab('messages')} className="border border-white/20 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
                    View Messages
                  </button>
                </div>
              </div>

              <div className="bg-[#1A2A40] p-8 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
                <span className="text-[#d4af37] uppercase text-xs tracking-widest mb-2 font-bold">System Time</span>
                <p className="text-4xl font-bold tracking-wider text-white mb-2">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-gray-400 text-sm">
                  {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/35 transition-colors cursor-pointer" onClick={() => setActiveTab('projects')}>
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Total Projects</h3>
                <p className="text-4xl font-bold text-white">{stats.projectsCount}</p>
              </div>
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/35 transition-colors cursor-pointer" onClick={() => setActiveTab('services')}>
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Total Services</h3>
                <p className="text-4xl font-bold text-white">{stats.servicesCount}</p>
              </div>
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/35 transition-colors cursor-pointer" onClick={() => setActiveTab('clients')}>
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Total Clients</h3>
                <p className="text-4xl font-bold text-white">{stats.clientsCount}</p>
              </div>
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10 hover:border-[#d4af37]/35 transition-colors cursor-pointer" onClick={() => setActiveTab('messages')}>
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-bold">Unread Messages</h3>
                <p className="text-4xl font-bold text-white">{stats.unreadMessages}</p>
              </div>
            </div>

            {/* Recent items grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <h4 className="text-lg font-bold text-[#d4af37]">Recent Projects</h4>
                  <button onClick={() => setActiveTab('projects')} className="text-xs text-gray-400 hover:text-white underline">Manage</button>
                </div>
                {recentProjects.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No projects uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentProjects.map((p) => (
                      <div key={p._id} className="flex justify-between items-center bg-[#2A4365] p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.thumbnail.startsWith('http') ? p.thumbnail : `${getBackendUrl()}/${p.thumbnail}`} 
                            alt={p.title} 
                            className="w-10 h-10 object-cover rounded-lg" 
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{p.title}</p>
                            <span className="text-xs text-gray-500">{p.category}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Messages */}
              <div className="bg-[#1A2A40] p-6 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <h4 className="text-lg font-bold text-[#d4af37]">Recent Messages</h4>
                  <button onClick={() => setActiveTab('messages')} className="text-xs text-gray-400 hover:text-white underline">View Inbox</button>
                </div>
                {recentMessages.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No messages received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {recentMessages.map((m) => (
                      <div key={m._id} className={`p-3 rounded-lg border flex flex-col justify-between ${m.readStatus ? 'bg-[#2A4365] border-white/5' : 'bg-[#d4af37]/5 border-[#d4af37]/20'}`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-semibold text-white">{m.name}</span>
                          <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-1">{m.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <ManageProjects />;
      case 'services':
        return <ManageServices />;
      case 'clients':
        return <ManageClients />;
      case 'testimonials':
        return <ManageTestimonials />;
      case 'messages':
        return <CustomerMessages />;
      case 'settings':
        return <AdminSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#2A4365] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1A2A40] border-r border-white/10 p-6 flex flex-col">
        <h1 className="text-[#d4af37] text-2xl font-bold uppercase tracking-widest mb-10">Admin Panel</h1>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'projects', label: 'Projects' },
            { id: 'services', label: 'Services' },
            { id: 'clients',       label: 'Clients' },
            { id: 'testimonials',  label: 'Testimonials' },
            { id: 'messages',      label: 'Messages' },
            { id: 'settings', label: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#d4af37]/10 text-[#d4af37] font-bold' 
                  : 'text-gray-400 hover:text-[#d4af37] hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors text-left px-4 py-2 hover:bg-white/5 rounded-lg mt-auto">Logout</button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h2 className="text-3xl font-bold capitalize">
            {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome, ProsperDesign</span>
            <div className="w-10 h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-black font-bold border border-[#d4af37]/30">PD</div>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
}
