import { motion } from 'motion/react';
import { Leaf, MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface TreeGrowthProps {
  plantedDate?: Date;
  className?: string;
  treeSeed?: number; // Seed for consistent randomization per bouquet
}

// Different real reforestation project locations around the world
const REFORESTATION_LOCATIONS = [
  {
    name: "Madagascar Reforestation Project",
    area: "Andasibe-Mantadia National Park",
    lat: -18.9332,
    lng: 48.4191,
    latRange: 0.15, // Smaller variation to stay in forest
    lngRange: 0.15,
  },
  {
    name: "Amazon Rainforest Initiative",
    area: "Acre State region",
    lat: -9.4713,
    lng: -68.2947,
    latRange: 0.2,
    lngRange: 0.2,
  },
  {
    name: "East Africa Greenbelt",
    area: "Aberdare Forest, Kenya",
    lat: -0.3792,
    lng: 36.7001,
    latRange: 0.15,
    lngRange: 0.15,
  },
  {
    name: "Atlantic Forest Restoration",
    area: "Serra do Mar, Brazil",
    lat: -23.3485,
    lng: -44.7491,
    latRange: 0.2,
    lngRange: 0.2,
  },
  {
    name: "Borneo Rainforest Project",
    area: "Sabah rainforest region",
    lat: 5.4164,
    lng: 117.3228,
    latRange: 0.25,
    lngRange: 0.25,
  },
  {
    name: "Australian Bushland Recovery",
    area: "Daintree Rainforest",
    lat: -16.1700,
    lng: 145.4206,
    latRange: 0.15,
    lngRange: 0.15,
  },
];

export function TreeGrowth({ plantedDate = new Date(), className, treeSeed = Math.random() }: TreeGrowthProps) {
  // Use treeSeed to generate consistent random location per bloom
  const location = useMemo(() => {
    // Use seed to pick the same forest and location each time for this specific bloom
    const forestIndex = Math.floor(treeSeed * REFORESTATION_LOCATIONS.length);
    const randomProject = REFORESTATION_LOCATIONS[forestIndex];
    
    // Use seed to generate consistent variation within the forest area
    // Create two different offsets from the same seed
    const latOffset = ((treeSeed * 12345.6789) % 1) - 0.5; // Range: -0.5 to 0.5
    const lngOffset = ((treeSeed * 98765.4321) % 1) - 0.5; // Range: -0.5 to 0.5
    
    const lat = randomProject.lat + latOffset * randomProject.latRange;
    const lng = randomProject.lng + lngOffset * randomProject.lngRange;
    
    return {
      ...randomProject,
      actualLat: lat,
      actualLng: lng,
    };
  }, [treeSeed]);

  // Format coordinates to degrees/minutes
  const formatCoord = (value: number, isLat: boolean) => {
    const abs = Math.abs(value);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const direction = isLat ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${direction}`;
  };

  const seedlingImg = "https://images.unsplash.com/photo-1691867340330-6f318b9fc699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800";

  return (
    <div className={`bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-100 ${className}`}>
      <div className="relative h-64 sm:h-80 overflow-hidden group">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={seedlingImg} 
          alt="Your growing tree"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center space-x-2 text-emerald-100 mb-2">
            <Leaf className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm uppercase">Status: Planted</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{location.name}</h3>
        </div>
      </div>
      
      <div className="p-6 bg-emerald-50/50">
        <div className="flex items-start space-x-4">
          <div className="bg-emerald-100 p-3 rounded-full shrink-0">
            <MapPin className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Real Location</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your tree is planted in the {location.area}. 
              Coordinates: <span className="font-mono text-emerald-700">{formatCoord(location.actualLat, true)}, {formatCoord(location.actualLng, false)}</span>
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.actualLat},${location.actualLng}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 font-medium mt-2 inline-block hover:underline"
            >
              View on Map &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}