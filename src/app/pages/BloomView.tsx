import { useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams, useParams } from 'react-router';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

import { Bouquet } from '../components/features/Bouquet';
import { TreeGrowth } from '../components/features/TreeGrowth';
import { MemoryCard } from '../components/features/MemoryCard';
import { Button } from '../components/ui/Button';
import { Share2, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { fetchBloom } from '../../api/blooms';
import { toast } from 'sonner';

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

export default function BloomView() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { userId, bloomId } = useParams();
  const { width, height } = useWindowDimensions();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bloomData, setBloomData] = useState<any>(null);

  // Debug logging
  console.log('🌸 BloomView Debug:', {
    hasLocationState: !!location.state,
    locationState: location.state,
    bloomData,
    userId,
    bloomId
  });

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Determine data source
  let data = location.state || bloomData;

  // If userId and bloomId are in URL, fetch from database (unless we already have state data)
  useEffect(() => {
    if (userId && bloomId && !location.state && !bloomData) {
      fetchBloomFromDatabase();
    }
  }, [userId, bloomId, location.state, bloomData]);

  const fetchBloomFromDatabase = async () => {
    setLoading(true);
    try {
      const bloom = await fetchBloom(userId!, bloomId!);
      
      // Transform the bloom data to match the expected format
      const transformedData = {
        recipientName: bloom.recipient_name,
        senderName: bloom.sender_name,
        senderEmail: bloom.sender_email,
        message: bloom.message,
        photoUrl: bloom.photo_url,
        treeSeed: bloom.tree_seed,
      };
      
      setBloomData(transformedData);
    } catch (error) {
      console.error('Error fetching bloom:', error);
      toast.error('Failed to load bloom');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    const pTo = searchParams.get('to');
    const pFrom = searchParams.get('from');
    const pMsg = searchParams.get('msg');
    
    // Only use params if at least one meaningful field exists
    if (pTo || pFrom || pMsg) {
       data = {
        recipientName: pTo || "Friend",
        senderName: pFrom || "A Secret Admirer",
        message: pMsg || "Thinking of you this Valentine's Day! 💕",
        photoUrl: searchParams.get('img') || null
      };
    }
  }

  if (!data) {
    const saved = localStorage.getItem('lastBouquet');
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved bouquet", e);
      }
    }
  }

  // Final fallback
  if (!data) {
    data = {
      recipientName: "Friend",
      senderName: "A Secret Admirer",
      message: "Thinking of you this Valentine's Day! 💕",
      photoUrl: null
    };
  }

  const copyShareLink = () => {
    const url = userId && bloomId 
      ? `${window.location.origin}/view/${userId}/${bloomId}`
      : (() => {
          const currentUrl = new URL(window.location.href);
          if (!currentUrl.searchParams.has('to')) {
            currentUrl.searchParams.set('to', data.recipientName);
            currentUrl.searchParams.set('from', data.senderName);
            currentUrl.searchParams.set('msg', data.message);
          }
          return currentUrl.toString();
        })();
    
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const getShareUrl = () => {
    if (userId && bloomId) {
      return `${window.location.origin}/view/${userId}/${bloomId}`;
    }
    
    const url = new URL(window.location.href);
    if (!url.searchParams.has('to')) {
        url.searchParams.set('to', data.recipientName);
        url.searchParams.set('from', data.senderName);
        url.searchParams.set('msg', data.message);
    }
    return url.toString();
  };

  const shareViaEmail = () => {
    const shareUrl = getShareUrl();
    const subject = encodeURIComponent(`${data.senderName} sent you a BloomBack!`);
    const body = encodeURIComponent(`Check out this beautiful digital bouquet that planted a real tree: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaSMS = () => {
    const shareUrl = getShareUrl();
    const message = encodeURIComponent(`${data.senderName} sent you a BloomBack! 🌸🌳 ${shareUrl}`);
    window.open(`sms:?body=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bloom...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] relative overflow-x-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Greeting */}
        <div className="text-center space-y-4">
          <p className="text-pink-600 font-medium tracking-widest uppercase text-sm">💝 A Valentine's Gift For You</p>
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
            Happy Blooming, {data.recipientName}!
          </h1>
          <p className="text-gray-600">From {data.senderName} with love 💕</p>
        </div>

        {/* The Bouquet - Hero Visual */}
        <div className="flex justify-center my-12">
          <Bouquet className="w-full max-w-md" />
        </div>

        {/* The Message & Memory */}
        <section className="mt-20">
          <MemoryCard 
            message={data.message} 
            senderName={data.senderName} 
            photoUrl={data.photoUrl}
          />
        </section>

        {/* The Impact */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Tree is Growing</h2>
            <p className="text-gray-600">Because of this gift, a real tree has been planted in your name.</p>
          </div>
          <TreeGrowth treeSeed={data.treeSeed} />
        </section>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6 pb-12">
          {/* Share Menu */}
          {showShareMenu && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Share This Bloom</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={copyShareLink}
                  className="flex items-center justify-between px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {linkCopied ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-emerald-600" />
                    )}
                    <span className="text-gray-900 font-medium">
                      {linkCopied ? 'Link Copied!' : 'Copy Link'}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={shareViaEmail}
                  className="flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">Share via Email</span>
                  </div>
                </button>
                
                <button
                  onClick={shareViaSMS}
                  className="flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900 font-medium">Share via Text</span>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setShowShareMenu(false)}
                className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          )}
          
          {/* Main Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="mr-2 w-4 h-4" />
              {showShareMenu ? 'Hide Share Options' : 'Share This Page'}
            </Button>
            <Link to="/create">
              <Button>Send Your Own Bloom</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}