import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import CreateBloom from './pages/CreateBloom';
import BloomView from './pages/BloomView';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBlooms from './pages/MyBlooms';
import Mission from './pages/Mission';
import Debug from './pages/Debug';
import { NavBar, Footer } from './components/layout/Layout';
import { SetupBanner } from './components/layout/SetupBanner';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from '../contexts/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ScrollToTop />
      <SetupBanner />
      <NavBar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<CreateBloom />} />
          <Route path="/view" element={<BloomView />} />
          <Route path="/view/:userId/:bloomId" element={<BloomView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-blooms" element={<MyBlooms />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}