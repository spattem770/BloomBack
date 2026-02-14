import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMyBlooms, type Bloom } from '../../api/blooms';
import { Button } from '../components/ui/Button';
import { Flower2, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function MyBlooms() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [blooms, setBlooms] = useState<Bloom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && session) {
      fetchBlooms();
    }
  }, [user, session, authLoading]);

  const fetchBlooms = async () => {
    try {
      console.log('🌸 Fetching blooms for user:', user?.id);
      
      const data = await fetchMyBlooms();
      
      console.log('✅ Blooms fetched successfully:', data.length);
      setBlooms(data);
    } catch (error) {
      console.error('❌ Error fetching blooms:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load your blooms';
      let errorDescription = 'Please try again later';
      
      if (error instanceof Error) {
        if (error.message.includes('relation "blooms" does not exist')) {
          errorMessage = 'Database not set up';
          errorDescription = 'Please run the SQL setup script in SUPABASE_SETUP.md';
        } else if (error.message.includes('permission denied') || error.message.includes('policy')) {
          errorMessage = 'Permission denied';
          errorDescription = 'Please set up Row Level Security policies';
        } else if (error.message.includes('Not logged in')) {
          errorMessage = 'Not logged in';
          errorDescription = 'Please log in to view your blooms';
        } else {
          errorDescription = error.message;
        }
      }
      
      toast.error(errorMessage, {
        description: errorDescription + ' - Visit /debug for help',
        duration: 7000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your blooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Blooms</h1>
            <p className="text-gray-600 mt-2">Track all the blooms you've sent</p>
          </div>
          <Link to="/create">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Send New Bloom
            </Button>
          </Link>
        </div>

        {blooms.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Flower2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No blooms yet</h2>
            <p className="text-gray-600 mb-6">Start spreading joy by sending your first bloom!</p>
            <Link to="/create">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Bloom
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blooms.map((bloom) => (
              <div 
                key={bloom.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/view/${user?.id}/${bloom.id}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-emerald-100 to-green-50 relative overflow-hidden">
                  {bloom.photo_url && (
                    <img 
                      src={bloom.photo_url} 
                      alt="Memory" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-emerald-700">
                    🌱 Growing
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        To {bloom.recipient_name}
                      </h3>
                      <p className="text-sm text-gray-600">From {bloom.sender_name}</p>
                    </div>
                    <Flower2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {bloom.message}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(bloom.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}