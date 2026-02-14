import { Link } from 'react-router';
import { Flower, TreePine, User, LogOut, Bug, Heart, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

export function NavBar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-pink-50 via-white to-rose-50 backdrop-blur-md border-b border-pink-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-2 rounded-full group-hover:scale-110 transition-transform">
              <Heart className="h-6 w-6 text-pink-600 fill-pink-600" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600">
              BloomBack
            </span>
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">💝 Valentine's</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Mission link */}
            <Link to="/mission">
              <Button variant="ghost" size="sm">
                <Target className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Mission</span>
              </Button>
            </Link>
            
            {/* Debug link - visible in development */}
            <Link to="/debug" title="Run diagnostics">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Bug className="w-4 h-4" />
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to="/my-blooms">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    My Blooms
                  </Button>
                </Link>
                <Link to="/create">
                  <Button size="sm">Send a Bloom</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/create">
                  <Button size="sm">Send a Bloom</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 fill-white" />
            <span className="font-bold text-lg">BloomBack</span>
            <span className="text-sm opacity-90">💝 Valentine's Edition</span>
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link to="/mission" className="hover:text-pink-200 transition-colors">
              Our Mission
            </Link>
            <Link to="/create" className="hover:text-pink-200 transition-colors">
              Send a Bloom
            </Link>
            <Link to="/signup" className="hover:text-pink-200 transition-colors">
              Sign Up
            </Link>
          </div>
          
          <div className="text-sm opacity-90 text-center md:text-right">
            <p>© {new Date().getFullYear()} BloomBack. Plant real trees, share lasting love.</p>
            <p className="text-xs mt-1 text-pink-100">🌳 Making the world greener, one bloom at a time</p>
          </div>
        </div>
      </div>
    </footer>
  );
}