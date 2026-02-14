import { Heart, TreePine, Globe, Users, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';

export default function Mission() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFCF8] via-rose-50/30 to-[#FDFCF8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-6">
            <Heart className="h-8 w-8 text-pink-600 fill-pink-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transforming fleeting gestures into lasting impact by replacing flowers that wilt with trees that grow forever.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-rose-100 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-rose-500" />
              <h2 className="text-3xl font-bold text-gray-900">The Problem We're Solving</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Every year, millions of flower bouquets are purchased as gifts of love—only to wilt and end up in the trash within days. While the gesture is beautiful, the impact is temporary and often wasteful.
              </p>
              <p>
                We asked ourselves: <span className="font-semibold text-rose-600">What if we could capture that same sentiment, but create something that lasts forever?</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-50/50 to-green-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full mb-4">
              <TreePine className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BloomBack lets you send stunning digital flower bouquets that plant <span className="font-bold text-emerald-600">real, living trees</span> in areas that need reforestation most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Beautiful Gifting</h3>
              <p className="text-gray-600 text-sm">
                Send personalized digital bouquets with heartfelt messages and photos that never fade away.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TreePine className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real Impact</h3>
              <p className="text-gray-600 text-sm">
                Every bloom plants a real tree in Madagascar, helping combat deforestation and climate change.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-emerald-100">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lasting Memories</h3>
              <p className="text-gray-600 text-sm">
                Track your tree's growth over time and revisit the memory page whenever you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-4">
              <Target className="h-6 w-6 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-rose-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">💚</span> Sustainability First
              </h3>
              <p className="text-gray-700">
                We believe every action should leave the world better than we found it. That's why we partner with verified reforestation projects and ensure every tree planted makes a real difference.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-rose-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">💕</span> Love That Lasts
              </h3>
              <p className="text-gray-700">
                Meaningful relationships deserve meaningful gifts. We help you create memories that grow stronger over time, not gifts that fade away.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md border border-rose-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🌍</span> Global Impact, Personal Touch
              </h3>
              <p className="text-gray-700">
                While our trees plant globally, every bloom is deeply personal. We combine environmental action with heartfelt connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join the Movement
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every bloom you send helps reforest our planet and creates a lasting memory. Start making an impact today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button size="lg" className="w-full sm:w-auto">
                Send Your First Bloom
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}