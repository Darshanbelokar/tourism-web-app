import React, { useState } from 'react';
import BetlaNationalPark from "../assets/betlaNationalPark/BetlaNationalPark.jpg";
import Netarhat from "../assets/netarhatHillStation/Netarhat.jpg";
import HundruFalls from "../assets/hundruFalls/Hundru.jpeg";
import DeogharTemple from "../assets/deogharTempleComplex/DeogharTemple.jpg";
import HundruVideo from "../assets/hundruFalls/SSvid.net--Hundru-Falls-Ranchi_1080pFHR.mp4";

const destinations = [
  {
    name: 'Betla National Park',
    image: BetlaNationalPark,
    vrUrl: BetlaNationalPark,
  },
  {
    name: 'Netarhat Hill Station',
    image: Netarhat,
    vrUrl: Netarhat,
  },
  {
    name: 'Hundru Falls',
    image: HundruFalls,
    vrUrl: HundruFalls,
  },
  {
    name: 'Deoghar Temple Complex',
    image: DeogharTemple,
    vrUrl: DeogharTemple,
  },
];

export default function ARVR() {
  const [showVideo, setShowVideo] = useState(false);

  const handleViewVR = (dest) => {
    // Just show a message instead of opening images or videos
    alert(`AR/VR experience for ${dest.name} coming soon!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
        Virtual Tour of Jharkhand
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
        {destinations.map((dest) => (
          <div key={dest.name} style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px #eee', width: '300px', padding: '1rem', textAlign: 'center' }}>
            <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem' }}>{dest.name}</h2>
            <button
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              onClick={() => handleViewVR(dest)}
            >
              View AR/VR
            </button>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '2rem', color: '#555' }}>
        Click "View AR/VR" to explore destinations in immersive view!
      </p>
    </div>
  );
}
