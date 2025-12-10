import React from 'react';
import { useAppStore } from '../App';
import { AmbienceType } from '../types';
import { Monitor, Lightbulb, Fan, Home, Armchair, BedDouble } from 'lucide-react';

const Button: React.FC<{ 
  onClick: () => void; 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
}> = ({ onClick, active, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 backdrop-blur-md border
      ${active 
        ? 'bg-white/20 border-white/40 text-white shadow-lg shadow-white/10' 
        : 'bg-black/20 border-white/5 text-gray-300 hover:bg-black/40'}
    `}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const AmbienceSelector: React.FC = () => {
    const { ambience, setAmbience } = useAppStore();
    const options: AmbienceType[] = ['calm', 'daylight', 'midnight', 'neon'];
    
    return (
        <div className="flex flex-col gap-2 bg-black/30 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 px-1">Ambience</span>
            <div className="grid grid-cols-2 gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => setAmbience(opt)}
                        className={`
                            px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all
                            ${ambience === opt 
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export const UIOverlay: React.FC = () => {
  const { 
    tvOn, setTvOn, 
    lightsOn, setLightsOn, 
    fanOn, setFanOn,
    currentRoom, setCurrentRoom
  } = useAppStore();

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10">
      
      {/* Header / Title */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">3D-Architecture_model</h1>
          <p className="text-white/60 text-sm mt-1">Interactive Architectural Model </p>
        </div>
        <AmbienceSelector />
      </div>

      {/* Center Navigation Pills */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
         <div className="flex gap-1 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
            <button 
                onClick={() => setCurrentRoom('overview')}
                className={`p-3 rounded-xl transition-all ${currentRoom === 'overview' ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'}`}
                title="Overview"
            >
                <Home size={20} />
            </button>
            <button 
                onClick={() => setCurrentRoom('living')}
                className={`p-3 rounded-xl transition-all ${currentRoom === 'living' ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'}`}
                title="Living Room"
            >
                <Armchair size={20} />
            </button>
            <button 
                onClick={() => setCurrentRoom('bedroom')}
                className={`p-3 rounded-xl transition-all ${currentRoom === 'bedroom' ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'}`}
                title="Bedroom"
            >
                <BedDouble size={20} />
            </button>
         </div>
      </div>

      {/* Right Sidebar Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto bg-black/20 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
         <span className="text-xs text-center text-gray-400 font-semibold uppercase tracking-wider mb-2">Controls</span>
         
         <Button 
            active={lightsOn} 
            onClick={() => setLightsOn(!lightsOn)} 
            icon={<Lightbulb size={20} className={lightsOn ? "text-yellow-300" : ""} />} 
            label={lightsOn ? "Lights On" : "Lights Off"} 
         />
         
         <Button 
            active={tvOn} 
            onClick={() => setTvOn(!tvOn)} 
            icon={<Monitor size={20} className={tvOn ? "text-blue-300" : ""} />} 
            label={tvOn ? "TV Active" : "TV Standby"} 
         />
         
         <Button 
            active={fanOn} 
            onClick={() => setFanOn(!fanOn)} 
            icon={<Fan size={20} className={fanOn ? "animate-spin" : ""} />} 
            label={fanOn ? "Fan Auto" : "Fan Stop"} 
         />
      </div>

      {/* Credits */}
      <div className="text-white/20 text-xs font-mono absolute bottom-2 right-4">
        COSC3306 Final Project • React Three Fiber
      </div>
    </div>
  );
};