import React from 'react';
import SearchBar from './SearchBar';
import MapContainer from './MapContainer';

function Home({mod, user}) {
 
  return (
    <div>
    {/* Campo di ricerca */}
    <SearchBar />

    {/* Contenitore della mappa */}
    <MapContainer mod={mod} user = {user} />
      
  </div>
  );
}

export default Home;