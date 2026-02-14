import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/Button';
import { Camera, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { createBloom } from '../../api/blooms';

interface CreateFormValues {
  recipientName: string;
  senderName: string;
  message: string;
}

export default function CreateBloom() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateFormValues>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const onSubmit = async (data: CreateFormValues) => {
    setIsSending(true);

    try {
      if (user && session) {
        // User is logged in - save to database
        console.log('🌸 Creating bloom for logged-in user:', user.id);
        
        const bloom = await createBloom({
          recipient_name: data.recipientName,
          sender_name: data.senderName,
          message: data.message,
          photo_url: photoPreview || null,
        });

        console.log('✅ Bloom created successfully!', bloom.id);

        toast.success(`Bloom sent to ${data.recipientName}! 🌸`, {
          description: 'Your bloom has been saved to your account.',
          duration: 5000,
        });

        // Navigate to the bloom view page with state data
        const bouquetData = {
          recipientName: data.recipientName,
          senderName: data.senderName,
          message: data.message,
          photoUrl: photoPreview || null,
          treeSeed: Math.random()
        };
        
        navigate(`/view/${user.id}/${bloom.id}`, { state: bouquetData });
      } else {
        // User not logged in - save locally and show signup prompt
        const bouquetData = { 
          recipientName: data.recipientName,
          senderName: data.senderName,
          message: data.message,
          photoUrl: photoPreview || null,
          treeSeed: Math.random()
        };
        
        localStorage.setItem('lastBouquet', JSON.stringify(bouquetData));

        toast.success(`Bloom sent to ${data.recipientName}! 🌸`, {
          description: 'Create an account to track your blooms.',
          duration: 5000,
        });

        // Show signup prompt
        setShowSignupPrompt(true);
        setIsSending(false);
        
        // Navigate to view page after a short delay
        setTimeout(() => {
          navigate('/view', { state: bouquetData });
        }, 2000);
        return;
      }
    } catch (error) {
      console.error('Error creating bloom:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send bloom. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('relation "blooms" does not exist')) {
          errorMessage = 'Database not set up. Please run the SQL setup script first.';
        } else if (error.message.includes('permission denied') || error.message.includes('policy')) {
          errorMessage = 'Permission denied. Please set up Row Level Security policies.';
        } else if (error.message.includes('Not logged in')) {
          errorMessage = 'Please log in to save your bloom.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage, {
        description: 'Check SUPABASE_SETUP.md or visit /debug for help',
        duration: 7000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {!user && (
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6 text-center">
            <p className="text-pink-800 text-sm">
              <Link to="/login" className="font-semibold underline hover:text-pink-900">
                Log in
              </Link>
              {' '}or{' '}
              <Link to="/signup" className="font-semibold underline hover:text-pink-900">
                create an account
              </Link>
              {' '}to track your blooms as they grow! 💕
            </p>
          </div>
        )}

        {/* Create Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Create Your Valentine Bloom 💝</h1>
            <p className="text-pink-100 mt-2">Send a gift that grows. Forever.</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                    To (Recipient Name)
                  </label>
                  <input
                    {...register("recipientName", { required: "Recipient name is required" })}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="e.g. Alice"
                  />
                  {errors.recipientName && <p className="text-red-500 text-xs mt-1">{errors.recipientName.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                    From (Your Name)
                  </label>
                  <input
                    {...register("senderName", { required: "Your name is required" })}
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                    placeholder="e.g. Bob"
                  />
                  {errors.senderName && <p className="text-red-500 text-xs mt-1">{errors.senderName.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  {...register("message", { required: "Message is required" })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow resize-none"
                  placeholder="Write something sweet..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a Memory Photo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center justify-center w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </label>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Upload a photo of you two.</p>
                    <p className="text-xs mt-1">Supports JPG, PNG.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button type="submit" size="lg" className="w-full" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Plant Tree & Send Bloom'}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By clicking send, you are theoretically planting a tree in Madagascar.
                </p>
              </div>
            </form>

            {showSignupPrompt && !user && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl text-center">
                <p className="text-emerald-900 font-semibold mb-3">
                  🌟 Want to track this bloom as it grows?
                </p>
                <Link to="/signup">
                  <Button size="lg" className="w-full">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}