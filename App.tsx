import React, { useState, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UIOverlay } from './components/UIOverlay';
import { AppState, AmbienceType, AMBIENCE_SETTINGS } from './types';
import { Loader } from '@react-three/drei';

// Context for global app state
interface AppContextType extends AppState {
  setTvOn: (v: boolean) => void;
  setLightsOn: (v: boolean) => void;
  setFanOn: (v: boolean) => void;
  setAmbience: (v: AmbienceType) => void;
  setCurrentRoom: (v: 'living' | 'bedroom' | 'overview') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [tvOn, setTvOn] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [fanOn, setFanOn] = useState(true);
  const [ambience, setAmbience] = useState<AmbienceType>('calm');
  const [currentRoom, setCurrentRoom] = useState<'living' | 'bedroom' | 'overview'>('overview');

  const store: AppContextType = {
    tvOn, setTvOn,
    lightsOn, setLightsOn,
    fanOn, setFanOn,
    ambience, setAmbience,
    currentRoom, setCurrentRoom
  };

  const bgStyle = {
    backgroundColor: AMBIENCE_SETTINGS[ambience].bg,
    transition: 'background-color 1s ease'
  };

  return (
    <AppContext.Provider value={store}>
      <div className="relative w-full h-full" style={bgStyle}>
        <Canvas 
          shadows="soft"
          dpr={[1, 2]} 
          camera={{ position: [10, 10, 10], fov: 45 }}
        >
          <Scene />
        </Canvas>
        <UIOverlay />
        <Loader />
      </div>
    </AppContext.Provider>
  );
};

export default App;