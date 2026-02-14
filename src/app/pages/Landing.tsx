import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { ArrowRight, Flower, TreeDeciduous, Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-rose-50 to-white min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl">💝</span>
                <span className="text-sm font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">Valentine's Day Special</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8">
                Send Love.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600">Plant Forever.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Why send flowers that die in 3 days? 💐 BloomBack bouquets plant real trees 
                that grow for <span className="text-emerald-600 font-semibold">decades</span>. The perfect gift for your Valentine and the planet. 🌳💚
              </p>
              <Link to="/create">
                <Button size="lg" className="group">
                  Send a Valentine Bloom 💕
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-rose-300/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How BloomBack Works 💕</h2>
            <p className="text-gray-600 mt-2">A gift that keeps on giving</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Flower className="w-10 h-10 text-pink-500" />,
                title: "1. Send a Digital Bouquet",
                desc: "Choose a beautifully animated bouquet that never wilts. Perfect for Valentine's Day! 💐"
              },
              {
                icon: <TreeDeciduous className="w-10 h-10 text-emerald-600" />,
                title: "2. We Plant a Real Tree",
                desc: "Every bouquet funds the planting of a native tree in a reforestation project. 🌳"
              },
              {
                icon: <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />,
                title: "3. Watch Love Grow",
                desc: "Both of you can track the tree's location and growth over the years. Your love, forever growing. 💚"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl text-center hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="bg-white w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-md mb-6 ring-2 ring-pink-200">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}