import { useState, useEffect } from 'react';
import API from '../api';

export default function BookConsultation() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('');
  const [subService, setSubService] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Auto-fill from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parent = params.get('parent');
    const child = params.get('child');
    if (parent) {
      setProjectType(parent);
    }
    if (child) {
      setSubService(child);
    }
  }, []);

  const validatePhone = (num: string) => {
    const indianPhoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(num.trim());
  };

  const validateEmail = (mail: string) => {
    return mail.endsWith('@gmail.com') || mail.endsWith('@outlook.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setEmailError('');
    setError('');
    setSuccess(false);

    let isValid = true;

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid Indian mobile number (e.g. +91XXXXXXXXXX or 10 digits starting with 6-9).');
      isValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Email must format like @gmail.com or @outlook.com');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);

    const fullServiceSelection = subService ? `${projectType} - ${subService}` : projectType;

    try {
      await API.post('/messages', {
        name,
        phone,
        email,
        service: fullServiceSelection,
        message,
        subject: `Consultation Booking: ${fullServiceSelection}`
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setProjectType('');
      setSubService('');
      setMessage('');
    } catch (err: any) {
      console.log(err);
      console.log(err.response);
      console.log(err.message);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unknown Error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book-consultation" className="py-24 md:py-32 relative bg-[#1D2B42] text-white">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-4">Book Your Free Consultation</h2>
            <p className="text-gray-400 font-light text-lg">Let's transform your ideas into reality.</p>
          </div>

          {success && (
            <div className="bg-green-950/30 border border-green-500/50 text-green-400 text-sm px-6 py-4 rounded-xl mb-8 text-center">
              ✓ Consultation request booked successfully! We will connect with you soon.
            </div>
          )}

          {error && (
            <div className="bg-red-950/30 border border-red-500/50 text-red-400 text-sm px-6 py-4 rounded-xl mb-8 text-center flex flex-col items-center gap-2">
              <span>{error}</span>
              <button onClick={handleSubmit} className="text-[#d4af37] underline font-semibold hover:text-white transition-colors">Retry</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Name *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1D2B42]/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" 
                  placeholder="Your Full Name" 
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone *</label>
                <input 
                  type="text" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#1D2B42]/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" 
                  placeholder="+91 XXXXXXXXXX" 
                />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1D2B42]/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" 
                  placeholder="you@example.com" 
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Type *</label>
                <select 
                  required
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  className="w-full bg-[#1D2B42]/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none"
                >
                  <option value="" className="text-gray-500">Select Project Type</option>
                  <option value="Constructions">Constructions</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Water Bodies">Water Bodies</option>
                  <option value="Playstation">Playstation</option>
                  {/* Keep custom parent options if admin adds others */}
                  {projectType && !['Constructions', 'Interior Design', 'Landscape', 'Water Bodies', 'Playstation'].includes(projectType) && (
                    <option value={projectType}>{projectType}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Read-only Sub Service selected from services */}
            {subService && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold text-[#d4af37]">Selected Sub-Service (Auto-filled)</label>
                <input 
                  type="text" 
                  readOnly
                  value={subService}
                  className="w-full bg-white/5 border border-[#d4af37]/30 rounded-lg py-3 px-4 text-[#d4af37] focus:outline-none cursor-default font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message *</label>
              <textarea 
                rows={4} 
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-[#1D2B42]/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none" 
                placeholder="Briefly describe your project requirements..."
              ></textarea>
            </div>

            <div className="pt-4 text-center">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto px-12 py-4 bg-[#d4af37] text-black uppercase tracking-widest font-bold text-sm hover:bg-white transition-colors duration-300 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Booking...
                  </>
                ) : 'Book Consultation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
