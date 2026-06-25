import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import HeroSequence from './components/HeroSequence';
import About from './components/About';
import Services from './components/Services';
import ProjectShowcase from './components/ProjectShowcase';
import BookConsultation from './components/BookConsultation';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Public Layout
function PublicSite() {
  return (
    <div id="home" className="bg-[#121212] min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <Navbar />
      <HeroSequence />
      <About />
      <Services />
      <ProjectShowcase />
      <BookConsultation />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicSite />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
