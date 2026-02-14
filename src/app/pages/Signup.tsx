import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);

    if (error === 'CONFIRMATION_REQUIRED') {
      // Special case: email confirmation is required
      setShowEmailConfirmation(true);
      setLoading(false);
      toast.success('Account created! Please check your email to confirm 📧');
    } else if (error) {
      toast.error(error);
      setLoading(false);
    } else {
      toast.success('Account created! Welcome to BloomBack 🌸');
      navigate('/my-blooms');
    }
  };

  if (showEmailConfirmation) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6 text-center">
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-white">Check Your Email</h1>
            </div>
            
            <div className="p-8 text-center">
              <p className="text-gray-700 mb-4">
                We've sent a confirmation email to:
              </p>
              <p className="text-emerald-600 font-semibold text-lg mb-6">
                {email}
              </p>
              <p className="text-gray-600 mb-6">
                Click the link in the email to verify your account and start sending blooms! 🌸
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-gray-600 mb-6">
                <p className="font-medium text-emerald-800 mb-2">💡 Didn't receive the email?</p>
                <p>Check your spam folder or wait a few minutes and try signing up again.</p>
              </div>
              <Link to="/login">
                <Button className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6 text-center">
            <h1 className="text-2xl font-bold text-white">Create Account 💕</h1>
            <p className="text-pink-100 mt-2">Start sending Valentine blooms that last forever</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="e.g. Sarah"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                  placeholder="At least 6 characters"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
                <UserPlus className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}