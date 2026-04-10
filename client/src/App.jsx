import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CountryPage from './pages/CountryPage';
import MarketsPage from './pages/MarketsPage';
import GlobalNewsPage from './pages/GlobalNewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontStyle: 'italic' }}>Page not found</h2>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/country/:code"  element={<CountryPage />} />
          <Route path="/markets"        element={<MarketsPage />} />
          <Route path="/news"           element={<GlobalNewsPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/signup"         element={<SignupPage />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}