import { useState } from 'react';
import { FiInstagram } from 'react-icons/fi';
import API from '../api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (num: string) => {
    const indianPhoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
    return indianPhoneRegex.test(num.trim());
  };

  const validateEmail = (mail: string) => {
    return mail.endsWith('@gmail.com') || mail.endsWith('@outlook.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    setEmailError('');
    setPhoneError('');
    setError('');
    setSuccess(false);

    if (!validateEmail(email)) {
      setEmailError('Email must format like @gmail.com or @outlook.com');
      isValid = false;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid Indian mobile number (e.g. +91XXXXXXXXXX or 10 digits starting with 6-9).');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      await API.post('/messages', {
        name,
        email,
        phone,
        subject,
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
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
    <section id="contact" className="py-24 md:py-32 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Details */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Get In Touch</h3>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-10">
              Contact Prosper Design
            </h2>
            
            <div className="space-y-8 mb-12">
              <div>
                <h4 className="uppercase tracking-widest text-xs font-bold text-gray-500 mb-2">Phone</h4>
                <p className="text-xl font-light">97005 21522</p>
              </div>
              <div>
                <h4 className="uppercase tracking-widest text-xs font-bold text-gray-500 mb-2">Email</h4>
                <a href="mailto:rambabumiryala4@gmail.com" className="text-xl font-light hover:text-[#d4af37] transition-colors">
                  rambabumiryala4@gmail.com
                </a>
              </div>
              <div>
                <h4 className="uppercase tracking-widest text-xs font-bold text-gray-500 mb-2">Instagram</h4>
                <a 
                  href="https://www.instagram.com/prosper_designs17" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-xl font-light hover:text-[#d4af37] transition-colors"
                >
                  <FiInstagram className="text-[#d4af37]" />
                  @prosper_designs17
                </a>
              </div>
              <div>
                <h4 className="uppercase tracking-widest text-xs font-bold text-gray-500 mb-2">Address</h4>
                <a 
                  href="https://www.google.com/maps/place/Ballem+Vari+St,+Andhra+Pradesh/@16.515107,80.6799996,16.94z/data=!4m15!1m8!3m7!1s0x3a35fb29025b5b11:0xee4b345d3024bc67!2sBallem+Vari+St,+Andhra+Pradesh!3b1!8m2!3d16.5151416!4d80.6827!16s%2Fg%2F11dfjpsw1x!3m5!1s0x3a35fb29025b5b11:0xee4b345d3024bc67!8m2!3d16.5151416!4d80.6827!16s%2Fg%2F11dfjpsw1x?authuser=0&entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-light hover:text-[#d4af37] transition-colors leading-relaxed block"
                >
                  BALLAM VARI STREET,<br />
                  RAMAVARAPADU,<br />
                  VIJAYAWADA
                </a>
              </div>
            </div>
          </div>
          
          {/* Form & Map */}
          <div className="w-full lg:w-2/3 flex flex-col gap-12">
            {success && (
              <div className="bg-green-950/30 border border-green-500/50 text-green-400 text-sm px-6 py-4 rounded-xl text-center">
                ✓ Message sent successfully! We will get back to you soon.
              </div>
            )}

            {error && (
              <div className="bg-red-950/30 border border-red-500/50 text-red-400 text-sm px-6 py-4 rounded-xl text-center flex flex-col items-center gap-2">
                <span>{error}</span>
                <button onClick={handleSubmit} className="text-[#d4af37] underline font-semibold hover:text-white transition-colors">Retry</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#121212] p-8 md:p-12 rounded-2xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600" 
                  placeholder="Your Name" 
                />
                <div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600" 
                    placeholder="Your Email" 
                  />
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600" 
                    placeholder="Your Phone Number *" 
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors placeholder-gray-600" 
                  placeholder="Subject" 
                />
              </div>
              <div className="mb-12">
                <textarea 
                  rows={4} 
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none placeholder-gray-600" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="px-10 py-4 border border-white text-white uppercase tracking-widest font-bold text-sm hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
            
            {/* Map Placeholder */}
            <a 
              href="https://www.google.com/maps/place/Ballem+Vari+St,+Andhra+Pradesh/@16.515107,80.6799996,16.94z/data=!4m15!1m8!3m7!1s0x3a35fb29025b5b11:0xee4b345d3024bc67!2sBallem+Vari+St,+Andhra+Pradesh!3b1!8m2!3d16.5151416!4d80.6827!16s%2Fg%2F11dfjpsw1x!3m5!1s0x3a35fb29025b5b11:0xee4b345d3024bc67!8m2!3d16.5151416!4d80.6827!16s%2Fg%2F11dfjpsw1x?authuser=0&entry=ttu&g_ep=EgoyMDI2MDYyMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[300px] bg-[#121212] rounded-2xl overflow-hidden border border-white/5 relative group block"
            >
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-70 transition-all duration-700" alt="Map View" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="px-6 py-3 bg-black/80 backdrop-blur text-white uppercase tracking-widest text-sm rounded border border-white/10">Location Map</div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
