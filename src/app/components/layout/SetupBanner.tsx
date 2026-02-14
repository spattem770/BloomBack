import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AlertCircle, X, Wrench } from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import { Button } from '../ui/Button';

export function SetupBanner() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    checkDatabaseSetup();
  }, []);

  const checkDatabaseSetup = async () => {
    try {
      // Try to query the blooms table
      const { error } = await supabase
        .from('blooms')
        .select('count')
        .limit(1);

      if (error) {
        if (error.message.includes('relation "blooms" does not exist')) {
          setIsSetupComplete(false);
        } else {
          // Some other error - assume setup is incomplete
          setIsSetupComplete(false);
        }
      } else {
        setIsSetupComplete(true);
      }
    } catch (error) {
      console.error('Error checking database setup:', error);
      setIsSetupComplete(false);
    }
  };

  // Don't show if setup is complete, still checking, or manually dismissed
  if (isSetupComplete === null || isSetupComplete || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              ⚠️ Database Setup Required
            </p>
            <p className="text-xs text-white/90 mt-0.5">
              Your app won't work until you run the SQL setup script. This takes 2 minutes.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/debug">
            <Button 
              size="sm" 
              className="bg-white text-orange-600 hover:bg-gray-100 border-none shadow-sm"
            >
              <Wrench className="w-3 h-3 mr-1.5" />
              Fix Now
            </Button>
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
