import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import MarketsPage from './pages/MarketsPage';
import GlobalNewsPage from './pages/GlobalNewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route path="/markets" element={<MarketsPage />} />
        <Route path="/news" element={<GlobalNewsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={
          <main className="main-content page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: '8px' }}>Page not found</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>This page doesn't exist.</p>
              <a href="/" className="btn btn-primary">← Back to Home</a>
            </div>
          </main>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
