import { Quote } from 'lucide-react';

interface MemoryCardProps {
  message: string;
  senderName: string;
  photoUrl?: string;
  className?: string;
}

export function MemoryCard({ message, senderName, photoUrl, className }: MemoryCardProps) {
  return (
    <div className={`bg-white p-8 rounded-3xl shadow-lg border border-rose-100 ${className}`}>
      {photoUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
          <img 
            src={photoUrl} 
            alt="Shared memory" 
            className="w-full h-auto max-h-[600px] object-contain bg-gradient-to-br from-rose-50 to-pink-50"
          />
        </div>
      )}
      
      <div className="relative">
        <Quote className="absolute -top-4 -left-2 w-8 h-8 text-rose-200 fill-rose-100" />
        <p className="text-gray-700 text-lg leading-relaxed italic relative z-10 pt-2">
          "{message}"
        </p>
        <div className="mt-6 flex items-center justify-end">
          <span className="text-sm text-gray-400 mr-2">Sent with love by</span>
          <span className="font-bold text-rose-500">{senderName}</span>
        </div>
      </div>
    </div>
  );
}