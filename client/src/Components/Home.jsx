import React from 'react';
import MapContainer from './MapContainer';

function Home({mod, user}) {
 
  return (
    <div>
    {/* Contenitore della mappa */}
    <MapContainer mod={mod} user = {user} />
      
  </div>
  );
}

export default Home;