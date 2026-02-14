import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

type CheckStatus = 'loading' | 'success' | 'error' | 'warning';

interface Check {
  name: string;
  status: CheckStatus;
  message: string;
  details?: string;
}

export default function Debug() {
  const { user, session } = useAuth();
  const [checks, setChecks] = useState<Check[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: Check[] = [];

    // Check 1: Supabase Connection
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      results.push({
        name: 'Supabase Connection',
        status: 'success',
        message: 'Successfully connected to Supabase',
        details: `Project: brajhvtlunjkdeiuwcux`
      });
    } catch (error) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Failed to connect to Supabase',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check 2: Authentication Status
    if (user && session) {
      results.push({
        name: 'Authentication',
        status: 'success',
        message: `Logged in as ${user.email}`,
        details: `User ID: ${user.id}`
      });
    } else {
      results.push({
        name: 'Authentication',
        status: 'warning',
        message: 'Not logged in',
        details: 'You need to be logged in to create and view blooms'
      });
    }

    // Check 3: Blooms Table Exists
    try {
      const { data, error } = await supabase
        .from('blooms')
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation "blooms" does not exist')) {
          results.push({
            name: 'Blooms Table',
            status: 'error',
            message: 'Blooms table does not exist',
            details: '❌ You need to run the SQL setup script in SUPABASE_SETUP.md'
          });
        } else {
          throw error;
        }
      } else {
        results.push({
          name: 'Blooms Table',
          status: 'success',
          message: 'Blooms table exists',
          details: '✅ Table is ready to use'
        });
      }
    } catch (error) {
      results.push({
        name: 'Blooms Table',
        status: 'error',
        message: 'Error checking blooms table',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check 4: RLS Policies (only if user is logged in and table exists)
    if (user && session) {
      try {
        const { data, error } = await supabase
          .from('blooms')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        
        if (error) {
          if (error.message.includes('permission denied') || error.message.includes('policy')) {
            results.push({
              name: 'RLS Policies',
              status: 'error',
              message: 'Row Level Security policies not configured',
              details: '❌ You need to run Step 2 of SUPABASE_SETUP.md'
            });
          } else if (!error.message.includes('relation "blooms" does not exist')) {
            throw error;
          }
        } else {
          results.push({
            name: 'RLS Policies',
            status: 'success',
            message: 'Row Level Security policies are working',
            details: '✅ You can create and read blooms'
          });
        }
      } catch (error) {
        results.push({
          name: 'RLS Policies',
          status: 'error',
          message: 'Error checking RLS policies',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Check 5: Test Bloom Creation (only if logged in and everything else passed)
    if (user && session && results.every(r => r.status === 'success' || r.status === 'warning')) {
      try {
        const testBloom = {
          user_id: user.id,
          recipient_name: 'Test Recipient',
          sender_name: 'Debug Test',
          sender_email: user.email,
          message: 'This is a test bloom from the debug page',
          photo_url: null,
          tree_seed: Math.random(),
          tree_growth_stage: 0,
        };

        const { data, error } = await supabase
          .from('blooms')
          .insert(testBloom)
          .select()
          .single();

        if (error) throw error;

        // Clean up test bloom
        if (data) {
          await supabase.from('blooms').delete().eq('id', data.id);
        }

        results.push({
          name: 'Bloom Creation',
          status: 'success',
          message: 'Successfully created and deleted a test bloom',
          details: '✅ Everything is working! You can create blooms.'
        });
      } catch (error) {
        results.push({
          name: 'Bloom Creation',
          status: 'error',
          message: 'Failed to create test bloom',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setChecks(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <div className="w-6 h-6 border-2 border-gray-300 rounded-full animate-spin border-t-emerald-600" />;
    }
  };

  const getStatusBg = (status: CheckStatus) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const hasErrors = checks.some(c => c.status === 'error');
  const allPassed = checks.length > 0 && checks.every(c => c.status === 'success' || c.status === 'warning');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-emerald-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">System Diagnostics</h1>
            <p className="text-emerald-100 mt-2">Check if your BloomBack app is configured correctly</p>
          </div>

          <div className="p-8">
            {hasErrors && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <h3 className="font-semibold text-red-900 mb-2">⚠️ Setup Required</h3>
                <p className="text-red-800 text-sm">
                  Your app is not fully configured. Please follow the instructions in{' '}
                  <code className="bg-red-100 px-2 py-1 rounded text-xs">SUPABASE_SETUP.md</code>
                  {' '}to set up your database.
                </p>
              </div>
            )}

            {allPassed && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-900 mb-2">✅ All Systems Go!</h3>
                <p className="text-green-800 text-sm">
                  Your BloomBack app is fully configured and ready to use.
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              {checks.map((check, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-xl p-4 ${getStatusBg(check.status)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(check.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{check.name}</h3>
                      <p className="text-sm text-gray-700 mt-1">{check.message}</p>
                      {check.details && (
                        <p className="text-xs text-gray-600 mt-2 font-mono bg-white/50 px-2 py-1 rounded">
                          {check.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Diagnostics Again
                </>
              )}
            </Button>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Check <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">SUPABASE_SETUP.md</code> for setup instructions</li>
                <li>• Make sure you're logged in if you want to test bloom creation</li>
                <li>• Open the browser console (F12) to see detailed error messages</li>
                <li>• Visit your Supabase dashboard to verify table and policies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}